import { Direction } from 'src/utils/Direction';

export default class DirectionComponent {
  private _direction: Direction = Direction.RIGHT;

  get value() {
    return this._direction;
  }

  setDirection(direction: Direction) {
    this._direction = direction;
  }

  constructor(direction: Direction) {
    this._direction = direction;
  }
}
