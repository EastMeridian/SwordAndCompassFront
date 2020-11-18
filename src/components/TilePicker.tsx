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
    event: React.MouseEvent<HTMLImageElement, MouseEvent> & {
      target: { offsetLeft: number; offsetTop: number };
    }
  ) => {
    const x = Math.floor(
      ((event.clientX - event.target.offsetLeft) / TILESET_WIDTH_SIZE) *
        TILESET_WIDTH
    );
    const y = Math.floor(
      ((event.clientY - event.target.offsetTop) / TILESET_HEIGHT_SIZE) *
        TILESET_HEIGHT
    );

    const position = {
      x,
      y,
      index: y * TILESET_WIDTH + x,
    };

    console.log(
      event.clientX,
      event.target.offsetLeft,
      event.clientY,
      event.target.offsetTop
    );
    console.log({ position, event });
    onChange(position);
  };

  console.log({ selected });
  return (
    <Container>
      <img src="assets/tileset.png" onMouseDown={handleMouseDown} />
      <Tile selected={selected} />
    </Container>
  );
};
export default TilePicker;
