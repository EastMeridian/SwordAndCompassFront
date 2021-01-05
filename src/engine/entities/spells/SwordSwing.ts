import Phaser from 'phaser';
import { Direction } from 'src/utils/Direction';
import { PIPELINE } from 'src/constants';
import { Skill } from 'src/engine/components/skills/Skill';
import Character from '../characters/Character';

const SPRITE_RATIO = 0.3;

class SwordSwing extends Phaser.GameObjects.Rectangle {
  private direction!: Phaser.Math.Vector2;

  private sprite:Phaser.GameObjects.Sprite

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 56, 56, 0xffffff);

    this.sprite = scene.add.sprite(x, y, 'weapon1');
  }

  use(
    direction: Phaser.Math.Vector2,
    character: Character,
    onComplete: () => void,
  ) {
    this.direction = direction.normalize().scale(64);
    const angle = this.direction.angle();

    this
      .setAlpha(0)
      .setPosition(this.x + this.direction.x, this.y + this.direction.y);

    this.sprite
      /* .setSize(48, 48) */
      .setFlipX(true)
      .setScale(1.4)
      .setPosition(
        this.x + this.direction.x * SPRITE_RATIO,
        this.y + this.direction.y * SPRITE_RATIO,
      )
      .setOrigin(0.5, 0.9)
      .setRotation(angle - ((-Math.PI) / 4))
      .setDepth(character.direction.value === Direction.DOWN ? 1 : 0)
      .setPipeline(PIPELINE)
      .play('weapon_swing_1')
      .on('animationcomplete', () => {
        onComplete();
        this.destroy();
      });
  }

  update(character: Character) {
    this.setPosition(character.x + this.direction.x, character.y + this.direction.y);
    this.sprite.setPosition(
      character.x + this.direction.x * SPRITE_RATIO,
      character.y + this.direction.y * SPRITE_RATIO,
    );
  }

  destroy() {
    super.destroy();
    this.sprite.destroy();
  }
}

export default SwordSwing;
