/* eslint-disable class-methods-use-this */
import StateMachine from './StateMachine';

export default abstract class State<T> {
  protected stateMachine!: StateMachine<T>;

  public setContext(context: StateMachine<T>) {
    this.stateMachine = context;
  }

  public enter(option: T) {}

  public execute(option: T) {}
}
