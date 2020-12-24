import Phaser from 'phaser';

const FRAME_RATE = 5;

export const createChestAnimation = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'chest_open',
    frames: scene.anims.generateFrameNumbers('chest', { frames: [0, 12, 24] }),
    frameRate: FRAME_RATE,
  });

  scene.anims.create({
    key: 'chest_closed',
    frames: [{ key: 'chest', frame: 0 }],
    frameRate: FRAME_RATE,
  });
};
