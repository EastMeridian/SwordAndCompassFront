import Phaser from 'phaser';

import Character from 'src/engine/entities/characters/Character';
import Heal from 'src/engine/entities/spells/Heal';
import { sceneEvents } from 'src/engine/events/EventCenter';
import { PLAYER_HEALTH_CHANGED } from 'src/engine/events/events';
import { Skill } from './Skill';

export default class HealSkill implements Skill {
  private scene: Phaser.Scene;

  private heal?: Heal;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  use(_: Phaser.Math.Vector2, character: Character, onComplete: () => void) {
    if (this.heal) this.heal.destroy();
    this.heal = this.scene.add.existing(
      new Heal(this.scene, character.x, character.y),
    );
    character.setTint(0x2ecc71);
    this.heal.play('recovery').on('animationcomplete', () => {
      character.clearTint();
      character.health.add(2);
      this.heal?.destroy();
    });
    onComplete?.();
  }

  update(character: Character) {
    if (this.heal) {
      this.heal.update(character);
    }
  }
}
