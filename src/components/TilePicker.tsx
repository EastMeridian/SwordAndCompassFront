import React from "react";
import { Container } from "./layout";
import Tile from "./Tile";
import {
  TILESET_HEIGHT_SIZE,
  TILESET_WIDTH_SIZE,
  TILESET_HEIGHT,
  TILESET_WIDTH,
} from "../constants";

interface Props {
  onChange: (position: { x: number; y: number }) => void;
  value: { x: number; y: number };
}

const TilePicker = ({ onChange, value: selected }: Props) => {
  const handleMouseDown = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    const position = {
      x: Math.floor(
        // @ts-ignore
        ((event.clientX - event.target.offsetLeft) / TILESET_WIDTH_SIZE) *
          TILESET_WIDTH
      ),
      y: Math.floor(
        // @ts-ignore
        ((event.clientY - event.target.offsetTop) / TILESET_HEIGHT_SIZE) *
          TILESET_HEIGHT
      ),
    };
    onChange(position);
  };

  return (
    <Container>
      <img src="assets/tileset.png" onMouseDown={handleMouseDown} />
      <Tile selected={selected} />
    </Container>
  );
};
export default TilePicker;
