import Phaser from 'phaser';
import { Direction } from 'src/utils/Direction';
import Character from 'src/engine/entities/characters/Character';

export abstract class Skill {
  abstract use(
    direction: Phaser.Math.Vector2,
    character: Character,
    onComplete: () => void
    ): void;

  abstract update?(character: Character): void
}
