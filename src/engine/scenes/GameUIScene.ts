import Phaser from 'phaser';

class GameUIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'game-ui' });
  }

  create() {
    const lifeGauge = this.add.rectangle(81, 16, 148, 20, 0x6666ff);
    console.log('HERE');
  }
}

export default GameUIScene;
