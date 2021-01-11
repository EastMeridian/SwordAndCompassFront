import Phaser from 'phaser';
import Character from 'src/engine/entities/characters/Character';
import { Skill } from 'src/engine/components/skills/Skill';
import { SkillData } from './skills/SkillData';
import { InventoryComponent } from './InventoryComponent';

export default class SkillsComponent {
  private owner: Character;

  private skills: Record<string, Skill>;

  public current?: string;

  private references: string[];

  private index: number;

  private onChange?: (data: SkillData) => void;

  constructor(
    owner: Character,
    onChange?: (data: SkillData) => void,
  ) {
    this.owner = owner;
    this.skills = {};
    this.references = [];
    this.index = 0;
    this.onChange = onChange;
  }

  getCurrentData() {
    if (this.current) {
      return this.skills[this.current].data;
    }
    return {};
  }

  add(name: string, skill: Skill) {
    this.skills[name] = skill;
    this.references.push(name);
    this.index++;
    this.current = name;
    return this;
  }

  use(name: string, direction: Phaser.Math.Vector2, onComplete: () => void) {
    if (!this.skills[name]) return;
    if (!this.current) this.current = name;
    this.useCurrent(direction, onComplete);
  }

  useCurrent(direction: Phaser.Math.Vector2, onComplete: () => void) {
    if (this.current) {
      this.skills[this.current].use(direction, this.owner, onComplete);
    } else {
      this.setNext();
    }
  }

  setCurrent(name: string) {
    this.current = name;
    this.index = this.references.findIndex((ref) => ref === name);
    this.onChange?.(this.skills[this.current].data);
  }

  setNext() {
    this.index += 1;
    if (this.index > this.references.length - 1) {
      this.index = 0;
    }

    this.current = this.references[this.index];
    this.onChange?.(this.skills[this.current].data);
  }

  update() {
    if (this.current) {
      this.skills[this.current].update?.(this.owner);
    }
  }
}
