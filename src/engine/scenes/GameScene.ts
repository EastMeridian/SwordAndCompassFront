/* eslint-disable import/no-duplicates */
import Phaser from 'phaser';
import MapManager from 'src/engine/system/MapManager';
import Ghost from 'src/engine/entities/characters/PrimitiveAnimal/PrimitiveAnimal';
import 'src/engine/entities/characters/Player/Player';
import Player from 'src/engine/entities/characters/Player/Player';
import Chest from 'src/engine/entities/objects/Chest';
import GroundSpikes from 'src/engine/entities/objects/GroundSpike';
import TorchLight from 'src/engine/entities/objects/TorchLight';
import Arrow from 'src/engine/entities/spells/Arrow';
import { createForesterAnimation } from 'src/engine/animations/createPlayerAnimation';
import {
  createBatAnimation,
  createBokoblinAnimation,
  createGhostAnimation,
  createOgreAnimations,
  createScorpionAnimation,
  createSkeletonAnimation,
  createSpiderAnimation,
} from 'src/engine/animations/createMonsterAnimation';
import { createBonfireAnimation, createChestAnimation } from 'src/engine/animations/createInteractivesAnimation';
import { createGroundSpikeAnimation } from 'src/engine/animations/createGroundSpikeAnimation';
import { createTorchLightAnimation } from 'src/engine/animations/createTorchLightAnimation';
import { createweaponAnimation } from 'src/engine/animations/createWeaponAnimation';
import { sceneEvents } from 'src/engine/events/EventCenter';
import { PLAYER_DEAD, PLAYER_GET_MESSAGE } from 'src/engine/events/events';
import GroundSpike from 'src/engine/entities/objects/GroundSpike';
import SwordSwing from 'src/engine/entities/spells/SwordSwing';
import Bokoblin from 'src/engine/entities/characters/Bokoblin/Bokoblin';
import DetectionCircle from 'src/engine/entities/others/DetectionCircle';
import { correctTiledPointX, correctTiledPointY } from 'src/utils/misc';
import { getOverlapPercentage } from 'src/utils/Collisions';
import { createMonster, createMonsters, Monsters } from 'src/engine/system/factories/Monster/createMonster';
import { DEPTH_MAX, DEPTH_POINTER, PIPELINE } from 'src/constants';
import { createBalloonAnimation } from '../animations/createBalloonAnimation';
import Character from '../entities/characters/Character';
import Skeleton from '../entities/characters/Skeleton/Skeleton';
import WeaponSkill from '../components/skills/WeaponSkill';
import ArrowSkill from '../components/skills/ArrowSkill';
import { createRecoveryAnimation } from '../animations/createSpellAnimation';
import HealSkill from '../components/skills/HealSkill';
import { PlayerData } from '../data/entities';
import MusicManager from '../system/MusicManager';
import SoundManager from '../system/SoundManager';
import { createInteractives, Interactives } from '../system/factories/createInteractive';
import Bonfire from '../entities/objects/Bonfire';
import { Interactive } from '../entities/objects/Interactive';
import PNJ from '../entities/objects/PNJ';

class GameScene extends Phaser.Scene {
  private player!: Player;

  private mapManager!: MapManager;

  private keys!: Phaser.Types.Input.Keyboard.CursorKeys | any;

  private arrows!: Phaser.Physics.Arcade.Group;

  public monsters?: Monsters;

  public interactives?: Interactives;

  private torchLights!: Phaser.Physics.Arcade.StaticGroup;

  private smallLens!: Phaser.GameObjects.Arc;

  private bigLens!: Phaser.GameObjects.Arc;

  private playerDead: boolean;

  private playerData!: PlayerData;

  private respawnPosition?: { x: number, y: number };

  public bonfiresLit: string[] = [];

  constructor() {
    super('game');

    this.playerDead = false;
  }

  init(data: PlayerData) {
    this.playerData = data;
    this.player = this.add.player(0, 0, data).setPipeline(PIPELINE);
    this.playerDead = false;
  }

  preload() {
    const {
      Z, Q, S, D, E, A, X, SPACE,
    } = Phaser.Input.Keyboard.KeyCodes;

    this.keys = this.input.keyboard.addKeys({
      up: Z,
      left: Q,
      right: D,
      down: S,
      space: SPACE,
      E,
      A,
      X,
    });
  }

