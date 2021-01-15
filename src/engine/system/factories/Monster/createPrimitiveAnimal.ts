import Phaser from 'phaser';
import { PIPELINE } from 'src/constants';
import PrimitiveAnimal from 'src/engine/entities/characters/PrimitiveAnimal/PrimitiveAnimal';

export const PRIMITIVE_ANIMAL = 'primitive_animal';

export const createPrimitiveAnimal = (
  scene: Phaser.Scene,
  monster: Phaser.Types.Tilemaps.TiledObject,
  properties: Record<string, any>,
) => new PrimitiveAnimal(scene, monster.x!, monster.y!, 'monster_2', properties.skin).setPipeline(PIPELINE);

export const createBat = (
  scene: Phaser.Scene,
  monster: Phaser.Types.Tilemaps.TiledObject,
  properties: Record<string, any>,
) => {
  const animal = createPrimitiveAnimal(scene, monster, properties);
  scene.physics.world.enableBody(animal, Phaser.Physics.Arcade.DYNAMIC_BODY);
  animal.setSize(24, 24).setOffset(4, 0);
  return animal;
};
