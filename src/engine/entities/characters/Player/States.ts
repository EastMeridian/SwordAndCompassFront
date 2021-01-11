import Phaser from 'phaser';
import { Direction } from 'src/utils/Direction';
import { State } from 'src/engine/system/StateMachine';
import {
  Order,
} from 'src/utils/Order';
import { HealthState } from 'src/engine/components/HealthComponent';
import { sceneEvents } from 'src/engine/events/EventCenter';
import { PLAYER_HEALTH_CHANGED } from 'src/engine/events/events';
import Player from './Player';

export type StateMachineOptions = {
  name: string;
  character: Player;
  scene: Phaser.Scene;
};

export class IdleState extends State<StateMachineOptions> {
  enter = ({ character, name }: StateMachineOptions) => {
    character.setVelocity(0);
    character.anims.play(`${name}_idle_${character.direction.value}`, true);
  }

  execute({ character, name }: StateMachineOptions) {
    const { orders } = character;
    if (character.health.isDead()) {
      this.stateMachine.transition('dead');
      return;
    }

    if (character.isFalling()) {
      this.stateMachine.transition('falling');
      return;
    }

    if (character.health.isDamaged()) {
      this.stateMachine.transition('damage');
      return;
    }

    if (orders[Order.ACTION_ONE]) {
      this.stateMachine.transition('action');
      return;
    }

    if (orders[Order.JUMP]) {
      if (character.energy && character.energy > 30) {
        this.stateMachine.transition('jump');
        return;
      }
    }
    if (orders[Order.DOWN]
      || orders[Order.LEFT]
      || orders[Order.RIGHT]
      || orders[Order.UP]
    ) {
      this.stateMachine.transition('move');
    }
  }
}

export class MoveState extends State<StateMachineOptions> {
  execute({ character, name }: StateMachineOptions) {
    const { orders } = character;

    if (character.health.isDead()) {
      this.stateMachine.transition('dead');
      return;
    }

    if (character.isFalling()) {
      this.stateMachine.transition('falling');
      return;
    }

    if (orders[Order.ACTION_ONE]) {
      this.stateMachine.transition('action');
      return;
    }

    if (orders[Order.JUMP]) {
      if (character.energy && character.energy > 30) {
        this.stateMachine.transition('jump');
        return;
      }
    }

    if (!(orders[Order.DOWN]
      || orders[Order.LEFT]
      || orders[Order.RIGHT]
      || orders[Order.UP]
    )) {
      this.stateMachine.transition('idle');
      return;
    }

    character.setVelocity(0);
    if (orders[Order.UP]) {
      character.setVelocityY(-1);
    } else if (orders[Order.DOWN]) {
      character.setVelocityY(1);
    }
    if (orders[Order.LEFT]) {
      character.setVelocityX(-1);
    } else if (orders[Order.RIGHT]) {
      character.setVelocityX(1);
    }

    character.body.velocity.normalize().scale(character.speed);

    if (orders[Order.LEFT]) {
      character.direction.setDirection(Direction.LEFT);
    } else if (orders[Order.RIGHT]) {
      character.direction.setDirection(Direction.RIGHT);
    } else if (orders[Order.UP]) {
      character.direction.setDirection(Direction.UP);
    } else if (orders[Order.DOWN]) {
      character.direction.setDirection(Direction.DOWN);
    }

    character.anims.play(`${name}_walk_${character.direction.value}`, true);
  }
}

export class ActionOneState extends State<StateMachineOptions> {
  enter({ character, name }: StateMachineOptions) {
    character.setVelocity(0);

    const orientation = character.getPointerOrientation();

    const nextDirection = character.getPointerDirection();
    character.direction.setDirection(nextDirection);
    character.skills.useCurrent(orientation, () => {
      if (!character.health.isDead()) {
        this.stateMachine.transition('idle');
      }
    });
    character.anims.play(`${name}_idle_${character.direction.value}`, true);
  }
}

export class JumpState extends State<StateMachineOptions> {
  enter({ character, scene }: StateMachineOptions) {
    character.setJumping(true);
    character.jump(() => {
      character.setJumping(false);
      this.stateMachine.transition('idle');
    });
  }
}

export class DamageState extends State<StateMachineOptions> {
  enter({ character, scene }: StateMachineOptions) {
    scene.time.delayedCall(500, () => {
      this.stateMachine.transition('idle');
    });
  }

  execute({ character }: StateMachineOptions) {
    if (character.isFalling()) {
      this.stateMachine.transition('falling');
    }
  }
}

export class FallingState extends State<StateMachineOptions> {
  enter({ character, scene, name }: StateMachineOptions) {
    character.setVelocity(0);

    character.anims.play(`${name}_walk_${character.direction.value}`, true);

    scene.tweens.add({
      targets: character,
      duration: 500,
      scaleX: 0.20,
      scaleY: 0.20,
      ease: 'Quint.easeOut',
      onComplete: () => {
        character.health.setDamaged(HealthState.DEAD);
        character.health.oneShot();
        this.stateMachine.transition('dead');
        sceneEvents.emit(PLAYER_HEALTH_CHANGED, character.health.value);
      },
    });
  }
}

export class DeadState extends State<StateMachineOptions> {
  // eslint-disable-next-line class-methods-use-this
  enter({ name, character }: StateMachineOptions) {
    character.anims.play(`${name}_dead`, true);
  }
}
