export interface PlayerData {
  texture: string;
  anims: string;
}

export const ElfPlayer = {
  texture: 'character_1',
  anims: 'elf',
};

export const MountainDwellerPlayer = {
  texture: 'character_1',
  anims: 'mountain_dweller',
};

export const ForesterPlayer = {
  texture: 'character_3',
  anims: 'forester',
};

export const WarriorPlayer = {
  texture: 'character_2',
  anims: 'warrior',
};

export const SorcererPlayer = {
  texture: 'character_2',
  anims: 'sorcerer',
};

export interface BokoblinData {
  health: number,
  detection: {
    target: number,
    hit: number,
  },
  speed: number,
  cooldown: number;
}

export const BokoblinSwordman = {
  health: 4,
  detection: {
    target: 250,
    hit: 90,
  },
  speed: 150,
  cooldown: 750,
};

export const BokoblinBowman = {
  health: 3,
  detection: {
    target: 350,
    hit: 330,
  },
  speed: 80,
  cooldown: 1250,
};
