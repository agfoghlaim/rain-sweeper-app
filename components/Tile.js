import React, { useState } from 'react';
import { sweeperDate } from '../util';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import { colors } from '../consts';
import WetTile from './Wet';
import DryTile from './Dry';
export default function Tile({
  itemData,
  gameOver,
  handleDryClick,
  handleWetClick,
}) {

  // maybe these should stay here?
  const [flagged, setFlagged] = useState(false);
  const date = sweeperDate(itemData.item.date);

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
