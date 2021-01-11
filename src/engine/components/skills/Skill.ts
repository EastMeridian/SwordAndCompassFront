import Phaser from 'phaser';
import { Direction } from 'src/utils/Direction';
import Character from 'src/engine/entities/characters/Character';
import { SkillData } from './SkillData';

export abstract class Skill {
  abstract data: SkillData

  abstract use(
    direction: Phaser.Math.Vector2,
    character: Character,
    onComplete: () => void
    ): void;

  abstract update?(character: Character): void
}
