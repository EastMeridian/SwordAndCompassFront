import Phaser from 'phaser';
import { Direction } from 'src/utils/Direction';
import {
  Orders,
  createOrders,
  Order,
} from 'src/utils/Order';
import HealthComponent from 'src/engine/components/HealthComponent';
import DirectionComponent from 'src/engine/components/DirectionComponent';
import { StateMachine } from 'src/engine/system/StateMachine';

import {
  MoveState,
  DamageState,
  StateMachineOptions,
} from './States';
import Character from '../Character';

const getRandomDirection = (direction: Direction) => {
  let nextDirection;
  do {
    nextDirection = Phaser.Math.Between(0, 3);
  } while (nextDirection === direction);
  return nextDirection;
};

class Ghost extends Character {
  public health: HealthComponent;

  private moveEvent: Phaser.Time.TimerEvent;

  private stateMachine: StateMachine<StateMachineOptions>;

  public direction: DirectionComponent;

  orders: Orders = createOrders({ [Order.DOWN]: true });

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.direction = new DirectionComponent(Direction.DOWN);
    this.health = new HealthComponent(scene, this);

    this.setScale(1.6);
    this.anims.play('ghost_walk_down');

    scene.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE,
      this.handleTileCollision,
      this,
    );

    this.moveEvent = scene.time.addEvent({
      delay: 2000,
      callback: () => {
        const nextDirection = getRandomDirection(this.direction.value);
        this.direction.setDirection(nextDirection);
      },
      loop: true,
    });

    this.stateMachine = new StateMachine('move', {
      move: new MoveState(),
      damage: new DamageState(),
    }, { character: this, scene, name: 'ghost' });
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    this.stateMachine.step();
  }

  handleTileCollision(gameObject: Phaser.GameObjects.GameObject) {
    if (gameObject !== this) return;

    const nextDirection = getRandomDirection(this.direction.value);
    this.direction.setDirection(nextDirection);
  }

  destroy() {
    this.moveEvent.destroy();

    super.destroy();
  }
}

export default Ghost;
