import Phaser from 'phaser';
import Player from '../characters/Player';

class DetectionCircle extends Phaser.Physics.Arcade.Image {
  private _owner: any;

  public _onDetect: (player: Player) => void = () => {}

  get owner() {
    return this._owner;
  }

  get onDetect() {
    return this._onDetect;
  }

  setOwner(owner: any) {
    this._owner = owner;
    return this;
  }

  setOnDetect(onDetect: (player: Player) => void) {
    this._onDetect = onDetect;
    return this;
  }
}

export default DetectionCircle;
