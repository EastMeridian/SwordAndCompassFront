import { Attributes } from '../components/Attributes';

export interface PlayerData {
  texture: string;
  anims: string;
  health: number;
  name: string;
  attributes: Attributes;
}

export const ElfPlayer = {
  texture: 'character_1',
  anims: 'elf',
  name: 'Elf',
  health: 500,
  attributes: {
    strength: 15,
    constitution: 12,
    speed: 200,
  },
} as PlayerData;

export const MountainDwellerPlayer = {
  texture: 'character_1',
  anims: 'mountain_dweller',
  name: 'Mountain Dweller',
  health: 500,
  attributes: {
    strength: 12,
    constitution: 12,
    speed: 200,
  },
} as PlayerData;

export const ForesterPlayer = {
  texture: 'character_3',
  anims: 'forester',
  name: 'Forester',
  health: 500,
  attributes: {
    strength: 12,
    constitution: 12,
    speed: 225,
  },
} as PlayerData;

export const WarriorPlayer = {
  texture: 'character_2',
  anims: 'warrior',
  name: 'Warrior',
  health: 500,
  attributes: {
    strength: 12,
    constitution: 12,
    speed: 200,
  },
} as PlayerData;

export const SorcererPlayer = {
  texture: 'character_2',
  anims: 'sorcerer',
  name: 'Sorcerer',
  health: 500,
  attributes: {
    strength: 15,
    constitution: 12,
    speed: 200,
  },
} as PlayerData;

export interface EnemyData {
  experience: number;
}

export interface BokoblinData extends EnemyData {
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
  experience: 200,
};

export const BokoblinBowman = {
  health: 3,
  detection: {
    target: 350,
    hit: 330,
  },
  speed: 80,
  cooldown: 1250,
  experience: 200,
};
