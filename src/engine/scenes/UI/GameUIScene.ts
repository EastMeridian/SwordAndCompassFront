import Phaser from 'phaser';
import { Attribute } from 'src/engine/components/Attributes';
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
  PLAYER_LEVEL_CHANGED,
  PLAYER_GET_MESSAGE,
} from 'src/engine/events/events';
import { Colors } from 'src/styles/Theme';
import { Direction } from 'src/utils/Direction';
import { DataRow } from './UIComponents/DataRow';
import { Gauge } from './UIComponents/Gauge';

class GameUIScene extends Phaser.Scene {
  private healthGauge!: Gauge;

  private energyGauge!: Gauge;

  private spellIcon?: Phaser.GameObjects.Sprite;

  private stackables?: Stackable[];

  private player!: Player;

  private profileContainer: Record<string,
  Phaser.GameObjects.GameObject | DataRow
  > = {};

  private stackableRows: Record<string, {
    text: Phaser.GameObjects.Text;
    sprite: Phaser.GameObjects.Sprite;
  }> = {};

  private chipContainer?: Phaser.GameObjects.Arc;

  private chipText?: Phaser.GameObjects.Text;

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

    this.healthGauge = this.add.gauge(16, 16, Colors.redLife);

    this.energyGauge = this.add.gauge(16, 30, Colors.greenEnergy);

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
        Object.entries(this.profileContainer).forEach(([key, item]) => item.destroy());
      }
      overlayToggled = !overlayToggled;
    });

    button.on('pointerout', () => {
      button.setScale(32 / 24);
    });
    button.on('pointerup', () => {
      button.setScale(32 / 24);
    });

    this.createChip();

    const messageContainer = this.add.rectangle(width / 2, height - 160, 768, 256, 0x000000)
      .setAlpha(0);
    // EVENTS
    sceneEvents.on(PLAYER_HEALTH_CHANGED, this.handlePlayerHealthChange, this);

    sceneEvents.on(PLAYER_ENERGY_CHANGED, this.handlePlayerEnergyChange, this);

    sceneEvents.on(PLAYER_STACKABLE_CHANGED, this.updateStackableRow, this);

    sceneEvents.on(PLAYER_CHANGED_SPELL, this.createSpellIcon, this);

    sceneEvents.on(PLAYER_LEVEL_CHANGED, this.updateChip, this);

    sceneEvents.on(PLAYER_GET_MESSAGE, (data?: string) => {
      const message = this.add.text(messageContainer.x, messageContainer.y, data || '', {
        fontFamily: 'minecraft',
        fontSize: '28px',
      }).setOrigin(0.5, 0.5).setAlpha(0);
      if (data) {
        console.log(data);

        this.tweens.add({
          targets: message,
          duration: 200,
          alpha: 0.85,
        });
      } else {
        this.tweens.add({
          targets: message,
          duration: 200,
          alpha: 0,
        });
      }
    });

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

  private createChip() {
    const { width, height } = this.cameras.main;
    this.chipContainer = this.add.circle(width - 64, height - 64, 12, Colors.redBlood);
    this.chipText = this.add.text(
      width - 64,
      height - 64,
      this.player.leveling.rewardCount.toString(),
      {
        fontFamily: 'minecraft',
        fontSize: '14px',
      },
    ).setOrigin(0.5, 0.5);
    if (this.player.leveling.rewardCount === 0) {
      this.tweens.add({
        targets: this.chipContainer,
        duration: 150,
        alpha: 0,
        ease: Phaser.Math.Easing.Bounce,
      });
      this.tweens.add({
        targets: this.chipText,
        duration: 150,
        alpha: 0,
        ease: Phaser.Math.Easing.Bounce,
      });
    }
  }

  private updateChip() {
    if (this.player.leveling.rewardCount === 0) {
      this.tweens.add({
        targets: this.chipContainer,
        duration: 150,
        alpha: 0,
        ease: Phaser.Math.Easing.Bounce,
      });
      this.tweens.add({
        targets: this.chipText,
        duration: 150,
        alpha: 0,
        ease: Phaser.Math.Easing.Bounce,
      });
    } else if (this.chipText) {
      this.tweens.add({
        targets: this.chipContainer,
        duration: 150,
        alpha: 1,
        ease: Phaser.Math.Easing.Bounce,
      });
      this.tweens.add({
        targets: this.chipText,
        duration: 150,
        alpha: 1,
        ease: Phaser.Math.Easing.Bounce,
      });
      this.chipText.text = this.player.leveling.rewardCount.toString();
    }
  }

  private handlePlayerHealthChange({ health, maximum }: { health: number, maximum: number }) {
    this.tweens.add({
      targets: this.healthGauge.gauge,
      scaleX: health / maximum,
      duration: 250,
      ease: 'Sine.eastIn',
    });
  }

  private handlePlayerEnergyChange(energy: number) {
    this.tweens.add({
      targets: this.energyGauge.gauge,
      scaleX: (energy / 100) || 0,
      duration: 500,
      ease: 'Linear',
    });
  }

  private updateStackableRow(stackable: Stackable) {
    this.stackableRows[stackable.name].text.text = stackable.amount.toString();
  }

  private createRewards() {
    const { height } = this.cameras.main;
    if (this.player.leveling.rewardCount > 0) {
      this.profileContainer.availableText = this.add.dataRow(218, height - 136, {
        key: 'Available point: ',
        value: this.player.leveling.rewardCount.toString(),
      });
      Object.entries(this.player.attributes).forEach(
        ([key, value], index) => {
          const button = this.add.rectangle(600, 312 + index * 48, 24, 24, Colors.blueExp)
            .setAlpha(0.5)
            .setInteractive();
          const icon = this.add.image(600, 312 + index * 48, 'plus')
            .setAlpha(0.8);

          button.on('pointerdown', () => {
            button.setScale(0.9);
            icon.setScale(0.9);
          });

          button.on('pointerout', () => {
            button.setScale(1);
            icon.setScale(1);
            icon.setAlpha(0.5);
            button.setAlpha(0.5);
          });
          button.on('pointerup', () => {
            button.setScale(1);
            icon.setScale(1);

            this.player.buyAttribute(key as Attribute);
            this.updateRewards();
            this.updateAttributes();
            this.updateChip();
          });

          button.on('pointerover', () => {
            button.setAlpha(1);
            icon.setAlpha(1);
          });

          this.profileContainer[`button${key}`] = button;
          this.profileContainer[`icon${key}`] = icon;
        },
      );
    }
  }

  public updateRewards() {
    if (this.player.leveling.rewardCount === 0) {
      this.profileContainer.availableText.destroy();
      this.profileContainer.availableText.destroy();
      Object.entries(Attribute).forEach(([key]) => {
        this.profileContainer[`button${key}`].destroy();
        this.profileContainer[`icon${key}`].destroy();
      });
    } else {
      const available = this.profileContainer.availableText as DataRow;
      available.value.text = this.player.leveling.rewardCount.toString();
    }
  }

  private updateAttributes() {
    Object.entries(Attribute).forEach(([key]) => {
      const dataRow = this.profileContainer[key] as DataRow;
      dataRow.value.text = this.player.attributes[key as Attribute].toString();
    });
  }

  private createProfile() {
    const { height } = this.cameras.main;
    const character = this.add.sprite(258, 136, this.player.texture)
      .play(`${this.player.entity.anims}_idle_${Direction.DOWN}`)
      .setScale(3.5);
    const name = this.add.text(354, 70, this.player.entity.name, {
      fontFamily: 'minecraft',
      fontSize: '70px',
    });
    const level = this.add.text(354, 122, `Level ${this.player.leveling.currentLevel.index}`, {
      fontFamily: 'minecraft',
      fontSize: '70px',
    }).setAlpha(0.8);

    const experience = this.add.text(218, 232, 'exp', {
      fontFamily: 'minecraft',
      fontSize: '32px',
    }).setAlpha(0.8);

    const experienceGauge = this.add.gauge(
      218 + 96,
      244,
      Colors.blueExp,
      this.player.leveling.getExperienceRatio(),
    );

    const attributes = Object.entries(this.player.attributes).reduce(
      (acc, [key, value], index) => ({
        ...acc,
        [key]: this.add.dataRow(218, 300 + index * 48, { key, value }),
      }), {},
    );

    this.profileContainer = {
      character,
      name,
      level,
      experience,
      expGaugeBG: experienceGauge.background,
      expGauge: experienceGauge.gauge,
      ...attributes,
    };

    this.createRewards();
  }
}

export default GameUIScene;
