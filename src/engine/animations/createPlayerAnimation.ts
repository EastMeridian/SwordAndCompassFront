import Phaser from 'phaser';
import { createCharacterAnimation } from './createCharacterAnimation';

const FRAME_RATE = 8;

export const createPlayerAnimation = (scene: Phaser.Scene) => createCharacterAnimation({
  scene,
  name: 'player',
  texture: 'character',
  start: 0,
});
