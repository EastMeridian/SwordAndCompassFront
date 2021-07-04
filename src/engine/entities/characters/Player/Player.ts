import Phaser from 'phaser';
import { Direction, getDirectionFromOrientation } from 'src/utils/Direction';
import { Damage } from 'src/utils/Damage';
import { sceneEvents } from 'src/engine/events/EventCenter';
import {
  ENEMY_DIE,
  PLAYER_CHANGED_SPELL,
  PLAYER_COINS_CHANGED,
  PLAYER_DEAD,
  PLAYER_ENERGY_CHANGED,
  PLAYER_GET_MESSAGE,
  PLAYER_HEALTH_CHANGED,
  PLAYER_LEVEL_CHANGED,
  PLAYER_STACKABLE_CHANGED,
} from 'src/engine/events/events';
import { StateMachine } from 'src/engine/system/StateMachine';
import {
  Orders,
  createOrders,
  getOrderFromKeys,
  Order,
} from 'src/utils/Order';
import HealthComponent, { HealthState } from 'src/engine/components/HealthComponent';
import DirectionComponent from 'src/engine/components/DirectionComponent';
import SkillsComponent from 'src/engine/components/SkillsComponent';
import { SkillData } from 'src/engine/components/skills/SkillData';
import { InventoryComponent } from 'src/engine/components/InventoryComponent';
import { Stackable } from 'src/engine/components/Stackable';
import { Attribute, Attributes } from 'src/engine/components/Attributes';
import { EnemyData, PlayerData } from 'src/engine/data/entities';
import { LevelingComponent } from 'src/engine/components/LevelingComponent';
import { Interactives } from 'src/engine/system/factories/createInteractive';
import Chest from '../../objects/Chest';
import {
  IdleState,
  MoveState,
  JumpState,
  ActionOneState,
  DamageState,
  StateMachineOptions,
  FallingState,
  DeadState,
} from './States';
import Character from '../Character';
import { Interactive } from '../../objects/Interactive';

class Player extends Character {
  public energy = 100;

  private _maxEnergy = 100;

  private _energyRegeneration = 7;

  private _damage: Damage = { amount: 1 };

  get maxEnergy() {
    return this._maxEnergy;
  }

  get energyRegeneration() {
    return this._energyRegeneration;
  }

  get damage() {
    return this._damage;
  }

  private activeInteractive?: Interactive;

  private energyEvent: any;

  private stateMachine: StateMachine<StateMachineOptions>;

  private pointer: Phaser.Input.Pointer;

  orders: Orders = createOrders();

  public health: HealthComponent;

  public direction: DirectionComponent;

  public inventory: InventoryComponent;

  public leveling: LevelingComponent;

  private falling = false;

  private jumping = false;

  public entity: PlayerData;

  public attributes: Attributes;

  public talking = false;

