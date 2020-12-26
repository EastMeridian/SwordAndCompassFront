import Phaser from 'phaser';

const FRAME_RATE = 8;

export const createWeaponAnimation = (scene: Phaser.Scene) => {
  scene.anims.create({
    key: 'weapon_swing',
    frames: scene.anims.generateFrameNumbers('weapon1', { frames: [25, 26] }),
    frameRate: FRAME_RATE,
  });
};
