import Phaser from 'phaser';
import Preloader from './scenes/PreloaderScene';
import Game from './scenes/GameScene';
import GameUI from './scenes/GameUIScene';

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: window.innerWidth * 0.75,
  height: window.innerHeight * 0.75,
  physics: {
    default: 'arcade',
    arcade: { debug: true },
  },
  render: {
    pixelArt: true,
  },
  scene: [Preloader, Game, GameUI],
};