  skills: SkillsComponent;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    playerData: PlayerData,
  ) {
    super(scene, x, y, playerData.texture);
    const { attributes, anims, health } = playerData;

    this.entity = playerData;
    // COMPONENTS
    this.leveling = new LevelingComponent(() => {
      sceneEvents.emit(PLAYER_LEVEL_CHANGED);
    });

    this.direction = new DirectionComponent(Direction.DOWN);

    this.health = new HealthComponent({
      scene,
      character: this,
      health,
      invulnerabilityTime: 300,
      onChange: (health: number) => {
        sceneEvents.emit(PLAYER_HEALTH_CHANGED, { health, maximum: this.health.maximum });
      },
      onDie: () => {
        sceneEvents.emit(PLAYER_DEAD);
      },
    });

    this.inventory = new InventoryComponent({
      arrow: {
        name: 'arrow',
        amount: 1000,
        frame: 106,
      },
      gold: {
        name: 'gold',
        amount: 0,
        frame: 220,
      },
    }, (item: Stackable) => {
      sceneEvents.emit(PLAYER_STACKABLE_CHANGED, item);
    });

    this.skills = new SkillsComponent(this, (data: SkillData) => {
      sceneEvents.emit(PLAYER_CHANGED_SPELL, data);
    });

    this.attributes = attributes;
    // EVENTS
    scene.input.on('pointerdown', function (this: Player) {
      this.orders[Order.ACTION_ONE] = true;
    }, this);

    this.energyEvent = scene.time.addEvent({
      delay: 500,
      callback: () => {
        if (this.energy < this._maxEnergy) {
          this.energy += this._energyRegeneration;
          if (this.energy > this._maxEnergy) this.energy = this._maxEnergy;
          sceneEvents.emit(PLAYER_ENERGY_CHANGED, this.energy);
        }
      },
      loop: true,
    });

    this.stateMachine = new StateMachine('idle', {
      idle: new IdleState(),
      move: new MoveState(),
      jump: new JumpState(),
      action: new ActionOneState(),
      damage: new DamageState(),
      dead: new DeadState(),
      falling: new FallingState(),
    }, { character: this, scene, name: anims });

    this.pointer = scene.input.mousePointer;

    sceneEvents.on(ENEMY_DIE, (enemy: EnemyData) => {
      this.leveling.addExperience(enemy.experience);
    });
  }

  isTalking() {
    return this.talking;
  }

  setTalking(talking = true) {
    this.talking = talking;
  }

  isJumping() {
    return this.jumping;
  }

  isFalling() {
    return this.falling;
  }

  setJumping(jumping: boolean) {
    this.jumping = jumping;
  }

  setFalling(falling: boolean) {
    this.falling = falling;
  }

  setActiveInteractive(interactive: Interactive) {
    this.activeInteractive = interactive;
  }

  getPointerDirection() {
    return getDirectionFromOrientation(
      this.x,
      this.y,
      this.pointer.worldX,
      this.pointer.worldY,
    );
  }

  getPointerOrientation() {
    return new Phaser.Math
      .Vector2(this.pointer.worldX - this.x, this.pointer.worldY - this.y)
      .normalize();
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
  }

  jump(onComplete?: () => void) {
    this.health.setDamaged(HealthState.DAMAGE);
    const JUMP_COLOR = 0xff88ff;
    const shadows: Phaser.GameObjects.Image[] = [];

    this.energy -= 30;
    sceneEvents.emit(PLAYER_ENERGY_CHANGED, this.energy);

    this.anims.stop();
    this.setVelocity(0);

    this.setTint(JUMP_COLOR);
    const dx = this.pointer.worldX - this.x;
    const dy = this.pointer.worldY - this.y;

    const orientation = new Phaser.Math.Vector2(dx, dy).normalize();
    const direction = this.getPointerDirection();
    this.direction.setDirection(direction);

    const jumpDirection = direction !== Direction.LEFT ? 1 : -1;

    const speed = this.attributes.speed * 3;

    this.scene.sound.get('skill1').play();
    this.scene.tweens.add({
      targets: this,
      duration: 300,
      props: {
        rotation: 3.141 * 2 * jumpDirection,
      },
      ease: 'Stepped',
      easeParams: [20],
    });
    this.scene.tweens.add({
      targets: this.body.velocity,
      duration: 300,
      x: orientation.x * speed,
      y: orientation.y * speed,
      ease: 'Stepped',
      onComplete: () => {
        this.setVelocity(0);
        this.clearTint();
        this.health.setDamaged(HealthState.IDLE);
        shadows.map((shadow) => shadow.destroy());
        onComplete?.();
      },
      onUpdate: () => {
        shadows.push(this.scene.add
          .image(this.x, this.y, this.texture, this.anims.currentFrame.textureFrame)
          .setScale(this.scale)
          .setAlpha(0.2)
          .setRotation(this.rotation)
          .setTint(JUMP_COLOR));
      },
    });
  }

  update(keys: any) {
    if (Phaser.Input.Keyboard.JustDown(keys.E)) {
      if (this.activeInteractive) {
        this.activeInteractive.interact(this);
      }
    }

    if (Phaser.Input.Keyboard.JustDown(keys.A)) {
      this.skills.setNext();
    }

    this.stateMachine.step();

    this.orders = getOrderFromKeys(keys);

    this.skills.update();

    this.depth = this.y + this.height / 2;

    if (this.talking && this.activeInteractive === undefined) {
      console.log('player_end_message', this.talking, this.activeInteractive);
      this.setTalking(false);
      sceneEvents.emit(PLAYER_GET_MESSAGE);
    }

    this.activeInteractive = undefined;
  }

  public buyAttribute(name: Attribute) {
    if (this.leveling.consumeReward()) {
      if (name === Attribute.speed) {
        this.attributes[name] += 2;
      } else {
        this.attributes[name] += 1;
      }
    }
  }

  destroy() {
    this.energyEvent.destroy();
    this.stateMachine.destroy();
    super.destroy();
  }
}

Phaser.GameObjects.GameObjectFactory.register('player', function (
  this: Phaser.GameObjects.GameObjectFactory,
  x: number,
  y: number,
  playerData: PlayerData,
) {
  const sprite = new Player(this.scene, x, y, playerData).setScale(1.6);

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);

  return sprite;
});

export default Player;
