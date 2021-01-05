import Phaser from 'phaser';
import { sceneEvents } from 'src/engine/events/EventCenter';
import { PLAYER_HEALTH_CHANGED, PLAYER_COINS_CHANGED, PLAYER_ENERGY_CHANGED } from 'src/engine/events/events';

const GREY = 0xecf0f1;

class GameUIScene extends Phaser.Scene {
  private healthGauge!: Phaser.GameObjects.Rectangle;

  private energyGauge!: Phaser.GameObjects.Rectangle;

  constructor() {
    super({ key: 'game-ui' });
  }

  create() {
    const coinsLabel = this.add.text(16, 64, '0');

    this.add.rectangle(16, 16, 148, 8, GREY).setOrigin(0, 0);

    this.healthGauge = this.add.rectangle(16, 16, 148, 8, 0xc0392b).setOrigin(0, 0);

    this.add.rectangle(16, 30, 148, 8, GREY).setOrigin(0, 0);

    this.energyGauge = this.add.rectangle(16, 30, 148, 8, 0x27ae60).setOrigin(0, 0);

    sceneEvents.on(PLAYER_HEALTH_CHANGED, this.handlePlayerHealthChange, this);

    sceneEvents.on(PLAYER_ENERGY_CHANGED, this.handlePlayerEnergyChange, this);

    sceneEvents.on(PLAYER_COINS_CHANGED, (coins: number) => {
      coinsLabel.text = coins.toString();
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(PLAYER_HEALTH_CHANGED, this.handlePlayerHealthChange, this);
      sceneEvents.off(PLAYER_COINS_CHANGED);
      sceneEvents.off(PLAYER_ENERGY_CHANGED);
    });
  }

  private handlePlayerHealthChange(health: number) {
    this.tweens.add({
      targets: this.healthGauge,
      scaleX: (health / 5) || 0,
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
}

export default GameUIScene;
