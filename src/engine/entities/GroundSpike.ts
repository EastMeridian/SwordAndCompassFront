import Phaser from 'phaser';

class GroundSpike extends Phaser.Physics.Arcade.Sprite {
  private upEvent: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this.play('spike_up').on('animationcomplete', () => {
      if (this.isUp()) {
        this.play('spike_down');
      }
    }, this);

    this.upEvent = scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.play('spike_up');
      },
      loop: true,
    });

    this.setScale(1.2);
  }

  isUp() {
    return this.anims.currentAnim.key === 'spike_up';
  }

  destroy() {
    this.upEvent.destroy();

    super.destroy();
  }
}

export default GroundSpike;
