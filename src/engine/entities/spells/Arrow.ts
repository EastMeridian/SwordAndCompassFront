import Phaser from 'phaser';
import { Direction } from 'src/utils/Direction';
import { PIPELINE } from 'src/constants';
import { Skill } from 'src/engine/components/skills/Skill';
import Character from '../characters/Character';

class Arrow extends Phaser.Physics.Arcade.Image {
  private direction!: Phaser.Math.Vector2;

  private sprite: Phaser.GameObjects.Sprite

  public damage = 1;

  private operating = true;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'arrow');
    this.sprite = scene.add.sprite(x, y, 'weapon_1');
  }

  use(
    direction: Phaser.Math.Vector2,
    character: Character,
    onComplete: () => void,
  ) {
    this.sprite?.setVisible(true);
    this.direction = direction.normalize();
    const angle = this.direction.angle();

    this.setAlpha(0);
    this.sprite
      .setScale(1.2)
      .setPosition(
        this.x + this.direction.x,
        this.y + this.direction.y,
      )
      .setRotation(angle + Math.PI)
      .setOrigin(0.75, 0.65)
      .setDepth((character.direction.value === Direction.DOWN
        || character.direction.value === Direction.RIGHT)
        ? 2 : 0)
      .setPipeline(PIPELINE)
      .play('weapon_swing_11')
      .on('animationcomplete', () => {
        this.setAlpha(1);
        this.scene.sound.get('bow').play();
        const angle = direction.angle();
        const speed = 1000;

        this.setOperating(true);
        this
          .setSize(64, 64)
          .setActive(true)
          .setVisible(true)
          .setRotation(angle + 1.5707963)
          .setScale(0.5)
          .setVelocity(direction.x * speed, direction.y * speed)
          .setPipeline(PIPELINE);

        this.sprite?.setVisible(false);
        onComplete?.();
      });
  }

  update(character: Character) {
    this.sprite.setPosition(
      character.x + this.direction.x,
      character.y + this.direction.y,
    );
  }

  isOperating() {
    return this.operating;
  }

  setOperating(operating: boolean) {
    this.operating = operating;
  }
}

export default Arrow;
