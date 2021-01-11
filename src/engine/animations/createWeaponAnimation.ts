import Phaser from 'phaser';

const FRAME_RATE = 8;

export const createweaponAnimation = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'weapon_swing_1',
    frames: scene.anims.generateFrameNumbers('weapon_1', { frames: [25, 26] }),
    frameRate: FRAME_RATE,
  });

  scene.anims.create({
    key: 'weapon_swing_2',
    frames: scene.anims.generateFrameNumbers('weapon_1', { frames: [1, 2] }),
    frameRate: FRAME_RATE,
  });

  scene.anims.create({
    key: 'weapon_swing_3',
    frames: scene.anims.generateFrameNumbers('weapon_1', { frames: [4, 5] }),
    frameRate: FRAME_RATE,
  });

  scene.anims.create({
    key: 'weapon_swing_4',
    frames: scene.anims.generateFrameNumbers('weapon_1', { frames: [7, 8] }),
    frameRate: FRAME_RATE,
  });

  scene.anims.create({
    key: 'weapon_swing_5',
    frames: scene.anims.generateFrameNumbers('weapon_1', { frames: [10, 11] }),
    frameRate: FRAME_RATE,
  });

  scene.anims.create({
    key: 'weapon_swing_6',
    frames: scene.anims.generateFrameNumbers('weapon_1', { frames: [13, 14] }),
    frameRate: FRAME_RATE,
  });

  scene.anims.create({
    key: 'weapon_swing_7',
    frames: scene.anims.generateFrameNumbers('weapon_1', { frames: [16, 17] }),
    frameRate: FRAME_RATE,
  });

  scene.anims.create({
    key: 'weapon_swing_8',
    frames: scene.anims.generateFrameNumbers('weapon_1', { frames: [19, 20] }),
    frameRate: FRAME_RATE,
  });

  scene.anims.create({
    key: 'weapon_swing_9',
    frames: scene.anims.generateFrameNumbers('weapon_1', { frames: [22, 23] }),
    frameRate: FRAME_RATE,
  });

  scene.anims.create({
    key: 'weapon_swing_10',
    frames: scene.anims.generateFrameNumbers('weapon_1', { frames: [31, 32] }),
    frameRate: FRAME_RATE,
  });

  scene.anims.create({
    key: 'weapon_swing_11',
    frames: scene.anims.generateFrameNumbers('weapon_1', { frames: [33, 34] }),
    frameRate: FRAME_RATE,
  });
};
