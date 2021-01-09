import Phaser from 'phaser';
import { sceneEvents } from 'src/engine/events/EventCenter';
import { PLAYER_HEALTH_CHANGED, PLAYER_COINS_CHANGED, PLAYER_ENERGY_CHANGED } from 'src/engine/events/events';
import { Colors } from 'src/styles/Theme';

class GameUIScene extends Phaser.Scene {
  private healthGauge!: Phaser.GameObjects.Rectangle;

  private energyGauge!: Phaser.GameObjects.Rectangle;

  constructor() {
    super({ key: 'game-ui' });
  }

  create() {
    const coinsLabel = this.add.text(16, 64, '0');

    this.add.rectangle(16, 16, 148, 8, Colors.grey).setOrigin(0, 0);

    this.healthGauge = this.add.rectangle(16, 16, 148, 8, Colors.redLife).setOrigin(0, 0);

    this.add.rectangle(16, 30, 148, 8, Colors.grey).setOrigin(0, 0);

    this.energyGauge = this.add.rectangle(16, 30, 148, 8, Colors.greenEnergy).setOrigin(0, 0);

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

  private handlePlayerHealthChange({ health, maximum }: {health: number, maximum: number}) {
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
}

export default GameUIScene;
