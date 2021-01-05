import Phaser from 'phaser';

export const getOverlapPercentage = (
  aTopLeft: Phaser.Math.Vector2,
  aBottomRight: Phaser.Math.Vector2,
  bTopLeft: Phaser.Math.Vector2,
  bBottomRight: Phaser.Math.Vector2,
) => {
  const xLeft = Math.max(aTopLeft.x, bTopLeft.x);
  const yTop = Math.max(aTopLeft.y, bTopLeft.y);

  const xRight = Math.min(aBottomRight.x, bBottomRight.x);
  const yBottom = Math.min(aBottomRight.y, bBottomRight.y);

  const intersectionArea = (xRight - xLeft) * (yBottom - yTop);

  const aArea = (aBottomRight.x - aTopLeft.x) * (aBottomRight.y - aTopLeft.y);

  const overlapRatio = intersectionArea / (aArea);
  return overlapRatio;
};
