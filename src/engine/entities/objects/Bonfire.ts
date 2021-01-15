import Phaser from 'phaser';
import { PIPELINE } from 'src/constants';
import { Interactive } from './Interactive';

class Bonfire extends Phaser.Physics.Arcade.Sprite implements Interactive {
  private light: Phaser.GameObjects.Light

  private _location!: string;

  get location() {
    return this._location;
  }

  public activated = false;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.play('bonfire_low');
    scene.add.image(x, y + 20, 'doodads', 164).setScale(1.25).setDepth(3).setPipeline(PIPELINE);
    this.setDepth(4);
    this.light = scene.lights.addLight(x, y + 15, 500).setColor(0xffba56).setIntensity(1);
  }

  setLocationName(name: string) {
    this._location = name;
    return this;
  }

  setActivated(activated = true) {
    this.activated = activated;
    if (activated) {
      this.anims.play('bonfire_full');
      this.scene.tweens.add({
        targets: this.light,
        duration: 250,
        intensity: 2.8,
      });
    }
    return this;
  }

  interact() {
    if (!this.activated) {
      this.activated = true;
      this.anims.play('bonfire_full');
      this.scene.tweens.add({
        targets: this.light,
        duration: 250,
        intensity: 2.8,
      });
    }
  }
}

export default Bonfire;
