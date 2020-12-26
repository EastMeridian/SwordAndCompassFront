import Phaser from 'phaser';

class SwordSwing extends Phaser.GameObjects.Sprite {
  private direction!: Phaser.Math.Vector2;

  private boundingBox!: Phaser.GameObjects.Rectangle

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'weapon1');
  }

  swing(direction: Phaser.Math.Vector2, velocity: Phaser.Math.Vector2) {
    this.depth = 0;

    this.direction = direction.scale(25);
    const angle = this.direction.angle();

    /*     this.boundingBox = this.scene.add.rectangle(this.x, this.y, 48, 48, 0xffffff)
      .setAlpha(0)
      .setPosition(this.x + this.direction.x * 2, this.y + this.direction.y * 2);
    this.scene.physics.add.existing(this.boundingBox); */

    this
      .setSize(48, 48)
      .setFlipX(true)
      .setPosition(this.x + this.direction.x, this.y + this.direction.y)
      .setOrigin(0.5, 0.85)
      .setRotation(angle - ((-Math.PI) / 4))
      .setPipeline('Light2D')
      .play('weapon_swing')
      .on('animationcomplete', () => {
        /* console.log('DESTROYED'); */
        this.destroy();
      });
  }

  update(parentX: number, parentY: number) {
    this.setPosition(parentX + this.direction.x, parentY + this.direction.y);
  }

  destroy() {
    super.destroy();
    this.boundingBox.destroy();
  }
}

export default SwordSwing;
