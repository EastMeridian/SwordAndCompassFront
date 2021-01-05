import Phaser from 'phaser';
import { getOverlapPercentage } from './Collisions';

describe('getOverlapPercentage()', () => {
  it('should return 0.25', () => {
    const aTopLeft = new Phaser.Math.Vector2(0, 0);
    const aBottomRight = new Phaser.Math.Vector2(4, 4);
    const bTopLeft = new Phaser.Math.Vector2(2, 2);
    const bBottomRight = new Phaser.Math.Vector2(6, 6);

    expect(getOverlapPercentage(aTopLeft, aBottomRight, bTopLeft, bBottomRight)).toBe(0.25);
  });
  it('should return 0.5', () => {
    const aTopLeft = new Phaser.Math.Vector2(0, 0);
    const aBottomRight = new Phaser.Math.Vector2(4, 4);
    const bTopLeft = new Phaser.Math.Vector2(0, 2);
    const bBottomRight = new Phaser.Math.Vector2(4, 6);

    expect(getOverlapPercentage(aTopLeft, aBottomRight, bTopLeft, bBottomRight)).toBe(0.5);
  });
});
