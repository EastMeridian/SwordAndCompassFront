import Phaser from 'phaser';
import ArrowSkill from 'src/engine/components/skills/ArrowSkill';
import WeaponSkill from 'src/engine/components/skills/WeaponSkill';
import { BokoblinBowman, BokoblinSwordman } from 'src/engine/data/entities';
import Bokoblin from 'src/engine/entities/characters/Bokoblin';
import { PIPELINE } from 'src/constants';
import { Monsters } from './createMonster';

export const BOKOBLIN = 'bokoblin';

export const createBokoblin = (
  scene: Phaser.Scene,
  object: Phaser.Types.Tilemaps.TiledObject,
  properties: Record<string, any>,
  monsters: Monsters,
) => {
  let monster;

  if (properties.skill === 'weapon') {
    monster = new Bokoblin(scene, object.x!, object.y!, 'monster', BokoblinSwordman);
    const { target, hit } = BokoblinSwordman.detection;

    monster.setDetectionCircle(monsters.detectionCircles, target, hit)
      .skills.add(properties.skill, new WeaponSkill(monsters.swordSwings));

    monster.skills.setCurrent(properties.skill);
  } else if (properties.skill === 'arrow') {
    monster = new Bokoblin(scene, object.x!, object.y!, 'monster', BokoblinBowman);
    const { target, hit } = BokoblinBowman.detection;

    monster.setDetectionCircle(monsters.detectionCircles, target, hit)
      .skills.add(properties.skill, new ArrowSkill(monsters.arrows));
  }

  if (!monster) return null;
  monster.setPipeline(PIPELINE)
    .skills.setCurrent(properties.skill);

  return monster;
};
