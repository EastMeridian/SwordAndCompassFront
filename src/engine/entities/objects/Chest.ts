import Phaser from 'phaser';

class Chest extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.play('chest_closed');
  }

  open() {
    if (this.anims.currentAnim.key !== 'chest_closed') return 0;
    this.scene.sound.get('chest').play();
    this.play('chest_open');
    return Phaser.Math.Between(50, 200);
  }
}

export default Chest;