  create() {
    const {
      width, height, worldView,
    } = this.cameras.main;
    SoundManager.setCurrentScene(this);

    this.sound.add('chest', {
      volume: 0.2,
    });
    this.sound.add('skill1', {
      volume: 0.2,
    });
    this.sound.add('bow', {
      volume: 0.2,
    });
    this.sound.add('monster', {
      volume: 0.1,
    });
    this.sound.add('damage2', {
      volume: 0.1,
    });

    this.sound.add('sword', {
      volume: 0.1,
    });

    this.sound.add('heal', {
      volume: 0.2,
    });

    this.sound.add('dongeon_music', {
      volume: 0.5,
    });
    MusicManager.setScene(this);

    createForesterAnimation(this);
    createGhostAnimation(this);
    createBokoblinAnimation(this);
    createChestAnimation(this);
    createTorchLightAnimation(this);
    createGroundSpikeAnimation(this);
    createweaponAnimation(this);
    createBalloonAnimation(this);
    createSkeletonAnimation(this);
    createRecoveryAnimation(this);
    createOgreAnimations(this);
    createBatAnimation(this);
    createScorpionAnimation(this);
    createSpiderAnimation(this);
    createBonfireAnimation(this);

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

    const groundSpikes = this.physics.add.staticGroup({
      classType: GroundSpikes,
    });

    const swordSwings = this.physics.add.group({
      classType: SwordSwing,
    });

    const holesObjects = this.physics.add.staticGroup({
      classType: Phaser.GameObjects.Rectangle,
    });

    const interactivesLayer = this.mapManager.map.getObjectLayer('interactives');
    const monstersLayer = this.mapManager.map.getObjectLayer('monsters');
    const lightLayer = this.mapManager.map.getObjectLayer('lights');
    const spikeLayer = this.mapManager.map.getObjectLayer('spikes');
    const holesLayer = this.mapManager.map.getObjectLayer('holes');
    const startPosition = this.mapManager.map.getObjectLayer('start');

    holesLayer.objects.forEach((hole) => {
      if (hole) {
        const rectangle = this.add.rectangle(
          hole.x! + hole.width! * 0.5,
          hole.y! + hole.height! * 0.5,
          hole.width, hole.height,
        );
        rectangle.body = new Phaser.Physics.Arcade.StaticBody(this.physics.world, rectangle);
        holesObjects.add(this.physics.add.existing(rectangle));
      }
    });

    spikeLayer.objects.forEach((spike) => {
      groundSpikes.get(correctTiledPointX(spike), correctTiledPointY(spike), 'chest');
    });

    this.monsters = createMonsters(monstersLayer.objects, this);
    this.interactives = createInteractives(interactivesLayer.objects, this);

    this.arrows = this.physics.add.group({
      classType: Arrow,
    });

    this.torchLights = this.physics.add.staticGroup({
      classType: TorchLight,
      createCallback: (obj) => {
        const torch = obj as TorchLight;
        torch.setSize(28, 24);
      },
    });

    if (this.playerData.respawn) {
      this.respawnPosition = {
        x: this.playerData.respawn.x,
        y: this.playerData.respawn.y,
      };
    } else {
      this.respawnPosition = {
        x: (startPosition.objects[0].x || 0) - 24,
        y: (startPosition.objects[0].y || 0) + 24,
      };
    }

    this.player
      .setPosition(this.respawnPosition.x, this.respawnPosition.y)
      .setSize(30, 32)
      .setMass(0.1)
      .skills
      .add('arrow', new ArrowSkill(this.arrows))
      .add('heal', new HealSkill(this))
      .add('weapon', new WeaponSkill(swordSwings));

    this.physics.add.collider([this.player], this.mapManager.colliderLayer);

    const monsters = [
      this.monsters.primitiveAnimals,
      this.monsters.skeletons,
      this.monsters.bokoblins,
      this.monsters.ogres,
    ];

    this.physics.add.collider([
      this.monsters.skeletons,
      this.monsters.bokoblins,
      this.monsters.ogres,
    ], holesObjects);

    this.physics.add.overlap(
      this.player,
      holesObjects,
      this.handlePlayerHoleCollision,
      undefined,
      this,
    );

    this.physics.add.overlap(
      this.player,
      this.monsters.detectionCircles!,
      this.handlePlayerDetectionCollison,
      undefined,
      this,
    );

    this.physics.add.collider(monsters, this.mapManager.colliderLayer);

    this.physics.add.overlap(
      swordSwings,
      monsters,
      this.handleSwordMonsterCollision,
      undefined,
      this,
    );

    this.physics.add.overlap(
      this.monsters.swordSwings,
      this.player,
      this.handleSwordPlayerCollision,
      undefined,
      this,
    );

    this.physics.add.collider(
      this.player,
      this.interactives.chests,
      this.handlePlayerInteractiveCollision,
      undefined,
      this,
    );

    this.physics.add.collider(
      this.player,
      this.interactives.staticPNJs,
      this.handlePlayerInteractiveCollision,
      undefined,
      this,
    );

    this.physics.add.collider(
      this.player,
      this.interactives.bonfires,
      this.handlePlayerBonfireCollision,
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
      [this.arrows, this.monsters.arrows],
      this.mapManager.colliderLayer,
      this.handleArrowsWallCollision,
      undefined,
      this,
    );

    this.physics.add.collider(
      monsters,
      this.player,
      this.handlePlayerMonsterCollision,
      undefined,
      this,
    );

    this.physics.add.overlap(
      this.player,
      this.monsters.arrows,
      this.handleArrowsCollision,
      undefined,
      this,
    );

    this.physics.add.overlap(
      monsters,
      this.arrows,
      this.handleArrowsCollision,
      undefined,
      this,
    );

    this.physics.add.collider(
      this.player,
      this.torchLights,
    );

    this.cameras.main.startFollow(this.player, true, 0.5, 0.5);

    this.cameras.main.setZoom(1.2);

    this.lights.enable();

    lightLayer.objects.forEach((light) => {
      this.torchLights.get(light.x! + light.width! * 0.5, light.y! - light.height! * 0.5, 'lights');
    });

    this.smallLens = this.add.circle(400, 400, 4, 0xffffff, 0.3).setDepth(DEPTH_POINTER);

    this.bigLens = this.add.circle(400, 300, 8, 0xffffff, 0.4).setDepth(DEPTH_POINTER);

    MusicManager.play('dongeon_music');
    MusicManager.fadeIn(500);
    this.cameras.main.fadeIn(1500);

    this.scene.run('game-ui', this.player);

    sceneEvents.on(PLAYER_DEAD, () => {
      this.cameras.main.shake(300, 0.01);
      this.player.setDepth(DEPTH_MAX).resetPipeline();
      const rectangle = this.add
        .rectangle(worldView.centerX, worldView.centerY, width, height, 0x000000)
        .setDepth(DEPTH_MAX - 1)
        .setAlpha(0);
      this.scene.stop('game-ui');
      this.tweens.add({
        targets: rectangle,
        alpha: 1,
        duration: 1250,
        ease: Phaser.Math.Easing.Linear,
        onComplete: () => {
          this.cameras.main.fadeOut(1000);
          this.time.delayedCall(1000, () => {
            this.playerDead = true;
          });
        },
      });
    });
  }

