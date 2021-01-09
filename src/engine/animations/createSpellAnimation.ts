import Phaser from 'phaser';

const FRAME_RATE = 24;

export const createRecoveryAnimation = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'recovery',
    frames: scene.anims.generateFrameNumbers('recovery1', { start: 0, end: 29 }),
    frameRate: FRAME_RATE,
  });
};
