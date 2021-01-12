import State from './State';

export class StateMachine<T> {
  private initialState: string;

  private stateStore: Record<string, State<T>>;

  private stateOptions: T;

  private _state: string | null;

  get state() {
    return this._state;
  }

  private deleted = false;

  constructor(state: string, stateStore: Record<string, State<T>>, stateOptions: T) {
    this.initialState = state;
    this.stateStore = stateStore;
    this.stateOptions = stateOptions;
    this._state = null;

    Object.values(this.stateStore).forEach((state) => {
      state.setContext(this);
    });
  }

  step() {
    if (!this.deleted) {
      if (this._state === null) {
        this._state = this.initialState;
        this.stateStore[this._state].enter(this.stateOptions);
      }

      this.stateStore[this._state]?.execute?.(this.stateOptions);
    }
  }

  public transition(nextState: string) {
    if (!this.deleted) {
      this._state = nextState;
      this.stateStore[this._state]?.enter(this.stateOptions);
    }
  }

  destroy() {
    this.deleted = true;
  }
}

export default StateMachine;
