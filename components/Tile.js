import React, { useState } from 'react';


import WetTile from './Wet';
import DryTile from './Dry';

export default function Tile({
  itemData,
  gameOver,
  handleDryClick,
  handleWetClick,
}) {

  // TODO: maybe these should stay here?
  const [flagged, setFlagged] = useState(false);


  return itemData.item.rain === 0  ? (
    <DryTile
    itemData={itemData}
    handleDryClick={handleDryClick}
    gameOver={gameOver}
    />
  ) : (
    <WetTile
      itemData={itemData}
      handleWetClick={handleWetClick}
      gameOver={gameOver}
    />
  );

}
