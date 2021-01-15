import Player from '../characters/Player';

export abstract class Interactive {
  abstract interact(player: Player): void
}
