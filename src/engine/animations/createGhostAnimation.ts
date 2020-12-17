import Phaser from 'phaser';

const FRAME_RATE = 8;

export const createGhostAnimation = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'monster_walk_down',
    frames: scene.anims.generateFrameNumbers('monster', { frames: [0, 1, 2, 1] }),
    frameRate: FRAME_RATE,
    repeat: -1,
  });

  scene.anims.create({
    key: 'monster_walk_left',
    frames: scene.anims.generateFrameNumbers('monster', { frames: [12, 13, 14, 13] }),
    frameRate: FRAME_RATE,
    repeat: -1,
  });

  scene.anims.create({
    key: 'monster_walk_right',
    frames: scene.anims.generateFrameNumbers('monster', { frames: [24, 25, 26, 25] }),
    frameRate: FRAME_RATE,
  });

  scene.anims.create({
    key: 'monster_walk_up',
    frames: scene.anims.generateFrameNumbers('monster', { frames: [36, 37, 38, 37] }),
    frameRate: FRAME_RATE,
  });
};
