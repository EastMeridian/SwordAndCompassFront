import styled from "styled-components";

export const AppContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: grey;
  display: flex;
`;

export const TilemapContainer = styled.div`
  flex: 1;
  background-color: red;
`;

export const UIContainer = styled.div`
  z-index: 5;
  position: absolute;
  width: 100%;
  max-height: 100vh;
  display: flex;
  justify-content: flex-end;
  pointer-events: none;
`;
