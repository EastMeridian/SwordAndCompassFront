import React, { useEffect } from 'react';
import Phaser from 'phaser';
import { config } from 'src/engine/Engine';
import { GameView, CanvasView } from './layout';

const GameScreen = () => {
  console.log('GameScreen render.');
  useEffect(() => {
    const game = new Phaser.Game(config);
  });
  return (
    <GameView>
      <CanvasView id="game-container" />
    </GameView>
  );
};

export default GameScreen;
