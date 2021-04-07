import React from 'react';
import { Text, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import { colors, NUM_DAYS_IN_ROW } from '../consts';
import Nasties from './Nasties';
import Umbrella from './Unbrella';

export default function DryTile({
  itemData,
  flagged,
  setFlagged,
  handleDryClick,
  gameOver,
  handleSetUmbrellasUsed,
}) {
  const { checked, date, numNastyNeighbours } = itemData;
  function localHandlePress() {
    if (gameOver) return;
    if (checked) return;
    handleDryClick(itemData);
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
        ...styles.dryTile,
        backgroundColor: checked ? `${colors.gray}` : `${colors.white}`,
        borderColor: checked ? `${colors.white}` : 'transparent',
      }}
      onPress={localHandlePress}
      onLongPress={handleLongPress}
    >
      <>
        <Text style={styles.date}>{date}</Text>

        {checked && <Nasties numNastyNeighbours={numNastyNeighbours} />}

        {flagged && !checked && !gameOver && <Umbrella />}
      </>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  dryTile: {
    flex: 1,
    overflow: 'hidden',
    height: (Dimensions.get('window').width - 7 - 16) / NUM_DAYS_IN_ROW,
    margin: 1,
    borderRadius: 2,
    borderColor: 'transparent',
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  date: {
    fontSize: 7,
  },
});
