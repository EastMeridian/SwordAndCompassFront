import Phaser from 'phaser';

class MapManager {
  map: Phaser.Tilemaps.Tilemap;

  tileset: Phaser.Tilemaps.Tileset;

  groundLayer: Phaser.Tilemaps.StaticTilemapLayer;

  colliderLayer: Phaser.Tilemaps.StaticTilemapLayer;

  overlayLayer: Phaser.Tilemaps.StaticTilemapLayer;

  constructor(scene: Phaser.Scene) {
    this.map = scene.make.tilemap({ key: 'map' });
    this.tileset = this.map.addTilesetImage('dongeon', 'dongeon', 64, 64, 1, 2);

    this.groundLayer = this.map.createStaticLayer('ground', this.tileset, 0, 0);
    this.colliderLayer = this.map.createStaticLayer('collider', this.tileset, 0, 0);

    this.colliderLayer.setCollisionByExclusion([-1]);

    /*     const debugGraphics = scene.add.graphics().setAlpha(0.75);

    this.colliderLayer.renderDebug(debugGraphics, {
      tileColor: null, // Color of non-colliding tiles
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
      faceColor: new Phaser.Display.Color(40, 39, 37, 255), // Color of colliding face edges
    }); */

    this.overlayLayer = this.map.createStaticLayer('overlay', this.tileset, 0, 0).setDepth(1);
  }
}

export default MapManager;
