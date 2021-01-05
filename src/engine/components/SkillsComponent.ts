import Phaser from 'phaser';
import Character from 'src/engine/entities/characters/Character';
import { Skill } from 'src/engine/components/skills/Skill';

export default class SkillsComponent {
  private owner: Character;

  private skills: Record<string, Skill>;

  public current?: string;

  constructor(owner: Character, skills: Record<string, Skill> = {}) {
    this.owner = owner;
    this.skills = skills;
  }

  add(name: string, skill: Skill) {
    this.skills[name] = skill;
    return this;
  }

  use(name: string, direction: Phaser.Math.Vector2, onComplete: () => void) {
    if (!this.skills[name]) return;
    if (!this.current) this.current = name;
    this.skills[this.current].use(direction, this.owner, onComplete);
  }

  setCurrent(name: string) {
    this.current = name;
  }

  update() {
    if (this.current) {
      this.skills[this.current].update?.(this.owner);
    }
  }
}
