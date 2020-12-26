import Phaser from 'phaser';

class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/dongeon_0.json');
    this.load.image('dongeon', 'assets/tilesets/dongeon_extruded.png');
    this.load.image('arrow', 'assets/sprites/arrow_1.png');
    this.load.spritesheet('chest', 'assets/sprites/chest.png', { frameWidth: 48, frameHeight: 48 });
    this.load.spritesheet('dwarf', 'assets/sprites/dwarf.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('other', 'assets/sprites/other_1.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('lights', 'assets/sprites/other_2.png', { frameWidth: 32, frameHeight: 64 });
    this.load.spritesheet('monster', 'assets/sprites/monster_1.png', { frameWidth: 32, frameHeight: 32 });

    this.load.spritesheet('weapon1', 'assets/sprites/weapon_1.png', {
      frameWidth: 96,
      frameHeight: 64,
    });

    this.load.audio('chest', ['assets/sounds/SE/Chest.ogg']);
    this.load.audio('skill1', ['assets/sounds/SE/Skill1.ogg']);
    this.load.audio('bow', ['assets/sounds/SE/Bow3.ogg']);
    this.load.audio('monster', ['assets/sounds/SE/Monster1.ogg']);
    this.load.audio('damage', ['assets/sounds/SE/Damage2.ogg']);
  }

  create() {
    this.scene.start('game');
  }
}

export default PreloaderScene;
