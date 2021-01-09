import Phaser from 'phaser';
import { PIPELINE } from 'src/constants';
import { Monsters } from './createMonster';

export const OGRE = 'ogre';

export const createOgre = (
  monster: Phaser.Types.Tilemaps.TiledObject,
  _: Record<string, any>,
  monsters: Monsters,
) => {
  monsters.ogres!.get(monster.x, monster.y, 'big_monster_2')
    .setPipeline(PIPELINE)
    .setDetectionCircle(monsters.detectionCircles, 300);
};
