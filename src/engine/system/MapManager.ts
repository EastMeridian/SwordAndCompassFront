import Phaser from 'phaser';

class MapManager {
  map: Phaser.Tilemaps.Tilemap;

  tileset: Phaser.Tilemaps.Tileset;

  groundLayer: Phaser.Tilemaps.TilemapLayer;

  colliderLayer: Phaser.Tilemaps.TilemapLayer;

  overlayLayer: Phaser.Tilemaps.TilemapLayer;

  constructor(scene: Phaser.Scene) {
    this.map = scene.make.tilemap({ key: 'map' });
    this.tileset = this.map.addTilesetImage('dongeon', 'dongeon', 64, 64, 1, 2);

    this.groundLayer = this.map.createLayer('ground', this.tileset, 0, 0).setPipeline('Light2D');
    this.colliderLayer = this.map.createLayer('collider', this.tileset, 0, 0).setPipeline('Light2D');
    this.overlayLayer = this.map.createLayer('overlay', this.tileset, 0, 0).setDepth(1).setPipeline('Light2D');

    this.colliderLayer.setCollisionByExclusion([-1]);
  }
}

export default MapManager;
