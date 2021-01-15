import Phaser from 'phaser';
import { Direction } from 'src/utils/Direction';

import HealthComponent from 'src/engine/components/HealthComponent';
import DirectionComponent from 'src/engine/components/DirectionComponent';
import { StateMachine } from 'src/engine/system/StateMachine';

import { BatData, EnemyData } from 'src/engine/data/entities';
import {
  MoveState,
  DamageState,
  DeadState,
  StateMachineOptions,
} from './States';
import Character from '../Character';
import Enemy from '../Enemy';

const getRandomDirection = (direction: Direction) => {
  let nextDirection;
  do {
    nextDirection = Phaser.Math.Between(0, 3);
  } while (nextDirection === direction);
  return nextDirection;
};

class PrimitiveAnimal extends Enemy {
  public health: HealthComponent;

  private moveEvent: Phaser.Time.TimerEvent;

  private stateMachine: StateMachine<StateMachineOptions>;

  public direction: DirectionComponent;

  public entity: EnemyData;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, anims: string = 'ghost') {
    super(scene, x, y, texture);

    this.entity = BatData;

    this.direction = new DirectionComponent(Direction.DOWN);
    this.health = new HealthComponent({ scene, character: this, health: BatData.health });

    this.setScale(1.6);

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
      dead: new DeadState(),
    }, { character: this, scene, name: anims });
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
    this.stateMachine?.destroy();

    super.destroy();
  }
}

export default PrimitiveAnimal;
