import Phaser from 'phaser';

class Arrow extends Phaser.Physics.Arcade.Image {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'arrow');
  }

  throw(orientation: Phaser.Math.Vector2, speed: number = 1000) {
    this.scene.sound.get('bow').play();
    const angle = orientation.angle();

    this
      .setSize(64, 64)
      .setActive(true)
      .setVisible(true)
      .setRotation(angle + 1.5707963)
      .setScale(0.35)
      .setVelocity(orientation.x * speed, orientation.y * speed)
      .setPipeline('Light2D');

    /*     arrow.x += direction.x * 16;
    arrow.y += direction.y * 16; */
  }
}

export default Arrow;
