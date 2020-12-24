import Phaser from 'phaser';

const FRAME_RATE = 5;

export const createTorchLightAnimation = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'torch_light',
    frames: scene.anims.generateFrameNumbers('lights', { frames: [81, 82, 83] }),
    frameRate: FRAME_RATE,
    repeat: -1,
  });
};
