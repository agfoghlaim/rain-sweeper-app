import React, { useState, useEffect } from 'react';

import { Text } from 'react-native';
import WetTile from './Wet';
import DryTile from './Dry';

export default function Tile({
  itemData,
  gameOver,
  handleDryClick,
  handleWetClick,
  numLives,
  setNumLives
}) {


  // TODO: maybe these should stay here?
  const [flagged, setFlagged] = useState(false);

  useEffect(() => {
    if (!gameOver) return;
    setFlagged(false);
  }, [gameOver, flagged]);
  
  // itemData.item is undefined
  
  return( 

    itemData.rain === 0  ? (
    <DryTile
    itemData={itemData}
    handleDryClick={handleDryClick}
    gameOver={gameOver}
    setFlagged={setFlagged}
    flagged={flagged}

    />
  ) : (
    <WetTile
      itemData={itemData}
      handleWetClick={handleWetClick}
      gameOver={gameOver}
      setFlagged={setFlagged}
      flagged={flagged}
      numLives={numLives}
      setNumLives={setNumLives}
    />
  )
  );

}
