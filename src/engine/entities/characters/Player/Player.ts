import Phaser from 'phaser';
import { Direction, getDirectionFromOrientation } from 'src/utils/Direction';
import { Damage } from 'src/utils/Damage';
import { sceneEvents } from 'src/engine/events/EventCenter';
import { PLAYER_COINS_CHANGED, PLAYER_ENERGY_CHANGED } from 'src/engine/events/events';
import { StateMachine, State } from 'src/engine/system/StateMachine';
import {
  Orders,
  createOrders,
  getOrderFromKeys,
  Order,
} from 'src/utils/Order';
import HealthComponent, { HealthState } from 'src/engine/components/HealthComponent';
import DirectionComponent from 'src/engine/components/DirectionComponent';
import SkillsComponent from 'src/engine/components/SkillsComponent';
import Chest from '../../objects/Chest';
import SwordSwing from '../../spells/SwordSwing';
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

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {

      player(x: number,
        y: number,
        texture: string,
        frame?: string | number
      ): Player

      swordSwing(x: number,
        y: number,
        texture: string,
        frame?: string | number
      ): SwordSwing
    }
  }
}

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

  private _coins = 100;

  private arrows?: Phaser.Physics.Arcade.Group;

  private activeChest?: Chest;

  private energyEvent: any;

  private stateMachine: StateMachine<StateMachineOptions>;

  private pointer: Phaser.Input.Pointer;

  orders: Orders = createOrders();

  public health: HealthComponent;

  public direction: DirectionComponent;

  private falling = false;

  private jumping = false;

  skills: SkillsComponent;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    this.direction = new DirectionComponent(Direction.DOWN);
    this.health = new HealthComponent(scene, this, 5);
    this.skills = new SkillsComponent(this);

    scene.input.on('pointerdown', function (this: Player) {
      this.orders[Order.ACTION_ONE] = true;
    }, this);

    this.anims.play('walk_down');

    this.depth = 1;

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
    }, { character: this, scene, name: 'player' });

    this.pointer = scene.input.mousePointer;
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

  setArrows(arrows: Phaser.Physics.Arcade.Group) {
    this.arrows = arrows;
  }

  setActiveChest(chest: Chest) {
    this.activeChest = chest;
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

    const speed = 550;

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
          .image(this.x, this.y, 'character', this.anims.currentFrame.textureFrame)
          .setScale(this.scale)
          .setAlpha(0.2)
          .setRotation(this.rotation)
          .setTint(JUMP_COLOR));
      },
    });
  }

  update(keys: any) {
    if (Phaser.Input.Keyboard.JustDown(keys.E)) {
      if (this.activeChest) {
        const coins = this.activeChest.open();
        this._coins += coins;
        sceneEvents.emit(PLAYER_COINS_CHANGED, this._coins);
      }
    }

    if (Phaser.Input.Keyboard.JustDown(keys.A)) {
      this.skills.setCurrent(this.skills.current === 'arrow' ? 'weapon' : 'arrow');
    }

    this.stateMachine.step();

    this.orders = getOrderFromKeys(keys);

    this.skills.update();
  }

  destroy() {
    this.energyEvent.destroy();

    super.destroy();
  }
}

Phaser.GameObjects.GameObjectFactory.register('player', function (
  this: Phaser.GameObjects.GameObjectFactory,
  x: number,
  y: number,
  texture: string,
  frame?: string | number,
) {
  const sprite = new Player(this.scene, x, y, texture, frame).setScale(1.6);

  this.displayList.add(sprite);
  this.updateList.add(sprite);

  this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);

  return sprite;
});

export default Player;
