import Phaser from 'phaser';
import { reactBridgeEvents } from 'src/engine/events/EventCenter';
import { GAME_LOADED } from '../events/events';

class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    const { width, height } = this.cameras.main;

    const screenCenterX = (width / 2) - 160;
    const screenCenterY = (height / 2) - 25;

    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
      },
    });

    loadingText.setOrigin(0.5, 0.5);

    const assetText = this.make.text({
      x: width / 2,
      y: height / 2 + 50,
      text: '',
      style: {
        font: '18px monospace',
      },
    });

    assetText.setOrigin(0.5, 0.5);

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();

    progressBox
      .fillStyle(0x222222, 0.8)
      .fillRect(screenCenterX, screenCenterY, 320, 50);
    this.load.on('progress', (value: any) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(screenCenterX + 10, screenCenterY + 10, 300 * value, 30);
    });

    this.load.on('fileprogress', (file: any) => {
      assetText.setText(`Loading asset: ${file.key}`);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      assetText.destroy();
      loadingText.destroy();
    });

    this.load.tilemapTiledJSON('map', 'assets/tilemaps/dongeon_0.json');
    this.load.image('dongeon', 'assets/tilesets/dongeon_extruded.png');
    this.load.image('arrow', 'assets/sprites/arrow_1.png');
    this.load.spritesheet('chest', 'assets/sprites/chest.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('other', 'assets/sprites/other_1.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('lights', 'assets/sprites/other_2.png', { frameWidth: 32, frameHeight: 64 });
    this.load.spritesheet('monster', 'assets/sprites/monster_1.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('balloon', 'assets/sprites/balloon.png', { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet('big_monster_2', 'assets/sprites/big_monster_2.png', { frameWidth: 80, frameHeight: 80 });

    this.load.spritesheet('character_1', 'assets/sprites/characters_1.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('character_2', 'assets/sprites/characters_2.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('character_3', 'assets/sprites/characters_3.png', { frameWidth: 32, frameHeight: 32 });

    this.load.spritesheet('damage_1', 'assets/sprites/damage_1.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('damage_3', 'assets/sprites/damage_3.png', { frameWidth: 32, frameHeight: 32 });

    this.load.spritesheet('recovery1', 'assets/animations/Recovery1.png', { frameWidth: 192, frameHeight: 192 });

    this.load.spritesheet('weapon1', 'assets/sprites/weapon_1.png', {
      frameWidth: 96,
      frameHeight: 64,
    });

    this.load.audio('chest', ['assets/sounds/SE/Chest.ogg']);
    this.load.audio('skill1', ['assets/sounds/SE/Skill1.ogg']);
    this.load.audio('bow', ['assets/sounds/SE/Bow3.ogg']);
    this.load.audio('monster', ['assets/sounds/SE/Monster1.ogg']);
    this.load.audio('damage', ['assets/sounds/SE/Damage2.ogg']);

    // UI
    this.load.image('left_arrow', 'assets/icons/left-arrow.png');
    this.load.image('right_arrow', 'assets/icons/right-arrow.png');
  }

  create() {
    this.scene.start('start');
  }
}

export default PreloaderScene;
