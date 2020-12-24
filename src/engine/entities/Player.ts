import Phaser from 'phaser';
import { Direction } from 'src/utils/Direction';

import { sceneEvents } from 'src/engine/events/EventCenter';
import { PLAYER_COINS_CHANGED } from 'src/engine/events/events';
import Chest from './Chest';

const PLAYER_SPEED = 200;
const ARROW_SPEED = 1000;

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {
      player(x: number,
        y: number,
        texture: string,
        frame?: string | number
      ): Player
    }
  }
}

enum HealthState {
  IDLE,
  DAMAGE,
  DEAD
}

enum PlayerState {
  NONE,
  JUMPING
}

class Player extends Phaser.Physics.Arcade.Sprite {
  private _health = 3;

  get health() {
    return this._health;
  }

  private _coins = 100;

  private direction = Direction.DOWN;

  private healthState = HealthState.IDLE;

  private playerState = PlayerState.NONE;

  private damageTime: number;

  private arrows?: Phaser.Physics.Arcade.Group;

  private activeChest?: Chest;

  idleFrames: any;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.damageTime = 0;

    this.idleFrames = {
      [Direction.DOWN]: 1,
      [Direction.LEFT]: 4,
      [Direction.RIGHT]: 7,
      [Direction.UP]: 10,
    };

    scene.input.on('pointerdown', function (this: Player, pointer: Phaser.Input.Pointer) {
      this.throwArrow(pointer);
    }, this);
  }

  setArrows(arrows: Phaser.Physics.Arcade.Group) {
    this.arrows = arrows;
  }

  setActiveChest(chest: Chest) {
    this.activeChest = chest;
  }

  private throwArrow(pointer: Phaser.Input.Pointer) {
    if (!this.arrows) return;
    this.anims.stop();
    this.setVelocity(0);

    const dx = pointer.worldX - this.x;
    const dy = pointer.worldY - this.y;
    const direction = new Phaser.Math.Vector2(dx, dy).normalize();
    const angle = direction.angle();

    const arrow = this.arrows.get(this.x, this.y, 'arrow') as Phaser.Physics.Arcade.Image;

    if (!arrow) return;

    this.scene.sound.get('bow').play();
    arrow
      .setSize(64, 64)
      .setActive(true)
      .setVisible(true)
      .setRotation(angle + 1.5707963)
      .setScale(0.35)
      .setVelocity(direction.x * ARROW_SPEED, direction.y * ARROW_SPEED)
      .setPipeline('Light2D');

    /*     arrow.x += direction.x * 16;
    arrow.y += direction.y * 16; */
  }

  handleDamage(direction: Phaser.Math.Vector2) {
    if (this._health <= 0) {
      return;
    }

    if (this.healthState === HealthState.DAMAGE) return;

    this._health -= 1;

    if (this._health <= 0) {
      this._health = 0;
      this.healthState = HealthState.DEAD;

      this.scene.tweens.add({
        targets: this,
        tint: 0x000000,
        duration: 500,
        ease: 'Sine.eastIn',
      });
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        duration: 1000,
        ease: 'Sine.eastIn',
      });
      this.setVelocity(0);
    } else {
      this.setVelocity(direction.x, direction.y);

      this.setTint(0xff0000);

      this.healthState = HealthState.DAMAGE;
      this.damageTime = 0;
    }
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    switch (this.healthState) {
      case HealthState.IDLE:
        break;
      case HealthState.DAMAGE:
        this.damageTime += delta;
        if (this.damageTime >= 250) {
          this.healthState = HealthState.IDLE;
          this.setTint(0xffffff);
          this.damageTime = 0;
        }
        break;

      default:
        break;
    }
  }

  private jump(pointer: Phaser.Input.Pointer) {
    const JUMP_COLOR = 0xff88ff;
    this.playerState = PlayerState.JUMPING;
    const shadows: Phaser.GameObjects.Image[] = [];
    this.anims.stop();
    this.setVelocity(0);
    this.setTint(JUMP_COLOR);
    const dx = pointer.worldX - this.x;
    const dy = pointer.worldY - this.y;

    const direction = new Phaser.Math.Vector2(dx, dy).normalize();
    const speed = 500;

    this.scene.sound.get('skill1').play();
    this.scene.tweens.add({
      targets: this,
      duration: 250,
      props: {
        rotation: 3.141 * 2,
      },
      ease: 'Stepped',
      easeParams: [20],
    });
    this.scene.tweens.add({
      targets: this.body.velocity,
      duration: 250,
      x: direction.x * speed,
      y: direction.y * speed,
      ease: 'Stepped',
      onComplete: () => {
        this.playerState = PlayerState.NONE;
        this.clearTint();
        shadows.map((shadow) => shadow.destroy());
      },
      onUpdate: () => {
        shadows.push(this.scene.add
          .image(this.x, this.y, 'dwarf', this.anims.currentFrame.textureFrame)
          .setScale(this.scale)
          .setAlpha(0.2)
          .setRotation(this.rotation)
          .setTint(JUMP_COLOR));
      },
    });
  }

  update(keys: any, pointer: Phaser.Input.Pointer) {
    if (this.healthState === HealthState.DAMAGE || this.healthState === HealthState.DEAD) {
      if (this.anims.isPlaying) this.anims.stop();
      return;
    }
    if (!keys) return;

    if (pointer.isDown) {
      return;
    }

    if (this.playerState === PlayerState.JUMPING) return;

    if (Phaser.Input.Keyboard.JustDown(keys.space) && this.playerState === PlayerState.NONE) {
      console.log('space', this.body.velocity);
      this.jump(pointer);
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(keys.E)) {
      if (this.activeChest) {
        const coins = this.activeChest.open();
        this._coins += coins;
        sceneEvents.emit(PLAYER_COINS_CHANGED, this._coins);
        console.log(this._coins);
      }
    }
    // velocity
    this.setVelocity(0);

    if (keys.left?.isDown) {
      this.setVelocityX(-PLAYER_SPEED);
    } else if (keys.right?.isDown) {
      this.setVelocityX(PLAYER_SPEED);
    }

    if (keys.up?.isDown) {
      this.setVelocityY(-PLAYER_SPEED);
    } else if (keys.down?.isDown) {
      this.setVelocityY(PLAYER_SPEED);
    }

    this.body.velocity.normalize().scale(PLAYER_SPEED);

    // animation
    if (
      keys.up?.isDown
      || keys.right?.isDown
      || keys.left?.isDown
      || keys.down?.isDown
    ) {
      this.activeChest = undefined;
      if (keys.left?.isDown) {
        this.anims.play('walk_left', true);
        this.direction = Direction.LEFT;
      } else if (keys.right?.isDown) {
        this.anims.play('walk_right', true);
        this.direction = Direction.RIGHT;
      } else if (keys.up?.isDown) {
        this.anims.play('walk_up', true);
        this.direction = Direction.UP;
      } else if (keys.down?.isDown) {
        this.anims.play('walk_down', true);
        this.direction = Direction.DOWN;
      }
    } else if (this.anims.isPlaying) {
      this.anims.stop();
      this.setFrame(this.idleFrames[this.direction]);
    }
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
