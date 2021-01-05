/* eslint-disable class-methods-use-this */
import Phaser from 'phaser';
import DirectionComponent from 'src/engine/components/DirectionComponent';
import HealthComponent from 'src/engine/components/HealthComponent';

export default abstract class Character extends Phaser.Physics.Arcade.Sprite {
  abstract direction: DirectionComponent;

  abstract health: HealthComponent;
}
