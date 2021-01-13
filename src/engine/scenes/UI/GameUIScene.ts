import Phaser from 'phaser';
import { SkillData } from 'src/engine/components/skills/SkillData';
import { Stackable } from 'src/engine/components/Stackable';
import Player from 'src/engine/entities/characters/Player';
import { sceneEvents } from 'src/engine/events/EventCenter';
import {
  PLAYER_HEALTH_CHANGED,
  PLAYER_COINS_CHANGED,
  PLAYER_ENERGY_CHANGED,
  PLAYER_CHANGED_SPELL,
  PLAYER_STACKABLE_CHANGED,
} from 'src/engine/events/events';
import { Colors } from 'src/styles/Theme';
import { Direction } from 'src/utils/Direction';

interface InitializationOptions {
  player: Player;
  stackables: Stackable[];
}

const lifeSection = 4;

class GameUIScene extends Phaser.Scene {
  private healthGauge!: Phaser.GameObjects.Rectangle;

  private energyGauge!: Phaser.GameObjects.Rectangle;

  private spellIcon?: Phaser.GameObjects.Sprite;

  private stackables?: Stackable[];

  private player!: Player;

  private profileContainer!: Phaser.GameObjects.Container;

  private stackableRows: Record<string, {
    text: Phaser.GameObjects.Text;
    sprite: Phaser.GameObjects.Sprite;
  }> = {};

  constructor() {
    super({ key: 'game-ui' });
  }

  init(player: Player) {
    const { height } = this.cameras.main;
    this.player = player;
    this.add.rectangle(48, height - 48, 64, 64, 0x000000, 0.7).setOrigin(0.5, 0.5);

    this.spellIcon = this.add.sprite(48, height - 48, 'icons');
    this.createSpellIcon(player.skills.getCurrentData());

    const startPosition = { x: 16, y: 72 };

    this.stackableRows = player.inventory.list().reduce((acc, next, index) => ({
      ...acc,
      [next.name]: {

        sprite: this.add.sprite(
          startPosition.x,
          startPosition.y + index * 32,
          'icons', next.frame,
        ).setOrigin(0, 0.5).setScale(0.75),

        text: this.add.text(
          startPosition.x + 48,
          startPosition.y + index * 32,
          next.amount.toString(),
          {
            fontSize: '20px',
          },
        ).setOrigin(0, 0.5),

      },
    }), {});
  }

  create() {
    // UI
    const { width, height } = this.cameras.main;
    let overlayToggled = false;

    this.add.rectangle(16, 16, 148, 8, Colors.grey).setOrigin(0, 0);

    this.healthGauge = this.add.rectangle(16, 16, 148, 8, Colors.redLife).setOrigin(0, 0);

    this.add.rectangle(16, 30, 148, 8, Colors.grey).setOrigin(0, 0);

    this.energyGauge = this.add.rectangle(16, 30, 148, 8, Colors.greenEnergy).setOrigin(0, 0);

    const overlay = this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0, 0).setAlpha(0);

    this.add.rectangle(width - 48, height - 48, 64, 64, 0x000000, 0.75).setOrigin(0.5, 0.5);

    const button = this.add.image(width - 48, height - 48, 'icons_2', 164)
      .setScale(32 / 24)
      .setInteractive();

    button.on('pointerdown', () => {
      button.setScale(1);
      if (!overlayToggled) {
        this.scene.pause('game');
        overlay.setInteractive();
        this.tweens.add({
          targets: overlay,
          duration: 200,
          alpha: 0.85,
        });
        this.createProfile();
      } else {
        this.scene.resume('game');
        overlay.removeInteractive();
        this.tweens.add({
          targets: overlay,
          duration: 200,
          alpha: 0,
        });
        this.profileContainer.destroy();
      }
      overlayToggled = !overlayToggled;
    });

    button.on('pointerout', () => {
      button.setScale(32 / 24);
    });
    button.on('pointerup', () => {
      button.setScale(32 / 24);
    });

    // EVENTS
    sceneEvents.on(PLAYER_HEALTH_CHANGED, this.handlePlayerHealthChange, this);

    sceneEvents.on(PLAYER_ENERGY_CHANGED, this.handlePlayerEnergyChange, this);

    sceneEvents.on(PLAYER_STACKABLE_CHANGED, this.updateStackableRow, this);

    sceneEvents.on(PLAYER_CHANGED_SPELL, this.createSpellIcon, this);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(PLAYER_HEALTH_CHANGED, this.handlePlayerHealthChange, this);
      sceneEvents.off(PLAYER_COINS_CHANGED);
      sceneEvents.off(PLAYER_ENERGY_CHANGED);
      sceneEvents.off(PLAYER_CHANGED_SPELL);
    });
  }

  private createSpellIcon({
    frame = 0,
    texture = 'icons',
  }: SkillData) {
    this.spellIcon?.setTexture(texture).setFrame(frame);
  }

  private handlePlayerHealthChange({ health, maximum }: { health: number, maximum: number }) {
    this.tweens.add({
      targets: this.healthGauge,
      scaleX: health / maximum,
      duration: 250,
      ease: 'Sine.eastIn',
    });
  }

  private handlePlayerEnergyChange(energy: number) {
    this.tweens.add({
      targets: this.energyGauge,
      scaleX: (energy / 100) || 0,
      duration: 500,
      ease: 'Linear',
    });
  }

  private updateStackableRow(stackable: Stackable) {
    this.stackableRows[stackable.name].text.text = stackable.amount.toString();
  }

  private createProfile() {
    const character = this.add.sprite(136, 136, this.player.texture)
      .play(`${this.player.entity.anims}_idle_${Direction.DOWN}`)
      .setScale(4);
    const name = this.add.text(136 + 128, 136, this.player.entity.name, {
      fontFamily: 'minecraft',
      fontSize: '64px',
    });
    this.profileContainer = this.add.container(0, 0, [character, name]);
  }
}

export default GameUIScene;
