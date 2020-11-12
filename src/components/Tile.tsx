import React from "react";
import { TILE_SIZE } from "../constants";

interface Props {
  selected: { x: number; y: number };
}

const Tile = ({ selected }: Props) => (
  <div
    style={{
      background: `url(assets/tileset.png) ${-selected.x * TILE_SIZE}px  ${
        -selected.y * TILE_SIZE
      }px  no-repeat`,
      width: TILE_SIZE,
      height: TILE_SIZE,
      left: selected.x * TILE_SIZE,
      top: -selected.y * TILE_SIZE,
      border: "solid grey",
    }}
  />
);

export default Tile;
