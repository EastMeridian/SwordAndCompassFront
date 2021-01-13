import Phaser from 'phaser';

export interface ActionButtonOptions {
  onPointerDown: () => void;
}

Phaser.GameObjects.GameObjectFactory.register('actionButton', function (
  this: Phaser.GameObjects.GameObjectFactory,
  x: number,
  y: number,
  texture: string,
  { onPointerDown }: ActionButtonOptions,
) {
  const button = new Phaser.GameObjects.Image(this.scene, x, y, texture)
    .setAlpha(0.7)
    .setScale(0.5)
    .setInteractive();

  button.on('pointerdown', () => {
    button.setScale(0.4);
    onPointerDown();
  });

  button.on('pointerout', () => {
    button.setScale(0.5);
  });
  button.on('pointerup', () => {
    button.setScale(0.5);
  });

  this.displayList.add(button);

  return button;
});
