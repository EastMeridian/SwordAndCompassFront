/* eslint-disable import/no-duplicates */
import Phaser from 'phaser';
import MapManager from 'src/engine/system/MapManager';
import Ghost from 'src/engine/entities/characters/Ghost';
import 'src/engine/entities/characters/Player';
import Player from 'src/engine/entities/characters/Player';
import Chest from 'src/engine/entities/objects/Chest';
import GroundSpikes from 'src/engine/entities/objects/GroundSpike';
import TorchLight from 'src/engine/entities/objects/TorchLight';
import Arrow from 'src/engine/entities/spells/Arrow';
import { createPlayerAnimation } from 'src/engine/animations/createPlayerAnimation';
import { createGhostAnimation } from 'src/engine/animations/createGhostAnimation';
import { createChestAnimation } from 'src/engine/animations/createChestAnimation';
import { createGroundSpikeAnimation } from 'src/engine/animations/createGroundSpikeAnimation';
import { createTorchLightAnimation } from 'src/engine/animations/createTorchLightAnimation';
import { createWeaponAnimation } from 'src/engine/animations/createWeaponAnimation';
import { sceneEvents } from 'src/engine/events/EventCenter';
import { PLAYER_HEALTH_CHANGED } from 'src/engine/events/events';
import GroundSpike from 'src/engine/entities/objects/GroundSpike';
import SwordSwing from 'src/engine/entities/spells/SwordSwing';

class GameScene extends Phaser.Scene {
  private player!: Player;

  private mapManager!: MapManager;

  private keys!: Phaser.Types.Input.Keyboard.CursorKeys | any;

  private arrows!: Phaser.Physics.Arcade.Group;

  private monsters!: Phaser.Physics.Arcade.Group;

  private torchLights!: Phaser.Physics.Arcade.StaticGroup;

  private playerGhostCollider?: Phaser.Physics.Arcade.Collider;

  private smallLens!: Phaser.GameObjects.Arc;

  private bigLens!: Phaser.GameObjects.Arc;

  constructor() {
    super('game');
  }

  preload() {
    const {
      Z, Q, S, D, E, SPACE,
    } = Phaser.Input.Keyboard.KeyCodes;

    this.keys = this.input.keyboard.addKeys({
      up: Z,
      left: Q,
      right: D,
      down: S,
      space: SPACE,
      E,
    });
  }

