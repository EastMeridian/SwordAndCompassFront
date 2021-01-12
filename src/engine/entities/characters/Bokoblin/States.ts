import Phaser from 'phaser';
import { getDirectionFromVector } from 'src/utils/Direction';
import { State } from 'src/engine/system/StateMachine';
import Bokoblin from './Bokoblin';
import Character from '../Character';
import { StateMachineOptionsBase } from '../States';

export type StateMachineBokoblinOptions = StateMachineOptionsBase<Bokoblin>;

export class IdleState extends State<StateMachineBokoblinOptions> {
  enter = ({ character, name }: StateMachineBokoblinOptions) => {
    character.setVelocity(0);
    character.anims.play(`${name}_idle_${character.direction.value}`, true);
  }

  execute({ character }: StateMachineBokoblinOptions) {
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

export class FollowState extends State<StateMachineBokoblinOptions> {
  execute({ character, name }: StateMachineBokoblinOptions) {
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

    character.setVelocity(0);

    const delta = character.getTargetDeltaVector()?.scale(character.speed);
    if (delta) {
      character.setVelocity(delta.x, delta.y);
      character.direction.setDirection(getDirectionFromVector(character.body.velocity));
      character.anims.play(`${name}_walk_${character.direction.value}`, true);
    }
  }
}

export class StrikeState extends State<StateMachineBokoblinOptions> {
  enter({ character, scene, name }: StateMachineBokoblinOptions) {
    character.setVelocity(0);
    if (character.swingTarget?.body) {
      character.swingCooldown.consume();

      const orientation = new Phaser.Math.Vector2(
        character.swingTarget.body.position.x - character.x,
        character.swingTarget.body.position.y - character.y,
      ).normalize();
      const nextDirection = getDirectionFromVector(orientation);

      character.direction.setDirection(nextDirection);

      scene.time.delayedCall(Phaser.Math.Between(250, 750), () => {
        if (scene) {
          if (!character.health.isDead()) {
            character.skills.useCurrent(orientation, () => {
              if (!character.health.isDead()) {
                character.setSwingTarget(null);
                this.stateMachine.transition('idle');
              }
            });
            character.anims.play(`${name}_idle_${character.direction.value}`, true);
          }
        }
      });
    }
  }

  execute({ character, name, scene }: StateMachineBokoblinOptions) {
    if (character.health.isDead()) {
      this.stateMachine.transition('dead');
      return;
    }

    if (character.health.isDamaged()) {
      character.setSwingTarget(null);
      this.stateMachine.transition('damage');
    }
  }
}

export class DamageState extends State<StateMachineBokoblinOptions> {
  enter({ character, scene, name }: StateMachineBokoblinOptions) {
    character.anims.play(`${name}_idle_${character.direction.value}`, true);
    scene.time.delayedCall(500, () => {
      if (!character.health.isDead()) {
        this.stateMachine.transition('idle');
      } else if (this.stateMachine.state !== 'dead') {
        this.stateMachine.transition('dead');
      }
    });
  }
}
