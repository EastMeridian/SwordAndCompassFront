import Phaser from 'phaser';
import { Direction, getDirectionFromVector } from 'src/utils/Direction';
import { Damage } from 'src/utils/Damage';
import DetectionCircle from 'src/engine/entities/others/DetectionCircle';
import HealthComponent from 'src/engine/components/HealthComponent';
import DirectionComponent from 'src/engine/components/DirectionComponent';
import { StateMachine } from 'src/engine/system/StateMachine';
import { Cooldown } from 'src/utils/Cooldown';
import SkillsComponent from 'src/engine/components/SkillsComponent';
import { BokoblinData, EnemyData } from 'src/engine/data/entities';
import Character from '../Character';
import {
  IdleState,
  FollowState,
  DamageState,
  StrikeState,
  StateMachineBokoblinOptions,
} from './States';
import { StateMachineEnemyOptions, DeadState } from '../States';
import Enemy from '../Enemy';

class Bokoblin extends Enemy {
  private detectionCircle!: DetectionCircle;

  private swingDetectionCircle!: DetectionCircle;

  private expressionBalloon?: Phaser.GameObjects.Sprite;

  private target: Phaser.Physics.Arcade.Sprite | null = null;

  public swingTarget: Phaser.Physics.Arcade.Sprite | null = null;

  public health: HealthComponent;

  public direction: DirectionComponent;

  public stateMachine: StateMachine<StateMachineBokoblinOptions | StateMachineEnemyOptions>;

  public swingCooldown: Cooldown;

  public skills: SkillsComponent;

  public speed: number;

  public entity: EnemyData;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    data: BokoblinData,
  ) {
    super(scene, x, y, texture);
    const { health, speed, cooldown } = data;
    this.entity = data;
    this.direction = new DirectionComponent(Direction.DOWN);
    this.health = new HealthComponent({ scene, character: this, health });
    this.skills = new SkillsComponent(this);

    this.speed = speed;
    this.swingCooldown = new Cooldown(scene, cooldown);
    this.stateMachine = new StateMachine('idle', {
      idle: new IdleState(),
      follow: new FollowState(),
      damage: new DamageState(),
      strike: new StrikeState(),
      dead: new DeadState(),
    }, { character: this, scene, name: 'bokoblin' });

    this.depth = 1;
    this.setScale(1.8);

    this.anims.play(`bokoblin_idle_${Direction.DOWN}`);
    this.expressionBalloon = this.scene.add.sprite(x, y, 'balloon')
      .setScale(0.8)
      .setOrigin(-0.25, 1.1)
      .setDepth(2)
      .setAlpha(0);
  }

  hasTarget() {
    return this.target !== null;
  }

  hasSwingTarget() {
    return this.swingTarget !== null;
  }

  getTargetDeltaVector() {
    if (this.target) {
      const dx = this.target.x - this.x;
      const dy = this.target.y - this.y;

      return new Phaser.Math.Vector2(dx, dy).normalize();
    }
    return null;
  }

  setDetectionCircle(
    detectionCircles: Phaser.Physics.Arcade.Group,
    detectionCircleSize: number = 250,
    hitCircleSize: number = 100,
  ) {
    this.detectionCircle = detectionCircles.get(this.x, this.y);
    this.detectionCircle.setOwner(this)
      .setOnDetect((player) => this.detectPlayer(player))
      .body
      .setCircle(detectionCircleSize)
      .setOffset(
        -detectionCircleSize + this.displayWidth / 2,
        -detectionCircleSize + this.displayHeight / 2,
      );

    this.swingDetectionCircle = detectionCircles.get(this.x, this.y);
    this.swingDetectionCircle.setOwner(this)
      .setOnDetect((player) => this.setSwingTarget(player))
      .body
      .setCircle(hitCircleSize)
      .setOffset(
        -hitCircleSize + this.displayWidth / 2,
        -hitCircleSize + this.displayHeight / 2,
      );
    return this;
  }

  detectPlayer(player: Character) {
    if (this.expressionBalloon && !this.target) {
      this.expressionBalloon.setAlpha(1)
        .play('exclamation_balloon', true)
        .on('animationcomplete', () => {
          this.expressionBalloon?.setAlpha(0);
          this.setTarget(player);
        });
    }
  }

  update() {
    if (this.body) {
      this.detectionCircle?.copyPosition(this.body.position);
      this.swingDetectionCircle?.copyPosition(this.body.position);
      this.expressionBalloon?.copyPosition(this.body.position);

      this.stateMachine?.step();
      this.skills.update();

      if (!this.health.isDead()) {
        this.depth = this.y + this.height / 2;
      }
    }
  }

  setTarget(player: Character | null) {
    this.target = player;
    return this;
  }

  setSwingTarget(player: Character | null) {
    this.swingTarget = player;
    return this;
  }

  destroy() {
    super.destroy();
    this.detectionCircle?.setActive(false);
    this.swingDetectionCircle?.setActive(false);
    this.expressionBalloon?.destroy();
  }
}

export default Bokoblin;
