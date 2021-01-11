import Phaser from 'phaser';
import { SkillData } from 'src/engine/components/skills/SkillData';
import { Stackable } from 'src/engine/components/Stackable';
import { sceneEvents } from 'src/engine/events/EventCenter';
import {
  PLAYER_HEALTH_CHANGED,
  PLAYER_COINS_CHANGED,
  PLAYER_ENERGY_CHANGED,
  PLAYER_CHANGED_SPELL,
  PLAYER_STACKABLE_CHANGED,
} from 'src/engine/events/events';
import { Colors } from 'src/styles/Theme';

interface InitializationOptions {
  data: SkillData;
  stackables: Stackable[];
}

class GameUIScene extends Phaser.Scene {
  private healthGauge!: Phaser.GameObjects.Rectangle;

  private energyGauge!: Phaser.GameObjects.Rectangle;

  private spellIcon?: Phaser.GameObjects.Sprite;

  private stackables?: Stackable[];

  private stackableRows: Record<string, {
    text: Phaser.GameObjects.Text;
    sprite: Phaser.GameObjects.Sprite;
  }> = {};

  constructor() {
    super({ key: 'game-ui' });
  }

  init({ data, stackables }: InitializationOptions) {
    const { height } = this.cameras.main;
    this.add.circle(64, height - 64, 48, 0x000000, 0.5).setOrigin(0.5, 0.5);

    this.spellIcon = this.add.sprite(64, height - 64, 'weapon_1');
    this.createSpellIcon(data);

    const startPosition = { x: 16, y: 64 };
    this.stackableRows = stackables.reduce((acc, next, index) => ({
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
    const { width, height } = this.cameras.main;

    this.add.rectangle(16, 16, 148, 8, Colors.grey).setOrigin(0, 0);

    this.healthGauge = this.add.rectangle(16, 16, 148, 8, Colors.redLife).setOrigin(0, 0);

    this.add.rectangle(16, 30, 148, 8, Colors.grey).setOrigin(0, 0);

    this.energyGauge = this.add.rectangle(16, 30, 148, 8, Colors.greenEnergy).setOrigin(0, 0);

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
    texture = 'weapon_1',
    originX = 0.72,
    originY = 0.85,
    scale = 1.2,
  }: SkillData) {
    this.spellIcon?.setTexture(texture).setFrame(frame)
      .setScale(scale)
      .setSize(96, 44)
      .setOrigin(originX, originY);
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
}

export default GameUIScene;
