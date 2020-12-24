import Phaser from 'phaser';

const FRAME_RATE = 5;

export const createGroundSpikeAnimation = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'spike_up',
    frames: scene.anims.generateFrameNumbers('other', { frames: [60, 72, 84] }),
    frameRate: FRAME_RATE,
    yoyo: true,
  });
  scene.anims.create({
    key: 'spike_down',
    frames: [{ key: 'other', frame: 48 }],
  });
};
