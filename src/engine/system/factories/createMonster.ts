import Phaser from 'phaser';
import WeaponSkill from 'src/engine/components/skills/WeaponSkill';
import Bokoblin from 'src/engine/entities/characters/Bokoblin';
import Ghost from 'src/engine/entities/characters/Ghost/Ghost';
import Ogre from 'src/engine/entities/characters/Ogre';
import Skeleton from 'src/engine/entities/characters/Skeleton/Skeleton';
import DetectionCircle from 'src/engine/entities/others/DetectionCircle';
import Arrow from 'src/engine/entities/spells/Arrow';
import SwordSwing from 'src/engine/entities/spells/SwordSwing';
import { BOKOBLIN, createBokoblin } from './createBokoblin';
import { GHOST, createGhost } from './createGhost';
import { createOgre, OGRE } from './createOgre';

export interface Monsters {
  ghosts: Phaser.Physics.Arcade.Group;
  skeletons: Phaser.Physics.Arcade.Group;
  bokoblins: Phaser.Physics.Arcade.Group;
  detectionCircles: Phaser.Physics.Arcade.Group;
  swordSwings: Phaser.Physics.Arcade.Group;
  arrows: Phaser.Physics.Arcade.Group;
  ogres: Phaser.Physics.Arcade.Group;
}

export const createMonster = (
  monster: Phaser.Types.Tilemaps.TiledObject,
  monsters: Monsters,
  scene: Phaser.Scene,
) => {
  const properties = monster.properties.reduce((acc: any, next: any) => ({
    ...acc,
    [next.name]: next.value,
  }), {});

  switch (properties.type) {
    case GHOST:
      return createGhost(monster, properties, monsters);
    case BOKOBLIN:
      return monsters.bokoblins.add(
        createBokoblin(scene, monster, properties, monsters)!,
        true,
      );
    case OGRE:
      return createOgre(monster, properties, monsters);

    default:
      return null;
  }
};

export const createMonsters = (
  objects: Phaser.Types.Tilemaps.TiledObject[],
  scene: Phaser.Scene,
): Monsters => {
  const monsters: Monsters = {

    ghosts: scene.physics.add.group({
      classType: Ghost,
      createCallback: (go) => {
        const ghost = go as Ghost;
        ghost.body.onCollide = true;
      },
    }),

    skeletons: scene.physics.add.group({
      classType: Skeleton,
    }),

    bokoblins: scene.physics.add.group({
      classType: Bokoblin,
      runChildUpdate: true,
    }),

    ogres: scene.physics.add.group({
      classType: Ogre,
      runChildUpdate: true,
      createCallback: (go) => {
        const ogre = go as Ogre;
        ogre.body.onCollide = true;
      },
    }),

    swordSwings: scene.physics.add.group({
      classType: SwordSwing,
    }),

    detectionCircles: scene.physics.add.group({
      classType: DetectionCircle,
      createCallback: (o) => {
        const circle = o as DetectionCircle;
        circle
          .setAlpha(0)
          .setOrigin(0, 0);
      },
    }),

    arrows: scene.physics.add.group({
      classType: Arrow,
    }),
  };

  objects.forEach((monster) => {
    createMonster(monster, monsters, scene);
  });

  return monsters;
};
