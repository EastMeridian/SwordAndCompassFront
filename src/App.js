import React, { useEffect, useState } from "react";
import Phaser from "phaser";
import { UIContainer } from './layout';
import TilePicker from './components/TilePicker';
import { TILE_SIZE } from './constants';

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1000,
  height: 760,
  pixelArt: true,
  physics: {
    default: "arcade",
  },
  scene: {
    preload,
    create,
    update,
  },
};

let map;
let controls;
let selectedGlobal;

const layers = [];

function preload() {
  this.load.image("tiles", "assets/tileset.png");
}

function create() {
  map = this.make.tilemap({
    tileWidth: TILE_SIZE,
    tileHeight: TILE_SIZE,
    width: 50,
    height: 50,
  });
  const tileset = map.addTilesetImage("tiles");
  layers.push(
    map
      .createBlankDynamicLayer("World1", tileset)
      .randomize(0, 0, map.width, map.height, [0])
  );

  const cursors = this.input.keyboard.createCursorKeys();
  const controlConfig = {
    camera: this.cameras.main,
    left: cursors.left,
    right: cursors.right,
    up: cursors.up,
    down: cursors.down,
    speed: 0.5
  };
  controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

  this.input.on('pointerdown', (pointer) => {
    const tile = layers[0].getTileAtWorldXY(pointer.worldX, pointer.worldY)
    console.log(selectedGlobal, tile.x, tile.y);
    layers[0].putTileAt(selectedGlobal, tile.x, tile.y)
    console.log(layers, pointer, layers[0].getTileAtWorldXY(pointer.worldX, pointer.worldY));
  }, this);

  /* cursors = this.input.keyboard.createCursorKeys();

  ship = this.physics.add.image(400, 100, 'ship').setAngle(90).setCollideWorldBounds(true);
  ship = this.add.image(400, 100, "ship").setAngle(90);

  this.cameras.main.startFollow(ship, true, 0.08, 0.08);

  this.cameras.main.setZoom(1); */
}
/* 
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
} */


function update(item, delta) {
  controls.update(delta);
}

function App() {
  const [selected, setSelected] = useState({ x: 0, y: 0 });
  const [currentLayer, setCurrentLayer] = useState(layers[0]);

  useEffect(() => {
    const game = new Phaser.Game(config);
    console.log({ game, input: game.input })

  }, []);
  useEffect(() => { });

  const handleSelectedChange = (position) => {
    setSelected(position);
    selectedGlobal = position.index;
  };

  return (
    <UIContainer>
      <div>
        {layers.map((layer) => (
          <div>{JSON.stringify(layer)}</div>
        ))}
      </div>
      <TilePicker value={selected} onChange={handleSelectedChange} />
    </UIContainer>
  );
}

export default App;
