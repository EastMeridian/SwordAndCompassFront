import Phaser from 'phaser';
import { Damage } from 'src/utils/Damage';
import Character from 'src/engine/entities/characters/Character';

export enum HealthState {
  IDLE,
  DAMAGE,
  DEAD
}

export default class HealthComponent {
  private _health: number;

  get value() {
    return this._health;
  }

  private scene: Phaser.Scene;

  private healthState = HealthState.IDLE;

  private character: Character;

  constructor(scene: Phaser.Scene, character: Character, health: number = 3) {
    this.scene = scene;
    this.character = character;
    this._health = health;
  }

  isDamaged() {
    return this.healthState === HealthState.DAMAGE;
  }

  isDead() {
    return this.healthState === HealthState.DEAD;
  }

  setDamaged(healthState: HealthState) {
    this.healthState = healthState;
  }

  getOneShot() {
    this._health = 0;
  }

  handleDamage(damage: Damage) {
    if (this._health <= 0) {
      return;
    }
    if (this.healthState === HealthState.DAMAGE) return;

    this._health -= damage.amount;

    if (this._health <= 0) {
      this.character.setVelocity(0);

      this._health = 0;

      this.scene.tweens.add({
        targets: this.character.body.velocity,
        duration: 150,
        x: damage.direction?.x,
        y: damage.direction?.y,
        ease: 'Stepped',
        onComplete: () => {
          this.character.setVelocity(0);
          this.healthState = HealthState.DEAD;
        },
      });

      this.scene.tweens.add({
        targets: this.character,
        tint: 0x000000,
        duration: 250,
        ease: 'Sine.eastIn',
      });
      this.scene.tweens.add({
        targets: this.character,
        alpha: 0,
        duration: 250,
        ease: 'Sine.eastIn',
        onComplete: () => this.character.destroy(),
      });
    } else {
      this.character.setVelocity(0);
      this.healthState = HealthState.DAMAGE;
      this.character.setTint(0xff0000);

      this.scene.tweens.add({
        targets: this.character.body.velocity,
        duration: 150,
        x: damage.direction?.x,
        y: damage.direction?.y,
        ease: 'Stepped',
        onComplete: () => {
          this.character.setVelocity(0);
        },
      });

      /*       scene.time.delayedCall(500, () => {
        this.stateMachine.transition('move');
      }); */

      this.scene.time.delayedCall(500, () => {
        this.character.clearTint();
        this.healthState = HealthState.IDLE;
      });
    }
  }
}
