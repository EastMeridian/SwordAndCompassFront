import Phaser from 'phaser';
import { Colors } from 'src/styles/Theme';

export interface DataPair {
  key: string;
  value: string;
}

export class DataRow {
  public key: Phaser.GameObjects.Text;

  public value: Phaser.GameObjects.Text;

  constructor(key: Phaser.GameObjects.Text, value: Phaser.GameObjects.Text) {
    this.key = key;
    this.value = value;
  }

  destroy() {
    this.key.destroy();
    this.value.destroy();
  }
}

Phaser.GameObjects.GameObjectFactory.register('dataRow', function (
  this: Phaser.GameObjects.GameObjectFactory,
  x: number,
  y: number,
  data: DataPair,
  style: Phaser.Types.GameObjects.Text.TextStyle | undefined = {
    fontFamily: 'minecraft',
    fontSize: '28px',
  },
) {
  const key = this.scene.add.text(
    x,
    y,
    `${data.key}: `,
    style,
  );
  const value = this.scene.add.text(
    x + 256,
    y,
    data.value,
    style,
  ).setAlpha(0.7);

  this.displayList.add(key);
  this.displayList.add(value);

  const container = new DataRow(key, value);
  return container;
});
