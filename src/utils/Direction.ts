import Phaser from 'phaser';

export enum Direction {
  NONE,
  RIGHT,
  DOWN,
  LEFT,
  UP,

}

const SNAP_INTERVAL = Phaser.Math.PI2 / 4;

export const getDirectionFromOrientation = (x1: number, y1: number, x2: number, y2: number) => {
  const angle = Phaser.Math.Angle.Between(x1, y1, x2, y2);
  const angleSnap = Phaser.Math.Snap.To(angle, SNAP_INTERVAL);
  const angleSnapDeg = Phaser.Math.RadToDeg(angleSnap);
  if (angleSnapDeg === 0) return Direction.RIGHT;
  if (angleSnapDeg === 90) return Direction.DOWN;
  if (angleSnapDeg === 180 || angleSnapDeg === -180) return Direction.LEFT;
  return Direction.UP;
};
