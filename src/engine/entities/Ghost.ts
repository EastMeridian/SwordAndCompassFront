import Phaser from 'phaser';
import { FRAME_RATE } from 'src/constants';
import { Direction } from 'src/utils/Direction';

const getRandomDirection = (direction: Direction) => {
  let nextDirection = Phaser.Math.Between(1, 4);
  while (nextDirection === direction) {
    nextDirection = Phaser.Math.Between(1, 4);
  }
  return nextDirection;
};

class Ghost extends Phaser.Physics.Arcade.Sprite {
  private direction = Direction.RIGHT;

  private moveEvent: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
    super(scene, x, y, texture, frame);

    this.setScale(1.6);
    this.anims.play('monster_walk_down');

    scene.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE,
      this.handleTileCollision,
      this,
    );

    this.moveEvent = scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.direction = getRandomDirection(this.direction);
        console.log('addEvent');
      },
      loop: true,
    });
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    const SPEED = 150;
    if (this.direction === Direction.UP) {
      this.setVelocity(0, -SPEED);
      this.anims.play('monster_walk_up', true);
    } else if (this.direction === Direction.DOWN) {
      this.setVelocity(0, SPEED);
      this.anims.play('monster_walk_down', true);
    } else if (this.direction === Direction.LEFT) {
      this.setVelocity(-SPEED, 0);
      this.anims.play('monster_walk_left', true);
    } else if (this.direction === Direction.RIGHT) {
      this.setVelocity(SPEED, 0);
      this.anims.play('monster_walk_right', true);
    }
  }

  handleTileCollision(gameObject: Phaser.GameObjects.GameObject) {
    if (gameObject !== this) return;

    this.direction = getRandomDirection(this.direction);
  }

  destroy(fromScene?: boolean) {
    this.moveEvent.destroy();

    super.destroy(fromScene);
  }
}

export default Ghost;
