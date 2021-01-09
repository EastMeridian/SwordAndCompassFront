import React from 'react';
import GameScreen from 'src/screens/GameScreen';
import './App.css';

function App() {
  return (
    <>
      <div style={{
        fontFamily: 'minecraft', position: 'absolute', left: '-1000px', visibility: 'hidden',
      }}
      >
        .
      </div>

      <GameScreen />
    </>
  );
}

export default App;
