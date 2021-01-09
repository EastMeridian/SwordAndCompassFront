import Phaser from 'phaser';
import { Direction } from 'src/utils/Direction';
import { State } from 'src/engine/system/StateMachine';
import { Order } from 'src/utils/Order';
import Skeleton from './Skeleton';

export type StateMachineOptions = {
  name: string;
  character: Skeleton;
  scene: Phaser.Scene;
};

export class MoveState extends State<StateMachineOptions> {
  execute({ character, name }: StateMachineOptions) {
    const { direction } = character;

    if (character.health.isDamaged()) {
      this.stateMachine.transition('damage');
      return;
    }

    character.setVelocity(0, 0);
    if (direction.value === Direction.UP) {
      character.setVelocity(-1, -1);
    } else if (direction.value === Direction.DOWN) {
      character.setVelocity(1, 1);
    } else if (direction.value === Direction.LEFT) {
      character.setVelocity(-1, 1);
    } else if (direction.value === Direction.RIGHT) {
      character.setVelocity(1, -1);
    }

    character.body.velocity.normalize().scale(character.speed);

    character.anims.play(`${name}_walk_${character.direction.value}`, true);
  }
}

export class DamageState extends State<StateMachineOptions> {
  enter({ character, scene }: StateMachineOptions) {
    character.anims.play(`Skeleton_idle_${character.direction.value}`, true);

    scene.time.delayedCall(500, () => {
      this.stateMachine.transition('move');
    });
  }
}
