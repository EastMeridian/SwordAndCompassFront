import Phaser from 'phaser';
import { getDirectionFromVector } from 'src/utils/Direction';
import { State } from 'src/engine/system/StateMachine';
import { Order } from 'src/utils/Order';
import Bokoblin from './Bokoblin';

const SPEED = 100;

export type StateMachineOptions = {
  name: string;
  character: Bokoblin;
  scene: Phaser.Scene;
};

export class IdleState extends State<StateMachineOptions> {
  enter = ({ character, name }: StateMachineOptions) => {
    character.setVelocity(0);
    character.anims.play(`${name}_idle_${character.direction.value}`, true);
  }

  execute({ character, name }: StateMachineOptions) {
    if (character.health.isDead()) {
      this.stateMachine.transition('dead');
      return;
    }

    if (character.health.isDamaged()) {
      this.stateMachine.transition('damage');
      return;
    }

    if (character.hasSwingTarget() && character.swingCooldown.isAvailable()) {
      this.stateMachine.transition('strike');
    }

    if (character.hasTarget() && !character.hasSwingTarget()) {
      this.stateMachine.transition('follow');
    }
  }
}

export class FollowState extends State<StateMachineOptions> {
  execute({ character, name }: StateMachineOptions) {
    if (character.health.isDead()) {
      this.stateMachine.transition('damage');
      return;
    }

    if (character.health.isDamaged()) {
      this.stateMachine.transition('damage');
      return;
    }

    if (character.hasSwingTarget() && character.swingCooldown.isAvailable()) {
      this.stateMachine.transition('strike');
    }

    character.setVelocity(0);

    const delta = character.getTargetDeltaVector()?.scale(SPEED);
    if (delta) {
      character.setVelocity(delta.x, delta.y);
      character.direction.setDirection(getDirectionFromVector(character.body.velocity));
      character.anims.play(`${name}_walk_${character.direction.value}`, true);
    }
  }
}

export class StrikeState extends State<StateMachineOptions> {
  enter({ character, scene, name }: StateMachineOptions) {
    character.setVelocity(0);
    character.anims.play(`${name}_idle_${character.direction.value}`, true);
    if (character.swingTarget?.body) {
      character.swingCooldown.consume();

      const orientation = new Phaser.Math.Vector2(
        character.swingTarget.body.position.x - character.x,
        character.swingTarget.body.position.y - character.y,
      ).normalize();

      scene.time.delayedCall(Phaser.Math.Between(250, 1250), () => {
        if (!character.health.isDead()) {
          character.skills.use('weapon', orientation, () => {
            character.setSwingTarget(null);
            this.stateMachine.transition('idle');
          });
        }
      });
    }
  }

  execute({ character, name, scene }: StateMachineOptions) {
    if (character.health.isDamaged()) {
      character.setSwingTarget(null);
      this.stateMachine.transition('damage');
    }
  }
}

export class DamageState extends State<StateMachineOptions> {
  enter({ character, scene, name }: StateMachineOptions) {
    character.anims.play(`${name}_idle_${character.direction.value}`, true);

    scene.time.delayedCall(500, () => {
      if (!character.health.isDead()) this.stateMachine.transition('idle');
    });
  }
}

export class DeadState extends State<StateMachineOptions> {}
