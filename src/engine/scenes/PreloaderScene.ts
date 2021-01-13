import Phaser from 'phaser';
import { reactBridgeEvents } from 'src/engine/events/EventCenter';
import MusicManager from 'src/engine/system/MusicManager';
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

    this.load.tilemapTiledJSON('map', 'assets/tilemaps/dongeon_2.json');
    this.load.image('dongeon', 'assets/tilesets/dongeon_extruded.png');

    // SPRITE
    this.load.image('arrow', 'assets/sprites/arrow_1.png');
    this.load.spritesheet('chest', 'assets/sprites/chest.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('other', 'assets/sprites/other_1.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('lights', 'assets/sprites/other_2.png', { frameWidth: 32, frameHeight: 64 });
    this.load.spritesheet('balloon', 'assets/sprites/balloon.png', { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet('icons', 'assets/sprites/icons.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('icons_2', 'assets/sprites/icons_2.png', { frameWidth: 24, frameHeight: 24 });

    this.load.spritesheet('monster', 'assets/sprites/monster_1.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('monster_2', 'assets/sprites/monster_2.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('big_monster_2', 'assets/sprites/big_monster_2.png', { frameWidth: 80, frameHeight: 80 });

    this.load.spritesheet('character_1', 'assets/sprites/characters_1.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('character_2', 'assets/sprites/characters_2.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('character_3', 'assets/sprites/characters_3.png', { frameWidth: 32, frameHeight: 32 });

    this.load.spritesheet('damage_1', 'assets/sprites/damage_1.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('damage_3', 'assets/sprites/damage_3.png', { frameWidth: 32, frameHeight: 32 });

    this.load.spritesheet('recovery1', 'assets/animations/Recovery1.png', { frameWidth: 192, frameHeight: 192 });

    this.load.spritesheet('weapon_1', 'assets/sprites/weapon_1.png', {
      frameWidth: 96,
      frameHeight: 64,
    });

    // SOUND
    this.load.audio('cursor', ['assets/sounds/SE/Cursor2.ogg']);
    this.load.audio('chest', ['assets/sounds/SE/Chest.ogg']);
    this.load.audio('skill1', ['assets/sounds/SE/Skill1.ogg']);
    this.load.audio('bow', ['assets/sounds/SE/Bow3.ogg']);
    this.load.audio('monster', ['assets/sounds/SE/Monster1.ogg']);
    this.load.audio('damage', ['assets/sounds/SE/Damage2.ogg']);
    this.load.audio('blow', ['assets/sounds/SE/Blow6.ogg']);
    this.load.audio('sword', ['assets/sounds/SE/Sword5.ogg']);
    this.load.audio('fall', ['assets/sounds/SE/Fall.ogg']);
    this.load.audio('heal', ['assets/sounds/SE/Heal4.ogg']);
    this.load.audio('damage2', ['assets/sounds/SE/Damage1.ogg']);

    this.load.audio('intro_music', ['assets/sounds/BGM/for_a_feeling_opera.mp3']);
    this.load.audio('dongeon_music', ['assets/sounds/BGM/paleowolf_archaic_eon.mp3']);

    // UI
    this.load.image('left_arrow', 'assets/icons/left-arrow.png');
    this.load.image('right_arrow', 'assets/icons/right-arrow.png');
    this.load.image('switch-to-full-screen', 'assets/icons/switch-to-full-screen-button.png');
    this.load.image('mute', 'assets/icons/mute.png');
    this.load.image('volume', 'assets/icons/volume.png');
    this.load.image('gear', 'assets/icons/gear.png');
  }

  create() {
    this.input.mouse.disableContextMenu();
    MusicManager.setScene(this);
    this.scene.start('start');
    this.scene.run('ui-actionbar');
  }
}

export default PreloaderScene;