  update(time: number, delta: number) {
    if (this.playerDead) {
      this.scene.restart(this.playerData);
      return;
    }
    const pointer = this.input.activePointer;
    if (this.player) {
      this.player.update(this.keys);

      if (!this.player.health.isDead()) {
        this.input.activePointer.updateWorldPoint(this.cameras.main);
        const dx = pointer.worldX - this.player.x;
        const dy = pointer.worldY - this.player.y;

        const baseVector = new Phaser.Math.Vector2(dx, dy).normalize().scale(50);
        const direction = new Phaser.Math.Vector2(dx, dy).add(baseVector).limit(200);

        this.smallLens.x = this.player.x + direction.x / 1.5;
        this.smallLens.y = this.player.y + direction.y / 1.5;

        this.bigLens.x = this.player.x + direction.x;
        this.bigLens.y = this.player.y + direction.y;
      } else {
        this.smallLens.setAlpha(0);
        this.bigLens.setAlpha(0);
      }
    }
  }

  private handlePlayerHoleCollision(
    _: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    const hole = obj2 as Phaser.GameObjects.Rectangle;
    if (!this.player.isJumping()) {
      const overlapRatio = getOverlapPercentage(
        this.player.getTopLeft(),
        this.player.getBottomRight(),
        hole.getTopLeft(),
        hole.getBottomRight(),
      );

      if (overlapRatio < 0.9) {
        const holeCenter = hole.getCenter();
        const dx = holeCenter.x - this.player.x;
        const dy = holeCenter.y - this.player.y;
        const slipVector = new Phaser.Math.Vector2(dx, dy)
          .normalize()
          .scale(20 + overlapRatio * 250);

        this.player.body.velocity.x += slipVector.x;
        this.player.body.velocity.y += slipVector.y;
      } else if (!this.player.isFalling()) {
        this.player.setVelocity(0);
        this.player.setFalling(true);
      }
    }
  }

