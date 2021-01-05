import Phaser from 'phaser';
import { Direction, getDirectionFromVector } from 'src/utils/Direction';
import { Damage } from 'src/utils/Damage';
import DetectionCircle from 'src/engine/entities/others/DetectionCircle';
import HealthComponent from 'src/engine/components/HealthComponent';
import DirectionComponent from 'src/engine/components/DirectionComponent';
import { StateMachine } from 'src/engine/system/StateMachine';
import { Cooldown } from 'src/utils/Cooldown';
import SkillsComponent from 'src/engine/components/SkillsComponent';
import Character from '../Character';
import {
  IdleState,
  FollowState,
  DamageState,
  StrikeState,
  StateMachineOptions,
  DeadState,
} from './States';

class Bokoblin extends Character {
  private detectionCircle!: DetectionCircle;

  private swingDetectionCircle!: DetectionCircle;

  private expressionBalloon?: Phaser.GameObjects.Sprite;

  private target: Phaser.Physics.Arcade.Sprite | null = null;

  public swingTarget: Phaser.Physics.Arcade.Sprite | null = null;

  public health: HealthComponent;

  public direction: DirectionComponent;

  public stateMachine: StateMachine<StateMachineOptions> | null;

  public swingCooldown: Cooldown;

  public skills: SkillsComponent;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string,
  ) {
    super(scene, x, y, texture, frame);

    this.direction = new DirectionComponent(Direction.DOWN);
    this.health = new HealthComponent(scene, this, 4);
    this.skills = new SkillsComponent(this);

    this.swingCooldown = new Cooldown(scene, 750);
    this.stateMachine = new StateMachine('idle', {
      idle: new IdleState(),
      follow: new FollowState(),
      damage: new DamageState(),
      strike: new StrikeState(),
      dead: new DeadState(),
    }, { character: this, scene, name: 'bokoblin' });

    this.depth = 1;
    this.setScale(1.75);
    this.anims.play('bokoblin_walk_down');

    this.expressionBalloon = this.scene.add.sprite(this.x, this.y, 'balloon')
      .setOrigin(-0.05, 1)
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

  setDetectionCircle(detectionCircles: Phaser.Physics.Arcade.Group) {
    this.detectionCircle = detectionCircles.get(this.x, this.y);
    this.detectionCircle.setOwner(this)
      .setOnDetect((player) => this.detectPlayer(player))
      .body
      .setCircle(200)
      .setOffset(-172, -172);

    this.swingDetectionCircle = detectionCircles.get(this.x, this.y);
    this.swingDetectionCircle.setOwner(this)
      .setOnDetect((player) => this.setSwingTarget(player))
      .body
      .setCircle(90)
      .setOffset(-62, -62);
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

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    if (this.body) {
      this.detectionCircle?.copyPosition(this.body.position);
      this.swingDetectionCircle?.copyPosition(this.body.position);
      this.expressionBalloon?.copyPosition(this.body.position);

      this.stateMachine?.step();
    }
  }

  update() {
    this.skills.update();
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
    this.stateMachine?.destroy();
    this.detectionCircle?.destroy();
    this.swingDetectionCircle?.destroy();
    this.expressionBalloon?.destroy();
    super.destroy();
  }
}

export default Bokoblin;
