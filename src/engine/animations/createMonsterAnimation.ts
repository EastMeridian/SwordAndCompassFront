import Phaser from 'phaser';
import { createCharacterAnimation } from './createCharacterAnimation';

export const createGhostAnimation = (scene: Phaser.Scene) => createCharacterAnimation({
  scene,
  name: 'ghost',
  texture: 'monster',
  start: 0,
});

export const createBokoblinAnimation = (scene: Phaser.Scene) => createCharacterAnimation({
  scene,
  name: 'bokoblin',
  texture: 'monster',
  start: 6,
});

export const createSkeletonAnimation = (scene: Phaser.Scene) => createCharacterAnimation({
  scene,
  name: 'skeleton',
  texture: 'monster',
  start: 3,
});
