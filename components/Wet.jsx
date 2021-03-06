import React from 'react';

import { Text, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';

import Umbrella from './Unbrella';

import { colors, NUM_DAYS_IN_ROW } from '../consts';

export default function WetTile({
  itemData,
  flagged,
  setFlagged,
  handleWetClick,
  gameOver,
  numLives,
  setNumLives,
  handleSetUmbrellasUsed,
}) {
  const { date, culprit } = itemData;

  function localHandlePress() {
    if (gameOver) return;
    const currentLives = numLives;
    if (currentLives > 0) {
      const update = currentLives - 1;

      setNumLives(update);
      setFlagged(true);
      handleLongPress();
      return;
    }
    handleWetClick(itemData);
  }

  function handleLongPress() {
    if (gameOver) return;
    if (!flagged) {
      // tile is being flagged, need to track this to show on top in gameInfo.
      handleSetUmbrellasUsed().increment();
    } else {
      handleSetUmbrellasUsed().decrement();
    }
    setFlagged(!flagged);
  }

  return (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      style={{
        ...styles.wetTile,
        backgroundColor: culprit ? colors.red : colors.white,
      }}
      onPress={localHandlePress}
      onLongPress={handleLongPress}
    >
      <>
        <Text style={styles.date}>{date}</Text>
        {flagged && !gameOver && <Umbrella />}
        {gameOver && <Text>🌧️</Text>}
      </>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  wetTile: {
    flex: 1,
    overflow: 'hidden',
    height: (Dimensions.get('window').width - 7 - 16) / NUM_DAYS_IN_ROW,
    margin: 1,
    borderRadius: 2,
    shadowColor: colors.black,
    borderColor: 'transparent',
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  date: {
    fontSize: 7,
  },
});
