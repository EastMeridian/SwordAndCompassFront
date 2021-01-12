import Phaser from 'phaser';
import { State } from 'src/engine/system/StateMachine';
import Character from './Character';

export type StateMachineOptionsBase<T> = {
  name: string;
  character: T;
  scene: Phaser.Scene;
};

export type StateMachineCharacterOptions = StateMachineOptionsBase<Character>;

export class DeadState extends State<StateMachineCharacterOptions> {
  // eslint-disable-next-line class-methods-use-this
  enter({ character, scene, name }: StateMachineCharacterOptions) {
    character.anims.play(`${name}_dead`, true);
    character.setDepth(0);
    scene.tweens.add({
      targets: character,
      alpha: 0,
      tint: 0x000000,
      duration: 3000,
      delay: 3500,
      ease: 'Sine.eastIn',
      onComplete: () => character?.destroy(),
    });
  }
}
