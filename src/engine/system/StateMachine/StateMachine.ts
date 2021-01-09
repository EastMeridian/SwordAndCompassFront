import State from './State';

export class StateMachine<T> {
  private initialState: string;

  private stateStore: Record<string, State<T>>;

  private stateOptions: T;

  private state: string | null;

  private deleted = false;

  constructor(state: string, stateStore: Record<string, State<T>>, stateOptions: T) {
    this.initialState = state;
    this.stateStore = stateStore;
    this.stateOptions = stateOptions;
    this.state = null;

    Object.values(this.stateStore).forEach((state) => {
      state.setContext(this);
    });
  }

  step() {
    if (!this.deleted) {
      if (this.state === null) {
        this.state = this.initialState;
        this.stateStore[this.state].enter(this.stateOptions);
      }

      this.stateStore[this.state]?.execute?.(this.stateOptions);
    }
  }

  public transition(nextState: string) {
    if (!this.deleted) {
      this.state = nextState;
      this.stateStore[this.state]?.enter(this.stateOptions);
    }
  }

  getState() {
    return this.state;
  }

  destroy() {
    this.deleted = true;
  }
}

export default StateMachine;
