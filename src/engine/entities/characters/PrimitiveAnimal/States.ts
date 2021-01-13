import Phaser from 'phaser';
import { Direction } from 'src/utils/Direction';
import { State } from 'src/engine/system/StateMachine';
import { Order } from 'src/utils/Order';
import Ghost from './PrimitiveAnimal';

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
  enter({ character, scene, name }: StateMachineOptions) {
    character.anims.play(`${name}_idle_${character.direction.value}`, true);
    scene.time.delayedCall(500, () => {
      if (!character.health.isDead()) {
        this.stateMachine.transition('move');
      } else if (this.stateMachine.state !== 'dead') {
        this.stateMachine.transition('dead');
      }
    });
  }
}

export class DeadState extends State<StateMachineOptions> {
  // eslint-disable-next-line class-methods-use-this
  enter({ character, scene, name }: StateMachineOptions) {
    character.anims.play(`${name}_idle_${character.direction.value}`, true);
    character.setDepth(0);

    scene.tweens.add({
      targets: character,
      alpha: 0,
      tint: 0x000000,
      duration: 1500,
      ease: 'Sine.eastIn',
      onComplete: () => character?.destroy(),
    });
  }
}
