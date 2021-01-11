import Phaser from 'phaser';

class TorchLight extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.play('torch_light');
    scene.lights.addLight(x, y + 15, 500).setColor(0xffba56).setIntensity(2.8);
  }
}

export default TorchLight;
