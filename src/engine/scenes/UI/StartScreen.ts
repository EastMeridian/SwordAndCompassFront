import { ThreeDRotationSharp } from '@material-ui/icons';
import Phaser from 'phaser';
import {
  createForesterAnimation,
  createMountainDwellerAnimation,
  createWarriorAnimation,
  createSorcererAnimation,
  createElfAnimation,
} from 'src/engine/animations/createPlayerAnimation';
import {
  PlayerData,
  ElfPlayer,
  MountainDwellerPlayer,
  ForesterPlayer,
  WarriorPlayer,
  SorcererPlayer,
} from 'src/engine/data/entities';

import { Direction } from 'src/utils/Direction';
import FormUtil from './FormUtil';

class StartScreen extends Phaser.Scene {
  private sprites: Phaser.GameObjects.Sprite[] = [];

  players = [
    ElfPlayer,
    MountainDwellerPlayer,
    ForesterPlayer,
    WarriorPlayer,
    SorcererPlayer,
  ];

  private selected!: PlayerData;

  private index = 2;

  constructor() {
    super({ key: 'start' });
  }

  create() {
    const { width, height } = this.cameras.main;

    const screenCenterX = (width / 2);
    const screenCenterY = (height / 2);

    createForesterAnimation(this);
    createMountainDwellerAnimation(this);
    createWarriorAnimation(this);
    createSorcererAnimation(this);
    createElfAnimation(this);

    this.sprites = this.players.map(({ texture, anims }, index) => {
      const sprite = this.add.sprite(screenCenterX - 256 + index * 128, screenCenterY, texture);
      sprite
        .setScale(2)
        .setOrigin(0.5, 0.5)
        .setAlpha(0.5)
        .anims.play(`${anims}_idle_${Direction.DOWN}`, true);
      sprite
        .setDataEnabled()
        .data.set('anims', anims);

      return sprite;
    });
    this.hightlight();

    this.input.topOnly = false;
    this.input.on('gameobjectover', (pointer: any, gameObject: any) => {
      gameObject.setAlpha(1);
    });

    this.input.on('gameobjectout', (pointer: any, gameObject: any) => {
      gameObject.setAlpha(0.7);
    });

    const leftArrow = this.add.image(0 + 128, screenCenterY, 'left_arrow')
      .setAlpha(0.7)
      .setInteractive()
      .on('pointerdown', () => {
        leftArrow.setScale(0.9);
        this.before();
        this.hightlight();
      })
      .on('pointerout', () => {
        leftArrow.setScale(1);
      })
      .on('pointerup', () => {
        leftArrow.setScale(1);
      });

    const rightArrow = this.add.image(width - 128, screenCenterY, 'right_arrow')
      .setAlpha(0.7)
      .setInteractive()
      .on('pointerdown', () => {
        rightArrow.setScale(0.9);
        this.next();
        this.hightlight();
      })
      .on('pointerout', () => {
        rightArrow.setScale(1);
      })
      .on('pointerup', () => {
        rightArrow.setScale(1);
      });

    this.add.text(screenCenterX, 136, 'Sword & Compass', {
      fontFamily: 'minecraft',
      fontSize: '64px',
    }).setOrigin(0.5, 0.5);

    this.add.text(screenCenterX, height - 136, 'PLAY', {
      fontFamily: 'minecraft',
      fontSize: '32px',
    }).setOrigin(0.5, 0.5).setAlpha(0.7)
      .setInteractive()
      .on('pointerdown', () => {
        rightArrow.setScale(0.9);
      })
      .on('pointerout', () => {
        rightArrow.setScale(1);
      })
      .on('pointerup', () => {
        rightArrow.setScale(1);
        this.scene.start('game', this.selected);
      });

    this.cameras.main.fadeIn(1500);
  }

  hightlight() {
    this.sprites.map((sprite) => sprite
      .setAlpha(0.5)
      .anims.play(`${sprite.data.get('anims')}_idle_${Direction.DOWN}`, true));

    const sprite = this.sprites[this.index];
    sprite
      .setAlpha(1)
      .anims.play(`${sprite.data.get('anims')}_walk_${Direction.DOWN}`, true);

    this.selected = this.players[this.index];
  }

  before() {
    this.index--;
    if (this.index < 0) this.index = this.sprites.length - 1;
  }

  next() {
    this.index++;
    if (this.index > this.sprites.length - 1) this.index = 0;
  }
}

export default StartScreen;
