import Phaser from 'phaser';
import { createCharacterAnimation, createBossAnimation } from './createCharacterAnimation';

export const createGhostAnimation = (scene: Phaser.Scene) => createCharacterAnimation({
  scene,
  name: 'ghost',
  texture: 'monster',
  start: 0,
  damageTexture: 'damage_3',
  damageFrame: 6,
});

export const createBatAnimation = (scene: Phaser.Scene) => createCharacterAnimation({
  scene,
  name: 'bat',
  texture: 'monster_2',
  start: 0,
});

export const createScorpionAnimation = (scene: Phaser.Scene) => createCharacterAnimation({
  scene,
  name: 'scorpion',
  texture: 'monster_2',
  start: 54,
});

export const createSpiderAnimation = (scene: Phaser.Scene) => createCharacterAnimation({
  scene,
  name: 'spider',
  texture: 'monster_2',
  start: 57,
});

export const createBokoblinAnimation = (scene: Phaser.Scene) => createCharacterAnimation({
  scene,
  name: 'bokoblin',
  texture: 'monster',
  start: 6,
  damageTexture: 'damage_3',
  damageFrame: 30,
});

export const createSkeletonAnimation = (scene: Phaser.Scene) => createCharacterAnimation({
  scene,
  name: 'skeleton',
  texture: 'monster',
  start: 3,
  damageTexture: 'damage_3',
  damageFrame: 18,
});

export const createOgreAnimations = (scene: Phaser.Scene) => createBossAnimation({
  scene,
  name: 'ogre',
  texture: 'big_monster_2',
  start: 9,
});