  create() {
    this.sound.add('chest');
    this.sound.add('skill1');
    this.sound.add('bow');
    this.sound.add('monster');
    this.sound.add('damage');

    this.scene.run('game-ui');
    createPlayerAnimation(this);
    createGhostAnimation(this);
    createChestAnimation(this);
    createTorchLightAnimation(this);
    createGroundSpikeAnimation(this);
    createWeaponAnimation(this);

    this.mapManager = new MapManager(this);

    this.cameras.main.setBounds(
      0,
      0,
      this.mapManager.map.widthInPixels,
      this.mapManager.map.heightInPixels,
    );

    this.physics.world.setBounds(
      0,
      0,
      this.mapManager.map.widthInPixels,
      this.mapManager.map.heightInPixels,
    );

    const chests = this.physics.add.staticGroup({
      classType: Chest,
    });

    const groundSpikes = this.physics.add.staticGroup({
      classType: GroundSpikes,
    });

    const swordSwings = this.physics.add.group({
      classType: SwordSwing,
    });

    const chestsLayer = this.mapManager.map.getObjectLayer('chests');
    const ghostLayer = this.mapManager.map.getObjectLayer('ghosts');
    const lightLayer = this.mapManager.map.getObjectLayer('lights');
    const spikeLayer = this.mapManager.map.getObjectLayer('spikes');

    chestsLayer.objects.forEach((chest) => {
      chests.get(chest.x, chest.y! - chest.height! * 0.5, 'chest').setPipeline('Light2D');
    });

    spikeLayer.objects.forEach((spike) => {
      groundSpikes.get(spike.x! + spike.width! * 0.5, spike.y! - spike.height! * 0.5, 'chest');
    });

    this.monsters = this.physics.add.group({
      classType: Ghost,
      createCallback: (go) => {
        const ghostGo = go as Ghost;
        ghostGo.body.onCollide = true;
      },
    });

    ghostLayer.objects.forEach((ghost) => {
      this.monsters.get(ghost.x, ghost.y, 'ghost').setPipeline('Light2D');
    });

    this.arrows = this.physics.add.group({
      classType: Arrow,
    });

    this.torchLights = this.physics.add.staticGroup({
      classType: TorchLight,
    });

    this.player = this.add.player(400, 300, 'dwarf').setPipeline('Light2D');
    this.player.setArrows(this.arrows);
    this.player.setSwordSwings(swordSwings);
    this.physics.add.collider(this.player, this.mapManager.colliderLayer);
    this.physics.add.collider(this.monsters, this.mapManager.colliderLayer);

    this.physics.add.collider(swordSwings, this.monsters, () => {
      console.log('SLASHED');
    });

    this.physics.add.collider(
      this.player,
      chests,
      this.handlePlayerChestCollision,
      undefined,
      this,
    );

    this.physics.add.overlap(
      this.player,
      groundSpikes,
      this.handlePlayerSpikeCollision,
      undefined,
      this,
    );

    this.physics.add.collider(
      this.arrows,
      this.mapManager.colliderLayer,
      this.handleArrowsWallCollision,
      undefined,
      this,
    );

    this.playerGhostCollider = this.physics.add.collider(
      this.monsters,
      this.player,
      this.handlePLayerMonsterCollision,
      undefined,
      this,
    );

    this.physics.add.collider(
      this.arrows,
      this.monsters,
      this.handleArrowsMonsterCollision,
      undefined,
      this,
    );

    this.physics.add.collider(
      this.player,
      this.torchLights,
    );

    this.cameras.main.startFollow(this.player, true);

    this.cameras.main.setZoom(1);

    this.lights.enable();

    lightLayer.objects.forEach((light) => {
      this.torchLights.get(light.x! + light.width! * 0.5, light.y! - light.height! * 0.5, 'lights');
    });

    this.smallLens = this.add.circle(400, 400, 4, 0xffffff, 0.3).setDepth(2);

    this.bigLens = this.add.circle(400, 300, 8, 0xffffff, 0.4).setDepth(2);

    this.sound.volume = 0.1;
  }

  update(time: number, delta: number) {
    const pointer = this.input.mousePointer;

    if (this.player) {
      this.player.update(this.keys, pointer);

      const dx = pointer.worldX - this.player.x;
      const dy = pointer.worldY - this.player.y;

      const baseVector = new Phaser.Math.Vector2(dx, dy).normalize().scale(50);
      const direction = new Phaser.Math.Vector2(dx, dy).add(baseVector).limit(200);

      this.smallLens.x = this.player.x + direction.x / 1.5;
      this.smallLens.y = this.player.y + direction.y / 1.5;

      this.bigLens.x = this.player.x + direction.x;
      this.bigLens.y = this.player.y + direction.y;
    }
  }

  private handlePlayerSpikeCollision(
    obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    const spike = obj2 as GroundSpike;

    if (spike.isUp()) {
      const dx = this.player.x - spike.x;
      const dy = this.player.y - spike.y;

      const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(300);

      this.player.handleDamage(dir);
      sceneEvents.emit(PLAYER_HEALTH_CHANGED, this.player.health);
    }
  }

  private handlePlayerChestCollision(
    obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    const chest = obj2 as Chest;
    this.player.setActiveChest(chest);
  }

  private handleArrowsWallCollision(
    obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    const arrow = obj1 as Phaser.Physics.Arcade.Image;
    arrow.setVelocity(0);

    this.arrows.kill(arrow);
  }

  private handleArrowsMonsterCollision(
    obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    this.arrows.killAndHide(obj1);
    this.monsters.killAndHide(obj2);
    obj2.destroy();
    this.sound.get('monster').play();
  }

  private handlePLayerMonsterCollision(
    obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    const monster = obj2 as Ghost;
    const dx = this.player.x - monster.x;
    const dy = this.player.y - monster.y;

    const dir = new Phaser.Math.Vector2(dx, dy).normalize().scale(200);

    this.player.handleDamage(dir);

    sceneEvents.emit(PLAYER_HEALTH_CHANGED, this.player.health);

    if (this.player.health <= 0) this.playerGhostCollider?.destroy();
  }
}

export default GameScene;
