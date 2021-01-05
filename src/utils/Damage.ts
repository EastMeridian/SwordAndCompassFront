import Phaser from 'phaser';

export interface Damage {
  amount: number;
  direction?: Phaser.Math.Vector2;
}
