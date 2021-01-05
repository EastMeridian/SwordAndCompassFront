import Phaser from 'phaser';

const FRAME_RATE = 16;

export const createBalloonAnimation = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'exclamation_balloon',
    frames: scene.anims.generateFrameNumbers('balloon', { start: 0, end: 7 }),
    frameRate: FRAME_RATE,
    yoyo: true,
  });
};
