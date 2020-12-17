import React, { useEffect } from 'react';
import Phaser from 'phaser';
import { config } from 'src/engine';
import { GameView, CanvasView } from './layout';

const GameScreen = () => {
  useEffect(() => {
    const game = new Phaser.Game(config);
    return () => game.destroy(true, false);
  });
  return (
    <GameView>
      <CanvasView id="game-container" />
    </GameView>
  );
};

export default GameScreen;
