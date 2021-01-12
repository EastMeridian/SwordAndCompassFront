import Phaser from 'phaser';
import { Damage } from 'src/utils/Damage';
import Character from 'src/engine/entities/characters/Character';

export enum HealthState {
  IDLE,
  DAMAGE,
  DEAD,
  INVULNERABLE
}

interface Options {
  scene: Phaser.Scene
  character: Character
  health?: number
  onChange?: (value: number) => void
  onDie?: () => void
  invulnerabilityTime?: number
  tenacity?: number;
}

export default class HealthComponent {
  private _health: number;

  private _maximum: number;

  get amount() {
    return this._health;
  }

  get maximum() {
    return this._maximum;
  }

  private scene: Phaser.Scene;

  private healthState = HealthState.IDLE;

  private character: Character;

  private _invulerabilityTime: number;

  get invulnerabilityTime() {
    return this._invulerabilityTime;
  }

  private tenacity: number;

  private onChange?: (value: number) => void;

  private onDie?: () => void;

  constructor({
    scene,
    character,
    health = 1,
    onChange,
    onDie,
    invulnerabilityTime = 200,
    tenacity = 1,
  }: Options) {
    this.scene = scene;
    this.character = character;
    this._health = health;
    this._maximum = health;
    this.onChange = onChange;
    this.onDie = onDie;
    this._invulerabilityTime = invulnerabilityTime;
    this.tenacity = tenacity;
  }

  isDamageable() {
    return !this.isDamaged() && !this.isInvulnerable();
  }

  isInvulnerable() {
    return this.healthState === HealthState.INVULNERABLE;
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

  oneShot() {
    this._health = 0;
    this.onChange?.(this._health);
    this.onDie?.();
  }

  add(health: number) {
    this._health += health;
    if (this._health > this._maximum) this._health = this._maximum;
    this.onChange?.(this._health);
  }

  handleDamage(damage: Damage) {
    if (this._health <= 0) {
      return;
    }
    if (this.healthState === HealthState.DAMAGE
      || this.healthState === HealthState.INVULNERABLE) return;

    this._health -= damage.amount;

    this.character.setVelocity(0);

    if (this._health <= 0) {
      // DEAD
      this._health = 0;
      this.onChange?.(this._health);

      this.scene.tweens.add({
        targets: this.character.body.velocity,
        duration: 150,
        x: damage.direction?.x,
        y: damage.direction?.y,
        ease: 'Stepped',
        onComplete: () => {
          this.character.setVelocity(0);
          this.character.disableBody();
          this.character.clearTint();
          this.onDie?.();
        },
      });
      this.healthState = HealthState.DEAD;
      this.character.setTint(0xff0000);
    } else {
      // DAMAGED
      this.healthState = HealthState.DAMAGE;
      this.character.setTint(0xff0000);
      this.onChange?.(this._health);

      const duration = 50 + 100 / this.tenacity;

      this.scene.tweens.add({
        targets: this.character.body.velocity,
        duration,
        x: damage.direction?.x,
        y: damage.direction?.y,
        ease: 'Stepped',
        onComplete: () => {
          this.character.setVelocity(0);
          this.character.clearTint();
          this.healthState = HealthState.INVULNERABLE;
          this.scene.time.delayedCall(this._invulerabilityTime, () => {
            this.healthState = HealthState.IDLE;
          });
        },
      });
    }
  }
}

/*
      this.character.setTint(0xff0000);

      this.scene.tweens.add({
        targets: this.character.body.velocity,
        duration: 150,
        x: damage.direction?.x,
        y: damage.direction?.y,
        ease: 'Stepped',
        onComplete: () => {
          this.character.setVelocity(0);
          this.healthState = HealthState.DEAD;
          this.character.clearTint();
        },
      });
 */
/* this.scene.tweens.add({
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
      }); */
