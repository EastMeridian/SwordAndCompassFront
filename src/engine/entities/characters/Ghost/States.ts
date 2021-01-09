import Phaser from 'phaser';
import { Direction } from 'src/utils/Direction';
import { State } from 'src/engine/system/StateMachine';
import { Order } from 'src/utils/Order';
import Ghost from './Ghost';

export type StateMachineOptions = {
  name: string;
  character: Ghost;
  scene: Phaser.Scene;
};

export class MoveState extends State<StateMachineOptions> {
  execute({ character, name }: StateMachineOptions) {
    const { direction } = character;

    if (character.health.isDead()) {
      this.stateMachine.transition('dead');
      return;
    }

    if (character.health.isDamaged()) {
      this.stateMachine.transition('damage');
      return;
    }

    character.setVelocity(0);
    if (direction.value === Direction.UP) {
      character.setVelocityY(-1);
    } else if (direction.value === Direction.DOWN) {
      character.setVelocityY(1);
    } else if (direction.value === Direction.LEFT) {
      character.setVelocityX(-1);
    } else if (direction.value === Direction.RIGHT) {
      character.setVelocityX(1);
    }

    character.body.velocity.normalize().scale(character.speed);

    character.anims.play(`${name}_walk_${character.direction.value}`, true);
  }
}

export class DamageState extends State<StateMachineOptions> {
  enter({ character, scene }: StateMachineOptions) {
    character.anims.play(`ghost_idle_${character.direction.value}`, true);

    scene.time.delayedCall(500, () => {
      this.stateMachine.transition('move');
    });
  }
}

export class DeadState extends State<StateMachineOptions> {
  // eslint-disable-next-line class-methods-use-this
  enter({ character, scene, name }: StateMachineOptions) {
    character.anims.play(`${name}_dead`, true);
    character.disableBody();
    scene.time.delayedCall(1500, () => {
      character.destroy();
    });
  }
}
