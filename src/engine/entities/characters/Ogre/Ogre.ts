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
  IdleState,
  FollowState,
  DamageState,
  DeadState,
  StateMachineOptions,
  ChargeState,
} from './States';
import Character from '../Character';
import DetectionCircle from '../../others/DetectionCircle';

class Ogre extends Character {
    private detectionCircle!: DetectionCircle;

  public health: HealthComponent;

  private stateMachine: StateMachine<StateMachineOptions>;

  public direction: DirectionComponent;

  public speed = 120;

  public target: Phaser.Physics.Arcade.Sprite | null = null;

  public balloon?: Phaser.GameObjects.Sprite;

  orders: Orders = createOrders({ [Order.DOWN]: true });

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.direction = new DirectionComponent(Direction.DOWN);
    this.health = new HealthComponent({ scene, health: 10, character: this });

    this.setScale(1.8);

    this.stateMachine = new StateMachine('idle', {
      idle: new IdleState(),
      follow: new FollowState(),
      damage: new DamageState(),
      dead: new DeadState(),
      charge: new ChargeState(),
    }, { character: this, scene, name: 'ogre' });

    this.balloon = this.scene.add.sprite(x, y, 'balloon')
      .setOrigin(-0.8, 1)
      .setDepth(2)
      .setAlpha(0);

    scene.physics.world.on(
      Phaser.Physics.Arcade.Events.TILE_COLLIDE,
      this.handleTileCollision,
      this,
    );
  }

  hasTarget() {
    return this.target !== null;
  }

  setTarget(player: Character | null) {
    this.target = player;
    return this;
  }

  setDetectionCircle(
    detectionCircles: Phaser.Physics.Arcade.Group,
    detectionCircleSize: number = 250,
  ) {
    this.detectionCircle = detectionCircles.get(this.x, this.y);
    this.detectionCircle.setOwner(this)
      .setOnDetect((player) => this.setTarget(player))
      .body
      .setCircle(detectionCircleSize)
      .setOffset(
        -detectionCircleSize + this.displayWidth / 2,
        -detectionCircleSize + this.displayHeight / 2,
      );

    return this;
  }

  getTargetDeltaVector() {
    if (this.target) {
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;

      return new Phaser.Math.Vector2(dx, dy).normalize();
    }
    return null;
  }

  update() {
    if (this.body) {
      this.detectionCircle?.copyPosition(this.body.position);
      this.balloon?.copyPosition(this.body.position);

      this.stateMachine?.step();
    }
  }

  handleTileCollision(gameObject: Phaser.GameObjects.GameObject) {
    if (gameObject !== this) return;
    if (this.stateMachine.state === 'charge') {
      this.stateMachine.transition('idle');
      this.scene.cameras.main.shake(300, 0.01);
    }
  }

  destroy() {
    this.stateMachine?.destroy();

    super.destroy();
  }
}

export default Ogre;
