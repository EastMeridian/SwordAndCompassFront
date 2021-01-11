import Phaser from 'phaser';

class ActionBarScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ui-actionbar' });
  }

  create() {
    const { width, height } = this.cameras.main;

    const fullScreenButton = this.add.image(width - 24, 24, 'switch-to-full-screen')
      .setAlpha(0.5).setScale(0.5).setInteractive()
      .on('pointerdown', () => {
        fullScreenButton.setScale(0.4);
        if (this.scale.isFullscreen) {
          this.scale.stopFullscreen();
        } else {
          this.scale.startFullscreen();
        }
      })
      .on('pointerout', () => {
        fullScreenButton.setScale(0.5);
      })
      .on('pointerup', () => {
        fullScreenButton.setScale(0.5);
      });

    const volumeButton = this.add.image(width - 64, 24, 'volume')
      .setAlpha(0.5).setScale(0.5).setInteractive()
      .on('pointerdown', () => {
        volumeButton.setScale(0.4);
        if (this.sound.volume === 0) {
          volumeButton.setTexture('volume');
          this.sound.volume = 1;
        } else if (this.sound.volume === 1) {
          volumeButton.setTexture('mute');
          this.sound.volume = 0;
        }
      })
      .on('pointerout', () => {
        volumeButton.setScale(0.5);
      })
      .on('pointerup', () => {
        volumeButton.setScale(0.5);
      });

    this.input.topOnly = false;
    this.input.on('gameobjectover', (pointer: any, gameObject: any) => {
      gameObject.setAlpha(1);
    });

    this.input.on('gameobjectout', (pointer: any, gameObject: any) => {
      gameObject.setAlpha(0.7);
    });
  }
}

export default ActionBarScene;