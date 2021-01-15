import Character from '../entities/characters/Character';

interface Level {
  index: number;
  price: number;
  reward: number,
}

const INITIAL_LEVEL_PRICE = 900;

function* levelMaker(start = 0) {
  let index = start;
  while (true) {
    index++;
    yield {
      index,
      price: INITIAL_LEVEL_PRICE + index * 100,
      reward: 1,
    } as Level;
  }
}

export class LevelingComponent {
  private _currentLevel: Level;

  get currentLevel() {
    return this._currentLevel;
  }

  private _experience = 0;

  get experience() {
    return this._experience;
  }

  private _rewardCount = 50;

  get rewardCount() {
    return this._rewardCount;
  }

  private generator: Generator<Level, void, unknown>

  private onLevelChange?: () => void;

  constructor(onLevelChange?: () => void) {
    this.generator = levelMaker();
    this._currentLevel = this.incrementLevel();
    this.onLevelChange = onLevelChange;
  }

  public addExperience(exp: number) {
    this._experience += exp;
    if (this._currentLevel) {
      if (this._experience >= this._currentLevel.price) {
        this._experience -= this._currentLevel.price;
        if (this._experience < 0) this._experience = 0;
        this._currentLevel = this.incrementLevel();
        this._rewardCount += this._currentLevel.reward;
        this.onLevelChange?.();
      }
    }
  }

  private incrementLevel() {
    return this.generator.next().value as Level;
  }

  public getExperienceRatio() {
    return this.experience / this._currentLevel.price;
  }

  public consumeReward(count = 1) {
    if (this._rewardCount > 0) {
      this._rewardCount -= count;
      return true;
    }
    return false;
  }
}
