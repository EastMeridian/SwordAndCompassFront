import Phaser from 'phaser';
import Preloader from './scenes/PreloaderScene';
import GameScene from './scenes/GameScene';
import GameUI from './scenes/UI/GameUIScene';
import StartScreen from './scenes/StartScene';
import ActionBarScene from './scenes/UI/ActionBarScene';

export const createGameConfig = (): Phaser.Types.Core.GameConfig => ({
  type: Phaser.WEBGL,

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
  scene: [Preloader, GameScene, GameUI, StartScreen, ActionBarScene],
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
    height: window.innerHeight,
    width: window.innerWidth,
    parent: 'game-container',

  },
});
