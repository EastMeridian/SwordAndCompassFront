import React, { useEffect } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from 'src/engine';
import { getSearchParameters } from 'src/utils/Params';
import {
  GameView, CanvasView,
} from './layout';

const GameScreen = () => {
  useEffect(() => {
    const params = getSearchParameters();
    const game = new Phaser.Game(createGameConfig(params.debug));
    return () => game.destroy(true, false);
  }, []);

  return (
    <GameView>
      <CanvasView id="game-container" />
    </GameView>
  );
};

export default GameScreen;
