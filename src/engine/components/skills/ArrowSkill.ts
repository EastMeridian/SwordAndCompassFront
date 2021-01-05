import Phaser from 'phaser';
import Character from 'src/engine/entities/characters/Character';
import { Skill } from './Skill';

export default class ArrowSkill implements Skill {
  private arrowGroup: Phaser.Physics.Arcade.Group;

  constructor(weaponGroup: Phaser.Physics.Arcade.Group) {
    this.arrowGroup = weaponGroup;
  }

  use(direction: Phaser.Math.Vector2, character: Character, onComplete: () => void) {
    const arrow = this.arrowGroup.get(character.x, character.y);

    if (!arrow) return;

    arrow.use(
      direction,
      character,
      () => {
        onComplete?.();
      },
    );
  }
}
