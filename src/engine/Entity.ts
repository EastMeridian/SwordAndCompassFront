import Phaser from 'phaser';

class Entity extends Phaser.GameObjects.Sprite {
  scene: Phaser.Scene;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    type: any,
  ) {
    super(scene, x, y, texture);

    this.scene = scene;
  }
}

export default Entity;
