import Phaser from 'phaser';
import Character from 'src/engine/entities/characters/Character';
import { Skill } from './Skill';
import { SkillData } from './SkillData';

export default class ArrowSkill implements Skill {
  private arrowGroup: Phaser.Physics.Arcade.Group;

  constructor(weaponGroup: Phaser.Physics.Arcade.Group) {
    this.arrowGroup = weaponGroup;
  }

  public data: SkillData = {
    frame: 33,
    originX: 0.55,
  };

  use(direction: Phaser.Math.Vector2, character: Character, onComplete: () => void) {
    if (character.inventory) {
      const consumed = character.inventory?.consume('arrow');
      if (!consumed) {
        onComplete?.();
        return;
      }
    }
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
