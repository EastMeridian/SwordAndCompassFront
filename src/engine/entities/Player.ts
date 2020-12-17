import Phaser from 'phaser';
import { Direction } from 'src/utils/Direction';

const PLAYER_SPEED = 300;

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
  DAMAGE
}

class Player extends Phaser.Physics.Arcade.Sprite {
  private _health = 0;

  get health() {
    return this._health;
  }

  private direction = Direction.DOWN;

  private healthState = HealthState.IDLE;

  private damageTime: number;

  idleFrames: any;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);
    this.damageTime = 0;

    console.log('player built');

    this.idleFrames = {
      [Direction.DOWN]: 1,
      [Direction.LEFT]: 4,
      [Direction.RIGHT]: 7,
      [Direction.UP]: 10,
    };
  }

  handleDamage(direction: Phaser.Math.Vector2) {
    if (this.healthState === HealthState.DAMAGE) return;

    this.setVelocity(direction.x, direction.y);

    this.setTint(0xff0000);

    this.healthState = HealthState.DAMAGE;
    this.damageTime = 0;

    --this._health;

    if(this._health <= 0)
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

  update(keys: Phaser.Types.Input.Keyboard.CursorKeys) {
    if (this.healthState === HealthState.DAMAGE) {
      this.anims.stop();
      return;
    }
    if (!keys) return;
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

    this.body.velocity.normalize().scale(400);

    // animation
    if (
      keys.up?.isDown
      || keys.right?.isDown
      || keys.left?.isDown
      || keys.down?.isDown
    ) {
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
      console.log('anim stop');
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
