import PrimitiveAnimal from '../entities/characters/PrimitiveAnimal/PrimitiveAnimal';
import Player from '../entities/characters/Player';
import SwordSwing from '../entities/spells/SwordSwing';

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {

      player(
        x: number,
        y: number,
        texture: string,
        anims: string
      ): Player

      swordSwing(
        x: number,
        y: number,
        texture: string,
        frame?: string | number
      ): SwordSwing

      primitiveEnemy(
        x: number,
        y: number,
        texture: string,
        anims: string
      ): PrimitiveAnimal
    }
  }
}
