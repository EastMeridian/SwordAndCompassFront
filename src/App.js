import React, { useEffect, useState } from "react";
import Phaser from "phaser";
import { AppContainer, TilemapContainer, TilesetContainer } from './layout';
import TilePicker from './components/TilePicker';


const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  pixelArt: true,
  physics: {
    default: "arcade",
  },
  scene: {
    preload: preload,
    create: create,
    update: updateDirect,
  },
};

let ship = null;
let cursors = null;

function preload() {
  this.load.image("ship", "assets/fmship.png");
  this.load.tilemapTiledJSON("map", "assets/tileset.json");
  /*   this.load.tilemapTiledJSON("map", "assets/super-mario.json");
    this.load.image("tiles1", "assets/super-mario.png"); */
  this.load.image("tiles1", "assets/tileset.png");
}

function create() {
  this.cameras.main.setBounds(0, 0, 3392, 100);
  this.physics.world.setBounds(0, 0, 3392, 240);

  const map = this.make.tilemap({ key: "map" });
  const tileset = map.addTilesetImage("SuperMarioBros-World1-1", "tiles1");
  const layer = map.createStaticLayer("World1", tileset, 0, 0);

  cursors = this.input.keyboard.createCursorKeys();

  ship = this.physics.add.image(400, 100, 'ship').setAngle(90).setCollideWorldBounds(true);
  ship = this.add.image(400, 100, "ship").setAngle(90);

  this.cameras.main.startFollow(ship, true, 0.08, 0.08);

  this.cameras.main.setZoom(1);
}

function updateDirect() {
  if (cursors.left.isDown && ship.x > 0) {
    ship.setAngle(-90);
    ship.x -= 2.5;
  } else if (cursors.right.isDown && ship.x < 3392) {
    ship.setAngle(90);
    ship.x += 2.5;
  }

  if (cursors.up.isDown && ship.y > 0) {
    ship.y -= 2.5;
  } else if (cursors.down.isDown && ship.y < 240) {
    ship.y += 2.5;
  }
}

function update() {
  ship.setVelocity(0);

  if (cursors.left.isDown) {
    ship.setAngle(-90).setVelocityX(-200);
  } else if (cursors.right.isDown) {
    ship.setAngle(90).setVelocityX(200);
  }

  if (cursors.up.isDown) {
    ship.setVelocityY(-200);
  } else if (cursors.down.isDown) {
    ship.setVelocityY(200);
  }
}

function App() {
  const [selected, setSelected] = useState({ x: 0, y: 0 });
  useEffect(() => { const game = new Phaser.Game(config); }, []);

  return (
    <TilesetContainer><TilePicker value={selected} onChange={setSelected} /></TilesetContainer>
  );
}

export default App;
