import Phaser from 'phaser';
import { DEPTH_FLOOR_OBJECT } from 'src/constants';
import { sceneEvents } from 'src/engine/events/EventCenter';
import { ENEMY_DIE } from 'src/engine/events/events';
import { State } from 'src/engine/system/StateMachine';
import Character from './Character';
import Enemy from './Enemy';

export type StateMachineOptionsBase<T> = {
  name: string;
  character: T;
  scene: Phaser.Scene;
};

export type StateMachineEnemyOptions = StateMachineOptionsBase<Enemy>;

export class DeadState extends State<StateMachineEnemyOptions> {
  // eslint-disable-next-line class-methods-use-this
  enter({ character, scene, name }: StateMachineEnemyOptions) {
    character.anims.play(`${name}_dead`, true);
    character.setDepth(DEPTH_FLOOR_OBJECT);
    sceneEvents.emit(ENEMY_DIE, character.entity);
    scene.tweens.add({
      targets: character,
      alpha: 0,
      tint: 0x000000,
      duration: 3000,
      delay: 3500,
      ease: 'Sine.eastIn',
      onComplete: () => {
        character?.destroy();
      },
    });
  }
}
