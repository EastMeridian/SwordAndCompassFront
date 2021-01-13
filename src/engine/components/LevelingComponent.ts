import Character from '../entities/characters/Character';

interface Level {
  index: number;
  price: number;
  reward: number,
}

function* levelMaker(start = 0) {
  let index = start;
  while (true) {
    index++;
    yield {
      index,
      price: 900 + index * 100,
      reward: 1,
    } as Level;
  }
}

export class LevelingComponent {
  private _currentLevel: void | Level;

  get currentLevel() {
    return this._currentLevel;
  }

  private _experience = 0;

  get experience() {
    return this._experience;
  }

  private generator: Generator<Level, void, unknown>

  constructor() {
    this.generator = levelMaker();
    this._currentLevel = this.incrementLevel();
  }

  public addExperience(exp: number) {
    this._experience += exp;
    if (this._currentLevel) {
      if (this._experience >= this._currentLevel.price) {
        this._experience -= this._currentLevel.price;
        if (this._experience < 0) this._experience = 0;
        this._currentLevel = this.incrementLevel();
      }
    }
  }

  private incrementLevel() {
    return this.generator.next().value;
  }
}
