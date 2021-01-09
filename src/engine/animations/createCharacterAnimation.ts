import Phaser from 'phaser';
import { Direction, getDirectionalName } from 'src/utils/Direction';

interface Options {
  scene: Phaser.Scene,
  name: string,
  texture: string,
  frameRate?: number,
  start: number,
  damageTexture?: string,
  damageFrame?: number,
}

export const createCharacterAnimation = ({
  scene,
  name,
  texture,
  start,
  frameRate = 8,
  damageTexture,
  damageFrame,
}: Options) => {
  scene.anims.create({
    key: getDirectionalName(`${name}_walk`, Direction.DOWN),
    frames: scene.anims.generateFrameNumbers(texture, { start, end: start + 2 }),
    frameRate,
    repeat: -1,
    yoyo: true,
  });

  scene.anims.create({
    key: getDirectionalName(`${name}_walk`, Direction.LEFT),
    frames: scene.anims.generateFrameNumbers(texture, { start: start + 12, end: start + 14 }),
    frameRate,
    repeat: -1,
    yoyo: true,
  });

  scene.anims.create({
    key: getDirectionalName(`${name}_walk`, Direction.RIGHT),
    frames: scene.anims.generateFrameNumbers(texture, { start: start + 24, end: start + 26 }),
    frameRate,
    repeat: -1,
    yoyo: true,
  });

  scene.anims.create({
    key: getDirectionalName(`${name}_walk`, Direction.UP),
    frames: scene.anims.generateFrameNumbers(texture, { start: start + 36, end: start + 38 }),
    frameRate,
    repeat: -1,
    yoyo: true,
  });

  scene.anims.create({
    key: getDirectionalName(`${name}_idle`, Direction.DOWN),
    frames: [{ key: texture, frame: start + 1 }],
  });

  scene.anims.create({
    key: getDirectionalName(`${name}_idle`, Direction.LEFT),
    frames: [{ key: texture, frame: start + 13 }],
  });

  scene.anims.create({
    key: getDirectionalName(`${name}_idle`, Direction.RIGHT),
    frames: [{ key: texture, frame: start + 25 }],
  });

  scene.anims.create({
    key: getDirectionalName(`${name}_idle`, Direction.UP),
    frames: [{ key: texture, frame: start + 37 }],
  });

  if (damageFrame && damageTexture) {
    scene.anims.create({
      key: `${name}_dead`,
      frames: [{ key: damageTexture, frame: damageFrame }],
    });
  }
};

export const createBossAnimation = ({
  scene,
  name,
  texture,
  start,
  frameRate = 8,
  damageTexture,
  damageFrame,
}: Options) => {
  scene.anims.create({
    key: `${name}_walk`,
    frames: scene.anims.generateFrameNumbers(texture, { start, end: start + 2 }),
    frameRate,
    repeat: -1,
    yoyo: true,
  });

  scene.anims.create({
    key: `${name}_idle`,
    frames: [{ key: texture, frame: start + 1 }],
  });
};
