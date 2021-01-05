/* eslint-disable no-param-reassign */
import Phaser from 'phaser';
import { Direction } from 'src/utils/Direction';

export enum Order {
  NONE,
  DOWN,
  LEFT,
  RIGHT,
  UP,
  ACTION_ONE,
  JUMP,
}

export type Orders = Record<Order, Boolean>;

export const createOrders = (options?: Partial<Orders>): Orders => ({
  [Order.NONE]: false,
  [Order.DOWN]: false,
  [Order.LEFT]: false,
  [Order.RIGHT]: false,
  [Order.UP]: false,
  [Order.ACTION_ONE]: false,
  [Order.JUMP]: false,
  [Order.NONE]: true,
  ...options,
});

export const toggleOrder = (orders: Orders, order: Order) => {
  orders[order] = true;
  orders[Order.NONE] = false;
};

export const getOrderFromKeys = (keys: any) => {
  const nextOrderController = createOrders();
  nextOrderController[Order.NONE] = true;
  if (keys.left.isDown) {
    toggleOrder(nextOrderController, Order.LEFT);
  }
  if (keys.right.isDown) {
    toggleOrder(nextOrderController, Order.RIGHT);
  }
  if (keys.up.isDown) {
    toggleOrder(nextOrderController, Order.UP);
  }
  if (keys.down.isDown) {
    toggleOrder(nextOrderController, Order.DOWN);
  }
  if (Phaser.Input.Keyboard.JustDown(keys.space)) {
    toggleOrder(nextOrderController, Order.JUMP);
  }

  return nextOrderController;
};
