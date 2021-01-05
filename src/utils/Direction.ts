import Phaser from 'phaser';

export enum Direction {
  DOWN,
  LEFT,
  RIGHT,
  UP,
}

const SNAP_INTERVAL = Phaser.Math.PI2 / 4;

export const getDirectionFromAngle = (angle: number) => {
  const angleSnap = Phaser.Math.Snap.To(angle, SNAP_INTERVAL);
  const angleSnapDeg = Phaser.Math.RadToDeg(angleSnap);
  if (angleSnapDeg === 0) return Direction.RIGHT;
  if (angleSnapDeg === 90) return Direction.DOWN;
  if (angleSnapDeg === 180 || angleSnapDeg === -180) return Direction.LEFT;
  return Direction.UP;
};

export const getDirectionFromOrientation = (x1: number, y1: number, x2: number, y2: number) => {
  const angle = Phaser.Math.Angle.Between(x1, y1, x2, y2);
  return getDirectionFromAngle(angle);
};

export const getDirectionFromVector = (vector: Phaser.Math.Vector2) => {
  const angle = vector.angle();
  return getDirectionFromAngle(angle);
};

export const getDirectionalName = (name: string, direction: Direction) => `${name}_${direction}`;
