import Phaser from 'phaser';
import { PIPELINE } from 'src/constants';
import { Monsters } from './createMonster';

export const GHOST = 'ghost';

export const createGhost = (
  monster: Phaser.Types.Tilemaps.TiledObject,
  _: Record<string, any>,
  monsters: Monsters,
) => {
  monsters.ghosts!.get(monster.x, monster.y, 'monster').setPipeline(PIPELINE);
};
