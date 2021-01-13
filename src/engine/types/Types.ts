import PrimitiveAnimal from '../entities/characters/PrimitiveAnimal/PrimitiveAnimal';
import Player from '../entities/characters/Player';
import SwordSwing from '../entities/spells/SwordSwing';
import { PlayerData } from '../data/entities';
import { ActionButtonOptions } from '../scenes/UI/UIComponents/ActionButton';

declare global {
  namespace Phaser.GameObjects {
    interface GameObjectFactory {

      player(
        x: number,
        y: number,
        data: PlayerData,
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

      actionButton(
        x: number,
        y: number,
        texture: string,
        options: ActionButtonOptions
      ): Image
    }
  }
}
