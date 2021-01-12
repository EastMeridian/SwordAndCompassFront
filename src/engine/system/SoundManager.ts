import Phaser from 'phaser';

class SoundManager {
  private currentScene!: Phaser.Scene;

  get volume() {
    return this._volume;
  }

  private _volume = 1;

  private volumeBuffer = this._volume;

  private muted = false;

  setVolume(volume: number) {
    this._volume = volume;
    if (this.currentScene) this.currentScene.sound.volume = this._volume;
  }

  setCurrentScene(scene: Phaser.Scene) {
    this.currentScene = scene;
    this.currentScene.sound.volume = this.muted ? 0 : this._volume;
  }

  toggle() {
    if (!this.muted) {
      this.volumeBuffer = this._volume;
      this.setVolume(0);
      this.muted = true;
      return this.muted;
    }
    this.setVolume(this.volumeBuffer);
    this.muted = false;
    return this.muted;
  }

  setMuted(muted: boolean) {
    this.muted = muted;
  }

  isMuted() {
    return this.muted;
  }
}

export default new SoundManager();
