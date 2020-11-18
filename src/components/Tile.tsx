import { TILE_SIZE } from "../constants";
import styled from "styled-components";
interface Props {
  selected: { x: number; y: number };
}

const Tile = styled.div`
  width: ${TILE_SIZE}px;
  height: ${TILE_SIZE}px;
  border: solid grey 1px;
  background: ${({ selected }: Props) =>
    `url(assets/tileset.png) 
    ${selected.x * TILE_SIZE}px 
    ${-selected.y * TILE_SIZE}px 
    no-repeat`};
`;

export default Tile;
