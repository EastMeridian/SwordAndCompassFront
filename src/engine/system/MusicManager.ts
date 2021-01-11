import Phaser from 'phaser';

class MusicManager {
  private scene!: Phaser.Scene;

  private playing = false;

  private current?: string;

  setScene(scene: Phaser.Scene) {
    this.scene = scene;
  }

  play(name: string) {
    if (this.playing && this.current) {
      this.transition(this.current, name);
      return;
    }
    this.current = name;
    this.playing = true;
    this.scene.sound.get(name).play();
  }

  stop() {
    if (this.current) {
      this.scene.sound.stopByKey(this.current);
      this.current = undefined;
      this.playing = false;
    }
  }

  transition(from: string, to: string) {
    this.scene.sound.get(from).play();
  }

  fadeIn(duration: number = 500, onComplete?: () => void) {
    if (this.current) {
      this.scene.add.tween({
        targets: this.scene.sound.get(this.current),
        duration,
        volume: 2,
        ease: 'Linear',
        onComplete,
      });
    }
  }

  fadeOut(duration: number = 500, onComplete?: () => void) {
    if (this.current) {
      this.scene.add.tween({
        targets: this.scene.sound.get(this.current),
        duration,
        volume: 0,
        ease: 'Linear',
        onComplete: () => {
          this.stop();
          onComplete?.();
        },
      });
    }
  }
}

export default new MusicManager();
