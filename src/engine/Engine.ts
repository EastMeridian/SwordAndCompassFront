import Phaser from 'phaser';
import { cursorTo } from 'readline';
import { FRAME_RATE } from 'src/constants';
import MapManager from 'src/engine/system/MapManager';
import Ghost from 'src/engine/entities/Ghost';
import { Direction } from 'src/utils/Direction';

let player: Phaser.Physics.Arcade.Sprite;
let monsters: Phaser.Physics.Arcade.Group;
let playerDirection: Direction = Direction.DOWN;
let keys!: any;
let mapManager: MapManager;
let idleFrames: any;
let hit = 0;
const PLAYER_SPEED = 300;

function preload(this: Phaser.Scene) {
  this.load.tilemapTiledJSON('map', 'assets/tilemaps/dongeon_0.json');
  this.load.image('dongeon', 'assets/tilesets/dongeon.png');
  this.load.spritesheet('dwarf', 'assets/sprites/dwarf.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('monster', 'assets/sprites/monster_1.png', { frameWidth: 32, frameHeight: 32 });
}

function create(this: Phaser.Scene) {
  const {
    Z, Q, S, D, SPACE,
  } = Phaser.Input.Keyboard.KeyCodes;

  keys = this.input.keyboard.addKeys({
    up: Z,
    left: Q,
    right: D,
    down: S,
    space: SPACE,
  });

  mapManager = new MapManager(this);

  this.cameras.main.setBounds(0, 0, mapManager.map.widthInPixels, mapManager.map.heightInPixels);
  this.physics.world.setBounds(0, 0, mapManager.map.widthInPixels, mapManager.map.heightInPixels);

  this.anims.create({
    key: 'walk_down',
    frames: this.anims.generateFrameNumbers('dwarf', { frames: [0, 1, 2, 1] }),
    frameRate: FRAME_RATE,
  });

  this.anims.create({
    key: 'walk_left',
    frames: this.anims.generateFrameNumbers('dwarf', { frames: [3, 4, 5, 4] }),
    frameRate: FRAME_RATE,
  });

  this.anims.create({
    key: 'walk_right',
    frames: this.anims.generateFrameNumbers('dwarf', { frames: [6, 7, 8, 7] }),
    frameRate: FRAME_RATE,
  });

  this.anims.create({
    key: 'walk_up',
    frames: this.anims.generateFrameNumbers('dwarf', { frames: [9, 10, 11, 10] }),
    frameRate: FRAME_RATE,
  });

  this.anims.create({
    key: 'monster_walk_down',
    frames: this.anims.generateFrameNumbers('monster', { frames: [0, 1, 2, 1] }),
    frameRate: FRAME_RATE,
    repeat: -1,
  });

  this.anims.create({
    key: 'monster_walk_left',
    frames: this.anims.generateFrameNumbers('monster', { frames: [3, 4, 5, 4] }),
    frameRate: FRAME_RATE,
    repeat: -1,
  });

  this.anims.create({
    key: 'monster_walk_right',
    frames: this.anims.generateFrameNumbers('monster', { frames: [6, 7, 8, 7] }),
    frameRate: FRAME_RATE,
  });

  this.anims.create({
    key: 'monster_walk_up',
    frames: this.anims.generateFrameNumbers('monster', { frames: [9, 10, 11, 10] }),
    frameRate: FRAME_RATE,
  });

  idleFrames = {
    [Direction.DOWN]: 1,
    [Direction.LEFT]: 4,
    [Direction.RIGHT]: 7,
    [Direction.UP]: 10,
  };

  player = this.physics.add.sprite(400, 300, 'dwarf').setScale(1.6);

  monsters = this.physics.add.group({
    classType: Ghost,
    createCallback: (go) => {
      const ghostGo = go as Ghost;
      console.log('createCallback', go);
      ghostGo.body.onCollide = true;
    },
  });
  monsters.get(800, 600, 'ghost');

  this.physics.add.collider(player, mapManager.colliderLayer);
  this.physics.add.collider(monsters, mapManager.colliderLayer);

  this.physics.add.collider(monsters, player, (
    obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) => {
    const monster = obj2 as Ghost;

    const dx = player.x - monster.x;
    const dy = player.y - monster.y;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);
    player.setVelocity(dir.x, dir.y);
    hit = 1;
  });
  this.cameras.main.startFollow(player, true);

  this.cameras.main.setZoom(1);
}

function update(time: number, delta: number) {
  if (hit > 0) {
    ++hit;

    if (hit > 10) {
      hit = 0;
    }
    return;
  }
  // velocity
  player.setVelocity(0);

  if (keys.left.isDown) {
    player.setVelocityX(-PLAYER_SPEED);
  } else if (keys.right.isDown) {
    player.setVelocityX(PLAYER_SPEED);
  }

  if (keys.up.isDown) {
    player.setVelocityY(-PLAYER_SPEED);
  } else if (keys.down.isDown) {
    player.setVelocityY(PLAYER_SPEED);
  }

  player.body.velocity.normalize().scale(400);

  // animation
  if (
    keys.up?.isDown
    || keys.right?.isDown
    || keys.left?.isDown
    || keys.down?.isDown
  ) {
    if (keys.left.isDown) {
      player.anims.play('walk_left', true);
      playerDirection = Direction.LEFT;
    } else if (keys.right.isDown) {
      player.anims.play('walk_right', true);
      playerDirection = Direction.RIGHT;
    } else if (keys.up.isDown) {
      player.anims.play('walk_up', true);
      playerDirection = Direction.UP;
    } else if (keys.down.isDown) {
      player.anims.play('walk_down', true);
      playerDirection = Direction.DOWN;
    }
  } else if (player.anims.isPlaying) {
    player.anims.stop();
    player.setFrame(idleFrames[playerDirection]);
  }
}

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  parent: 'game-container',
  width: window.innerWidth * 0.75,
  height: window.innerHeight * 0.75,
  physics: {
    default: 'arcade',
    arcade: { debug: true },
  },
  render: {
    pixelArt: true,
  },
  scene: {
    preload,
    create,
    update,
  },
};
