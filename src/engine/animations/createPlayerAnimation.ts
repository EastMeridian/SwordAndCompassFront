import Phaser from 'phaser';

const FRAME_RATE = 8;

export const createPlayerAnimation = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'walk_down',
    frames: scene.anims.generateFrameNumbers('dwarf', { frames: [0, 1, 2, 1] }),
    frameRate: FRAME_RATE,
    repeat: -1,
  });

  scene.anims.create({
    key: 'walk_left',
    frames: scene.anims.generateFrameNumbers('dwarf', { frames: [3, 4, 5, 4] }),
    frameRate: FRAME_RATE,
    repeat: -1,
  });

  scene.anims.create({
    key: 'walk_right',
    frames: scene.anims.generateFrameNumbers('dwarf', { frames: [6, 7, 8, 7] }),
    frameRate: FRAME_RATE,
    repeat: -1,
  });

  scene.anims.create({
    key: 'walk_up',
    frames: scene.anims.generateFrameNumbers('dwarf', { frames: [9, 10, 11, 10] }),
    frameRate: FRAME_RATE,
    repeat: -1,
  });
};
