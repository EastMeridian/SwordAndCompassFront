import Phaser from 'phaser';
import { Direction } from 'src/utils/Direction';
import { PIPELINE } from 'src/constants';
import { Skill } from 'src/engine/components/skills/Skill';
import Character from '../characters/Character';

class Arrow extends Phaser.Physics.Arcade.Image {
  private direction!: Phaser.Math.Vector2;

  private sprite: Phaser.GameObjects.Sprite

  public damage = 100;

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
        this.x + this.direction.x * 10,
        this.y + this.direction.y * 10,
      )
      .setRotation(angle + Math.PI)
      .setOrigin(0.75, 0.65)
      .setPipeline(PIPELINE)
      .play('weapon_swing_11')
      .on('animationcomplete', () => {
        this.setAlpha(1);
        this.scene.sound.get('bow').play();
        const angle = direction.angle();
        const speed = 1000;

        this.setOperating(true);
        this

          .setSize(32, 32)
          .setActive(true)
          .setVisible(true)
          .setRotation(angle + 1.5707963)
          .setScale(0.5)
          .setVelocity(direction.x * speed, direction.y * speed)
          .setPipeline(PIPELINE);

        this.sprite?.setVisible(false);
        onComplete?.();
      });
    this.depth = (this.y + this.height / 2) - 128;
    this.sprite.depth = (this.sprite.y + this.sprite.height / 2) - 10;
    console.log('bow depth', this.sprite.depth);
  }

  /*   update(character: Character) {
    this.sprite.setPosition(
      character.x + this.direction.x,
      character.y + this.direction.y,
    );
  } */

  isOperating() {
    return this.operating;
  }

  setOperating(operating: boolean) {
    this.operating = operating;
  }
}

export default Arrow;
