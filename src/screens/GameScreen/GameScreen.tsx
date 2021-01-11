import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from 'src/engine';
import { reactBridgeEvents } from 'src/engine/events/EventCenter';
import { GAME_LOADED } from 'src/engine/events/events';
import {
  GameView, CanvasView, ActionBar, FullScreenButton,
} from './layout';

const GameScreen = () => {
  useEffect(() => {
    const game = new Phaser.Game(createGameConfig());
    return () => game.destroy(true, false);
  }, []);

  return (
    <GameView>
      <CanvasView id="game-container" />
    </GameView>
  );
};

export default GameScreen;
