import React, { useState } from 'react';
import { sweeperDate } from '../util';
import { Text, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';

import { colors } from '../consts';

export default function WetTile({ itemData, handleWetClick, gameOver }) {
  const [flagged, setFlagged] = useState(false);
  const date = sweeperDate(itemData.item.date);

  function localHandlePress() {
    if (gameOver) return;
    handleWetClick(itemData.item);
  }

  function handleLongPress() {
    if (gameOver) return;
    setFlagged(!flagged);
  }

  return (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      style={styles.wetTile}
      onPress={localHandlePress}
      onLongPress={handleLongPress}
    >
      <>
        <Text style={styles.date}>{date}</Text>
        {flagged && <Text>☂️</Text>}
        {gameOver && <Text>🌧️</Text>}
      </>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  wetTile: {
    flex: 1,
    height: (Dimensions.get('window').width - 7 - 16) / 8,
    margin: 1,
    backgroundColor: colors.orange,
    borderRadius: 2,
    shadowColor: colors.black,
    elevation: 10,
    // padding: 4,
    borderColor: colors.white,
    borderWidth: 2,
  },

  date: {
    fontSize: 6,
  },
});
