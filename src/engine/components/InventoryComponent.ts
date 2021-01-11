import { Stackable } from './Stackable';

export class InventoryComponent {
  private inventory: Record<string, Stackable>;

  private onChange?: (stackable: Stackable) => void;

  constructor(
    inventory: Record<string, Stackable> = {},
    onChange?: (stackable: Stackable) => void,
  ) {
    this.inventory = inventory;
    this.onChange = onChange;
  }

  add(stackable: Stackable) {
    const { name, amount } = stackable;
    if (this.inventory[name]) this.inventory[name].amount += amount;
    else this.inventory[name] = stackable;
    return this;
  }

  provide(name: string, amount: number) {
    if (this.inventory[name]) this.inventory[name].amount += amount;
    this.onChange?.(this.inventory[name]);
    return this;
  }

  consume(name: string, amount: number = 1) {
    if (this.inventory[name] && this.inventory[name].amount - amount >= 0) {
      this.inventory[name].amount -= amount;
      this.onChange?.(this.inventory[name]);
      return true;
    }
    return false;
  }

  list() {
    return Object.entries(this.inventory).map(([_, stackable]) => stackable);
  }
}
