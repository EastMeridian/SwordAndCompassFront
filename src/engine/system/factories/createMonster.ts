import Phaser from 'phaser';
import WeaponSkill from 'src/engine/components/skills/WeaponSkill';
import Bokoblin from 'src/engine/entities/characters/Bokoblin';
import Ogre from 'src/engine/entities/characters/Ogre';
import Skeleton from 'src/engine/entities/characters/Skeleton/Skeleton';
import DetectionCircle from 'src/engine/entities/others/DetectionCircle';
import Arrow from 'src/engine/entities/spells/Arrow';
import SwordSwing from 'src/engine/entities/spells/SwordSwing';
import PrimitiveAnimal from 'src/engine/entities/characters/PrimitiveAnimal/PrimitiveAnimal';
import { BOKOBLIN, createBokoblin } from './createBokoblin';
import { PRIMITIVE_ANIMAL, createPrimitiveAnimal, createBat } from './createPrimitiveAnimal';
import { createOgre, OGRE } from './createOgre';

export interface Monsters {
  primitiveAnimals: Phaser.Physics.Arcade.Group;
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
    case PRIMITIVE_ANIMAL:
      return monsters.primitiveAnimals.add(
        createBat(scene, monster, properties),
        true,
      );
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

    primitiveAnimals: scene.physics.add.group({
      classType: PrimitiveAnimal,
      createCallback: (go) => {
        const animal = go as PrimitiveAnimal;
        animal.body.onCollide = true;
      },
    }),

    skeletons: scene.physics.add.group({
      classType: Skeleton,
    }),

    bokoblins: scene.physics.add.group({
      classType: Bokoblin,
      createCallback: (go) => {
        const bokoblin = go as Bokoblin;
        bokoblin.setMass(0.1);
      },
      runChildUpdate: true,
    }),

    ogres: scene.physics.add.group({
      classType: Ogre,
      runChildUpdate: true,
      createCallback: (go) => {
        const ogre = go as Ogre;
        ogre.body.onCollide = true;
        ogre.setMass(0.1);
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
