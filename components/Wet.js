import React, { useEffect } from 'react';

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
}) {
  // Destructure from itemData.item.
  // const {
  //   item: { date, culprit },
  // } = itemData;
  const { date, culprit } = itemData;

  function localHandlePress() {
    if (gameOver) return;
    let currentLives = numLives;
    if (currentLives > 0) {
      const update = currentLives - 1;
      setNumLives(update);
      setFlagged(true);
      return;
    }
    handleWetClick(itemData);
  }

  function handleLongPress() {
    if (gameOver) return;
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
    height: (Dimensions.get('window').width - 7 - 16) / NUM_DAYS_IN_ROW,
    margin: 1,
    borderRadius: 2,
    shadowColor: colors.black,
    elevation: 10,
    borderColor: colors.white,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  date: {
    fontSize: 7,
  },
});
