/* eslint-disable class-methods-use-this */
import Phaser from 'phaser';
import { Attributes } from 'src/engine/components/Attributes';
import DirectionComponent from 'src/engine/components/DirectionComponent';
import HealthComponent from 'src/engine/components/HealthComponent';
import { InventoryComponent } from 'src/engine/components/InventoryComponent';

export default abstract class Character extends Phaser.Physics.Arcade.Sprite {
  abstract direction: DirectionComponent;

  abstract health: HealthComponent;

  speed?: number;

  attributes?: Attributes;

  inventory?: InventoryComponent;
}
