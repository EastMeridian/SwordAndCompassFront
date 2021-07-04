import Phaser from 'phaser';
import { sceneEvents } from 'src/engine/events/EventCenter';
import { PLAYER_GET_MESSAGE } from 'src/engine/events/events';
import Player from '../characters/Player';
import { Interactive } from './Interactive';

class PNJ extends Phaser.Physics.Arcade.Sprite implements Interactive {
  interact = (player: Player) => {
    player.setTalking();
    sceneEvents.emit(PLAYER_GET_MESSAGE, 'Sed ut perspiciatis unde omnis iste natus error sit');
  }
}

export default PNJ;
