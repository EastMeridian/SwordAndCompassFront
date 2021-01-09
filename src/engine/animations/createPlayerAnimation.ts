import Phaser from 'phaser';
import { createCharacterAnimation } from './createCharacterAnimation';

export const createMountainDwellerAnimation = (scene: Phaser.Scene) => createCharacterAnimation({
  scene,
  name: 'mountain_dweller',
  texture: 'character_1',
  start: 54,
  damageTexture: 'damage_1',
  damageFrame: 75,
});

export const createElfAnimation = (scene: Phaser.Scene) => createCharacterAnimation({
  scene,
  name: 'elf',
  texture: 'character_1',
  start: 51,
  damageTexture: 'damage_1',
  damageFrame: 63,
});

export const createWarriorAnimation = (scene: Phaser.Scene) => createCharacterAnimation({
  scene,
  name: 'warrior',
  texture: 'character_2',
  start: 57,
  damageTexture: 'damage_3',
  damageFrame: 39,
});

export const createSorcererAnimation = (scene: Phaser.Scene) => createCharacterAnimation({
  scene,
  name: 'sorcerer',
  texture: 'character_2',
  start: 51,
  damageTexture: 'damage_3',
  damageFrame: 15,
});

export const createForesterAnimation = (scene: Phaser.Scene) => createCharacterAnimation({
  scene,
  name: 'forester',
  texture: 'character_3',
  start: 6,
  damageTexture: 'damage_3',
  damageFrame: 78,
});
