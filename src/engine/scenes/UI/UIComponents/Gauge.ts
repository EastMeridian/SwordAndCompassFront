import Phaser from 'phaser';
import { Colors } from 'src/styles/Theme';

export interface Gauge {
  background: Phaser.GameObjects.Rectangle;
  gauge: Phaser.GameObjects.Rectangle;
}

Phaser.GameObjects.GameObjectFactory.register('gauge', function (
  this: Phaser.GameObjects.GameObjectFactory,
  x: number,
  y: number,
  color: number,
  intialRatio = 1,
) {
  const background = this.scene.add.rectangle(x, y, 148, 8, Colors.grey).setOrigin(0, 0);

  const gauge = this.scene.add.rectangle(x, y, 148 * intialRatio, 8, color).setOrigin(0, 0);

  this.displayList.add(background);
  this.displayList.add(gauge);

  const container = { background, gauge };

  return container;
});
