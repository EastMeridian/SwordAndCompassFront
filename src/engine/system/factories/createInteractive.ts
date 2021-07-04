import Phaser from 'phaser';
import { PIPELINE } from 'src/constants';
import Bonfire from 'src/engine/entities/objects/Bonfire';
import Chest from 'src/engine/entities/objects/Chest';
import PNJ from 'src/engine/entities/objects/PNJ';
import { correctTiledPointX, correctTiledPointY } from 'src/utils/misc';

export interface Interactives {
  chests: Phaser.Physics.Arcade.StaticGroup;
  bonfires: Phaser.Physics.Arcade.StaticGroup;
  staticPNJs: Phaser.Physics.Arcade.StaticGroup
}

const CHEST = 'chest';
const BONFIRE = 'bonfire';
const PNJ_HOODED = 'pnj_hooded';

export const createInteractive = (
  object: Phaser.Types.Tilemaps.TiledObject,
  interactives: Interactives,
  scene: Phaser.Scene & { bonfiresLit: string[] },
) => {
  const properties = object.properties.reduce((acc: any, next: any) => ({
    ...acc,
    [next.name]: next.value,
  }), {});

  switch (properties.type) {
    case CHEST:
      return interactives.chests.get(
        correctTiledPointX(object),
        correctTiledPointY(object),
        CHEST,
      ).setPipeline(PIPELINE);
    case BONFIRE:
      return interactives.bonfires.get(
        correctTiledPointX(object),
        correctTiledPointY(object),
        'lights',
      )
        .setSize(32, 32)
        .setOffset(0, 32)
        .setLocationName(properties.name)
        .setActivated(scene.bonfiresLit.includes(properties.name));
    case PNJ_HOODED:
      return interactives.staticPNJs.get(
        correctTiledPointX(object),
        correctTiledPointY(object),
        'character_2',
        9,
      ).setSize(48, 48).setScale(1.6).setPipeline(PIPELINE);
    default:
      return null;
  }
};

export const createInteractives = (
  objects: Phaser.Types.Tilemaps.TiledObject[],
  scene: Phaser.Scene & { bonfiresLit: string[] },
): Interactives => {
  const interactives: Interactives = {
    chests: scene.physics.add.staticGroup({
      classType: Chest,
    }),
    bonfires: scene.physics.add.staticGroup({
      classType: Bonfire,
    }),

    staticPNJs: scene.physics.add.staticGroup({
      classType: PNJ,
    }),
  };

  objects.forEach((object) => {
    createInteractive(object, interactives, scene);
  });

  return interactives;
};
