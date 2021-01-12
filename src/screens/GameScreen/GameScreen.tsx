import React, { useEffect } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from 'src/engine';
import { getSearchParameters } from 'src/utils/Params';
import SoundManager from 'src/engine/system/SoundManager';
import {
  GameView, CanvasView,
} from './layout';

const GameScreen = () => {
  useEffect(() => {
    const params = getSearchParameters();
    const game = new Phaser.Game(createGameConfig(params.debug));
    if (params.muted) SoundManager.setMuted(true);
    return () => game.destroy(true, false);
  }, []);

  return (
    <GameView>
      <CanvasView id="game-container" />
    </GameView>
  );
};

export default GameScreen;
