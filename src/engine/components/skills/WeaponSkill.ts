import Phaser from 'phaser';
import SwordSwing from 'src/engine/entities/spells/SwordSwing';
import Character from 'src/engine/entities/characters/Character';
import { Skill } from './Skill';

export default class WeaponSkill implements Skill {
  private weaponGroup: Phaser.Physics.Arcade.Group;

  private currentWeapon?: SwordSwing;

  constructor(weaponGroup: Phaser.Physics.Arcade.Group) {
    this.weaponGroup = weaponGroup;
  }

  use(direction: Phaser.Math.Vector2, character: Character, onComplete: () => void) {
    this.currentWeapon = this.weaponGroup.get(character.x, character.y);

    if (!this.currentWeapon) return;
    this.currentWeapon.use(
      direction,
      character,
      () => {
        this.currentWeapon = undefined;
        onComplete?.();
      },
    );
  }

  update(character: Character) {
    if (this.currentWeapon) {
      this.currentWeapon.update(character);
    }
  }
}