  private handlePlayerDetectionCollison = (
    _: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) => {
    const circle = obj2 as DetectionCircle;

    circle.onDetect(this.player);
  }

  private handlePlayerSpikeCollision(
    _: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    const spike = obj2 as GroundSpike;

    if (spike.isUp()) {
      const dx = this.player.x - spike.x;
      const dy = this.player.y - spike.y;

      const direction = new Phaser.Math.Vector2(dx, dy).normalize().scale(500);

      this.player.health.handleDamage({
        amount: 100,
        direction,
      });
    }
  }

  private handlePlayerInteractiveCollision(
    _: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    const chest = obj2 as Chest;
    console.log('interactive collision', chest);
    this.player.setActiveInteractive(chest);
  }

  private handlePlayerBonfireCollision(
    _: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    const bonfire = obj2 as Bonfire;
    if (!bonfire.activated) {
      this.player.setActiveInteractive(bonfire);
      this.playerData.respawn = {
        x: bonfire.x,
        y: bonfire.y - 32,
      };
      if (!this.bonfiresLit.includes(bonfire.location)) this.bonfiresLit.push(bonfire.location);
    }
  }

  private handleArrowsWallCollision(
    obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    const arrow = obj1 as Arrow;
    arrow.setVelocity(0);
    arrow.setOperating(false);

    this.time.delayedCall(1000, () => {
      arrow.setActive(false);
    });
  }

  private handleSwordMonsterCollision(
    _: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    const monster = obj2 as Character;
    if (monster.health.isDamageable()) {
      this.sound.get('monster').play();
      const dx = monster.x - this.player.x;
      const dy = monster.y - this.player.y;

      const direction = new Phaser.Math.Vector2(dx, dy).normalize().scale(300);
      monster.health.handleDamage({
        amount: 100 + this.player.attributes.strength * 2,
        direction,
      });
    }
  }

  private handleSwordPlayerCollision(
    sword: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    this.sound.get('monster').play();

    const dx = sword.body.x - this.player.x;
    const dy = sword.body.y - this.player.y;

    const direction = new Phaser.Math.Vector2(dx, dy).normalize().scale(300);
    this.player.health.handleDamage({
      amount: 200,
      direction,
    });
  }

  private handleArrowsCollision(
    obj1: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    const arrow = obj2 as Arrow;
    const character = obj1 as Character;

    if (arrow.isOperating()) {
      const dx = character.x - arrow.x;
      const dy = character.y - arrow.y;

      const direction = new Phaser.Math.Vector2(dx, dy).normalize().scale(300);
      character.health.handleDamage({
        amount: arrow.damage,
        direction,
      });

      this.time.delayedCall(1000, () => {
        this.arrows.kill(arrow);
      });

      const bokoblin = character as Bokoblin;
      bokoblin.detectPlayer?.(this.player);
    }
  }

  private handlePlayerMonsterCollision(
    _: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    obj2: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  ) {
    const monster = obj2 as Character;
    if (this.player.health.isDamageable()) {
      this.sound.get('damage2').play();
      const dx = this.player.x - monster.x;
      const dy = this.player.y - monster.y;
      const direction = new Phaser.Math.Vector2(dx, dy).normalize().scale(300);
      const magnetude = monster.body.velocity.length();
      const snaped = Math.max(Phaser.Math.Snap.To((magnetude / 150), 1), 1);
      this.player.health.handleDamage({
        amount: snaped * 100,
        direction,
      });
    }
  }
}

export default GameScene;
