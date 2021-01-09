import Phaser from 'phaser';
import Character from '../characters/Character';

class Heal extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'recovery1');
  }

  update(character: Character) {
    this.setPosition(
      character.x,
      character.y,
    )
      .setScale(0.8)
      .setOrigin(0.5, 0.7);
  }
}

export default Heal;
