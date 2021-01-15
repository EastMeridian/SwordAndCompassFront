export enum Attribute {
  strength = 'strength',
  constitution = 'constitution',
  intelligence = 'intelligence',
  willpower = 'willpower',
  speed = 'speed',
}

export interface Attributes {
  [Attribute.strength]: number;
  [Attribute.constitution]: number;
  [Attribute.intelligence]: number;
  [Attribute.willpower]: number;
  [Attribute.speed]: number;
}
