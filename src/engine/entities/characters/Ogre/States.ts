import Phaser from 'phaser';
import { Direction, getDirectionFromVector } from 'src/utils/Direction';
import { State } from 'src/engine/system/StateMachine';
import { sceneEvents } from 'src/engine/events/EventCenter';
import { ENEMY_DIE } from 'src/engine/events/events';
import Ogre from './Ogre';

export type StateMachineOptions = {
  name: string;
  character: Ogre;
  scene: Phaser.Scene;
};

export class IdleState extends State<StateMachineOptions> {
  enter = ({ character, name }: StateMachineOptions) => {
    character.setVelocity(0);
    character.anims.play(`${name}_idle`, true);
  }

  execute({ character }: StateMachineOptions) {
    if (character.health.isDead()) {
      this.stateMachine.transition('dead');
      return;
    }

    if (character.health.isDamaged()) {
      this.stateMachine.transition('damage');
      return;
    }

    if (character.hasTarget()) {
      this.stateMachine.transition('follow');
    }
  }
}

export class ChargeState extends State<StateMachineOptions> {
  enter({ character, scene, name }: StateMachineOptions) {
    character.setVelocity(0);

    character.anims.play(`${name}_idle`, true);

    character.balloon?.setAlpha(1)
      .play('idea_balloon')
      .on('animationcomplete', (data: any) => {
        character.balloon?.setAlpha(0);
        character.anims.play(`${name}_walk`, true);

        if (character.target) {
          const orientation = new Phaser.Math.Vector2(
            character.target.body.position.x - character.x,
            character.target.body.position.y - character.y,
          ).normalize();
          const speed = 900;
          scene.tweens.add({
            targets: character.body.velocity,
            x: orientation.x * speed,
            y: orientation.y * speed,
            duration: 900,
            ease: Phaser.Math.Easing.Quadratic.Out,
            onComplete: () => {
              scene.time.delayedCall(500, () => {
                if (this.stateMachine.state === 'charge') {
                  this.stateMachine.transition('follow');
                }
              });
            },
          });
        } else {
          this.stateMachine.transition('idle');
        }
      });
  }

  execute({ character }: StateMachineOptions) {
    if (character.health.isDead()) {
      this.stateMachine.transition('dead');
    }
  }
}

export class FollowState extends State<StateMachineOptions> {
  private chargeCount = 0;

  private getInterval() {
    let start = 3000 - this.chargeCount * 100;
    if (start < 1500) start = 1500;
    return Phaser.Math.Between(start, start + 500);
  }

  enter({ character, scene }: StateMachineOptions) {
    const interval = this.getInterval();
    scene.time.delayedCall(interval, () => {
      if (!character.health.isDead() && this.stateMachine.state !== 'charge') {
        this.chargeCount++;
        this.stateMachine.transition('charge');
      }
    });
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

    character.setVelocity(0);

    const delta = character.getTargetDeltaVector()?.scale(character.entity.speed);
    if (delta) {
      character.setVelocity(delta.x, delta.y);
      character.direction.setDirection(getDirectionFromVector(character.body.velocity));
      character.anims.play(`${name}_walk`, true);
    }
  }
}

export class StunState extends State<StateMachineOptions> {
  enter({ character, scene, name }: StateMachineOptions) {
    character.anims.play(`${name}_idle`, true);
    character.setVelocity(0);
    scene.time.delayedCall(1000, () => {
      if (this.stateMachine.state === 'stun') {
        this.stateMachine.transition('idle');
      }
    });
  }
}
export class DamageState extends State<StateMachineOptions> {
  enter({ character, scene, name }: StateMachineOptions) {
    character.anims.play(`${name}_idle`, true);
    scene.time.delayedCall(150, () => {
      if (this.stateMachine.state === 'damage') {
        this.stateMachine.transition('idle');
      }
    });
  }
}

export class DeadState extends State<StateMachineOptions> {
  // eslint-disable-next-line class-methods-use-this
  enter({ character, scene, name }: StateMachineOptions) {
    character.anims.play(`${name}_idle`, true);
    character.balloon?.setAlpha(0);
    character.disableBody();
    sceneEvents.emit(ENEMY_DIE, character.entity);
    scene.tweens.add({
      targets: character,
      alpha: 0,
      tint: 0x000000,
      duration: 2000,
      ease: 'Sine.eastIn',
      onComplete: () => character?.destroy(),
    });
  }
}
