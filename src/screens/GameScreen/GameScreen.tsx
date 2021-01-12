import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from 'src/engine';
import { reactBridgeEvents } from 'src/engine/events/EventCenter';
import { GAME_LOADED } from 'src/engine/events/events';
import {
  GameView, CanvasView, ActionBar, FullScreenButton,
} from './layout';

const GameScreen = () => {
  function transformToAssocArray(prmstr: string) {
    const params: Record<string, any> = {};
    const prmarr = prmstr.split('&');
    for (let i = 0; i < prmarr.length; i++) {
      const tmparr = prmarr[i].split('=');
      // eslint-disable-next-line prefer-destructuring
      params[tmparr[0]] = tmparr[1];
    }
    return params;
  }

  function getSearchParameters() {
    const prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr !== '' ? transformToAssocArray(prmstr) : {};
  }

  useEffect(() => {
    const params = getSearchParameters();
    console.log(params);
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
