import Phaser from 'phaser';
import Preloader from './scenes/PreloaderScene';
import GameScene from './scenes/GameScene';
import GameUI from './scenes/UI/GameUIScene';
import StartScreen from './scenes/UI/StartScreen';

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  parent: 'game-container',
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade',
    arcade: {
      fps: 64,
      /* debug: true, */
      /*  overlapBias: 64, */
    },
  },
  render: {
    pixelArt: true,
  },
  scene: [Preloader, GameScene, GameUI, StartScreen],
};
