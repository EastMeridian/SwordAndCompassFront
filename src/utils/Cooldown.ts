import Phaser from 'phaser';

export class Cooldown {
  private available = true;

  private delay: number;

  private scene: Phaser.Scene;

  private onComplete?: () => void;

  constructor(scene: Phaser.Scene, delay: number, onComplete?: () => void) {
    this.delay = delay;
    this.scene = scene;
    this.onComplete = onComplete;
  }

  consume() {
    if (this.available) {
      this.available = false;
      this.scene.time.delayedCall(this.delay, () => {
        this.available = true;
        this.onComplete?.();
      });
    }
  }

  isAvailable() {
    return this.available;
  }
}

export const createCooldown = (scene: Phaser.Scene, delay: number) => new Cooldown(scene, delay);
