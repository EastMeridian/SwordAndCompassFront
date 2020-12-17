import Phaser from 'phaser';

class PreloaderScene extends Phaser.Scene {
  constructor() {
    super('preloader');
  }

  preload() {
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/dongeon_0.json');
    this.load.image('dongeon', 'assets/tilesets/dongeon_extruded.png');
    this.load.spritesheet('dwarf', 'assets/sprites/dwarf.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('monster', 'assets/sprites/monster_1.png', { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    this.scene.start('game');
  }
}

export default PreloaderScene;
