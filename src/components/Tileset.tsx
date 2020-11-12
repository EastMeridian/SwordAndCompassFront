import React, { useState } from "react";
import { Container } from "./layout";

const MAP_SIZE = 16;

interface Props {
  currentTile: { x: number; y: number };
}
const Tileset = ({ currentTile }: Props) => {
  const [tile, setTile] = useState()

  const handleMouseDown = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    const position = {
      x: Math.floor(
        // @ts-ignore
        ((event.clientX - event.target.offsetLeft) / TILESET_WIDTH) * 8
      ),
      y: Math.floor(
        // @ts-ignore
        ((event.clientY - event.target.offsetTop) / TILESET_HEIGHT) * 16
      ),
    };

    console.log(position)
  };

  return (
  <Container onMouseDown={handleMouseDown}>

  </Container>
  );
};
export default Tileset;
