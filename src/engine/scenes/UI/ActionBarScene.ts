import Phaser from 'phaser';
import SoundManager from 'src/engine/system/SoundManager';

interface Shortcut {
  key: string;
  action: string;
}

const shortcutList: Shortcut[] = [
  { key: 'z', action: 'Move forward' },
  { key: 'q', action: 'Move left' },
  { key: 's', action: 'Move backward' },
  { key: 'd', action: 'Move right' },

  { key: 'a', action: 'Change spell' },
  { key: 'e', action: 'Interact' },
  { key: 'space', action: 'Jump' },
  { key: 'mouse_button_left', action: 'Fire spell' },
];

class ActionBarScene extends Phaser.Scene {
  menuItems: Phaser.GameObjects.Text[] = [];

  constructor() {
    super({ key: 'ui-actionbar' });
  }

  create() {
    const { width, height } = this.cameras.main;
    let overlayToggled = false;
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0, 0).setAlpha(0);

    this.add.actionButton(
      width - 24,
      24,
      'gear',
      {
        onPointerDown: () => {
          if (!overlayToggled) {
            overlay.setInteractive();
            this.tweens.add({
              targets: overlay,
              duration: 200,
              alpha: 0.85,
            });

            this.menuItems = [
              this.add.text(
                width / 2 - 128,
                136,
                'Shortcut',
                {
                  fontFamily: 'minecraft',
                  fontSize: '32px',
                },
              ),
              ...shortcutList.flatMap((shortcut, index) => this.createShortcutRow(
                shortcut, width / 2, 192 + index * 48,
              )),
            ];
          } else {
            overlay.removeInteractive();
            this.tweens.add({
              targets: overlay,
              duration: 200,
              alpha: 0,
            });

            this.menuItems.map((item) => item.destroy());
          }
          overlayToggled = !overlayToggled;
        },
      },
    );

    this.add.actionButton(width - 64, 24, 'switch-to-full-screen', {
      onPointerDown: () => {
        if (this.scale.isFullscreen) {
          this.scale.stopFullscreen();
        } else {
          this.scale.startFullscreen();
        }
      },
    });

    const volumeButton = this.add.actionButton(
      width - 104,
      24,
      SoundManager.isMuted() ? 'mute' : 'volume',
      {
        onPointerDown: () => {
          if (SoundManager.toggle()) {
            volumeButton.setTexture('mute');
          } else {
            volumeButton.setTexture('volume');
          }
        },
      },
    );

    this.input.topOnly = false;
    this.input.on('gameobjectover', (pointer: any, gameObject: any) => {
      gameObject.setAlpha(1);
    });

    this.input.on('gameobjectout', (pointer: any, gameObject: any) => {
      gameObject.setAlpha(0.7);
    });
  }

  private createShortcutRow({ key, action }: Shortcut, x: number, y: number) {
    return [
      this.add.text(
        x - 128,
        y,
        `${action}: `,
        {
          fontFamily: 'minecraft',
          fontSize: '28px',
        },
      ),
      this.add.text(
        x + 128,
        y,
        key,
        {
          fontFamily: 'minecraft',
          fontSize: '28px',
        },
      ).setAlpha(0.7),
    ];
  }
}

export default ActionBarScene;
