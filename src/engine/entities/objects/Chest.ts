import Phaser from 'phaser';

class Chest extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.play('chest_closed');
  }

  open() {
    if (this.anims.currentAnim.key !== 'chest_closed') return [];
    this.scene.sound.get('chest').play();
    this.play('chest_open');
    return [
      { name: 'arrow', amount: Phaser.Math.Between(5, 15) },
      { name: 'gold', amount: Phaser.Math.Between(10, 25) },
    ];
  }
}

export default Chest;
