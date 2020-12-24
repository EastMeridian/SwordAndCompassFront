import Phaser from 'phaser';
import { sceneEvents } from 'src/engine/events/EventCenter';
import { PLAYER_HEALTH_CHANGED, PLAYER_COINS_CHANGED } from 'src/engine/events/events';

class GameUIScene extends Phaser.Scene {
  private healthGauge!: Phaser.GameObjects.Rectangle;

  private healthGaugeContainer!: Phaser.GameObjects.Rectangle;

  constructor() {
    super({ key: 'game-ui' });
  }

  create() {
    const coinsLabel = this.add.text(16, 48, '0');

    this.healthGaugeContainer = this.add.rectangle(16, 16, 148, 20, 0xeeeeee).setOrigin(0, 0);

    this.healthGauge = this.add.rectangle(16, 16, 148, 20, 0x6666ff).setOrigin(0, 0);

    sceneEvents.on(PLAYER_HEALTH_CHANGED, this.handlePlayerHealthChange, this);

    sceneEvents.on(PLAYER_COINS_CHANGED, (coins: number) => {
      coinsLabel.text = coins.toString();
    });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      sceneEvents.off(PLAYER_HEALTH_CHANGED, this.handlePlayerHealthChange, this);
      sceneEvents.off(PLAYER_COINS_CHANGED);
    });
  }

  private handlePlayerHealthChange(health: number) {
    this.tweens.add({
      targets: this.healthGauge,
      scaleX: (health / 3) || 0,
      duration: 250,
      ease: 'Sine.eastIn',
    });
  }
}

export default GameUIScene;
