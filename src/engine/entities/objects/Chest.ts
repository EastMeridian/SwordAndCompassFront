import Phaser from 'phaser';
import Player from '../characters/Player';
import { Interactive } from './Interactive';

class Chest extends Phaser.Physics.Arcade.Sprite implements Interactive {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.play('chest_closed');
  }

  interact(player: Player) {
    if (this.anims.currentAnim.key !== 'chest_closed') return;
    this.scene.sound.get('chest').play();
    this.play('chest_open');
    const items = [
      { name: 'arrow', amount: Phaser.Math.Between(5, 15) },
      { name: 'gold', amount: Phaser.Math.Between(10, 25) },
    ];
    items.forEach(({ name, amount }) => player.inventory.provide(name, amount));
  }
}

export default Chest;
