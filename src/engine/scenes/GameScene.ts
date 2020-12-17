/* eslint-disable import/no-duplicates */
import Phaser from 'phaser';
import MapManager from 'src/engine/system/MapManager';
import Ghost from 'src/engine/entities/Ghost';
import 'src/engine/entities/Player';
import Player from 'src/engine/entities/Player';

import { createPlayerAnimation } from 'src/engine/animations/createPlayerAnimation';
import { createGhostAnimation } from 'src/engine/animations/createGhostAnimation';

import { sceneEvents } from 'src/engine/events/EventCenter';

class GameScene extends Phaser.Scene {
  private player!: Player;

  private mapManager!: MapManager;

  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super('game');
  }

  preload() {
    const {
      Z, Q, S, D, SPACE,
    } = Phaser.Input.Keyboard.KeyCodes;

    this.keys = this.input.keyboard.addKeys({
      up: Z,
      left: Q,
      right: D,
      down: S,
      space: SPACE,
    });
  }

  create() {
    this.scene.run('game-ui');
    createPlayerAnimation(this);
    createGhostAnimation(this);
    this.mapManager = new MapManager(this);

    this.cameras.main.setBounds(0, 0,
      this.mapManager.map.widthInPixels,
      this.mapManager.map.heightInPixels);
    this.physics.world.setBounds(0, 0,
      this.mapManager.map.widthInPixels,
      this.mapManager.map.heightInPixels);

    this.player = this.add.player(400, 300, 'dwarf');

    const monsters = this.physics.add.group({
      classType: Ghost,
      createCallback: (go) => {
        const ghostGo = go as Ghost;
        ghostGo.body.onCollide = true;
      },
    });

    monsters.get(800, 600, 'ghost');

    this.physics.add.collider(this.player, this.mapManager.colliderLayer);
    this.physics.add.collider(monsters, this.mapManager.colliderLayer);

    this.physics.add.collider(
      monsters, this.player, this.handlePLayerMonsterCollision, undefined, this,
    );
    this.cameras.main.startFollow(this.player, true);

    this.cameras.main.setZoom(1);
  }

  update(time: number, delta: number) {
    if (this.player) {
      this.player.update(this.keys);
    }
  }

  private handlePLayerMonsterCollision(
    obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    console.log(this.player);
    const monster = obj2 as Ghost;
    const dx = this.player.x - monster.x;
    const dy = this.player.y - monster.y;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.player.handleDamage(dir);

    sceneEvents.emit('player-health-changed');
  }
}

export default GameScene;
