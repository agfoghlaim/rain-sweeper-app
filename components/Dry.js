import React, { useState } from 'react';
import { sweeperDate } from '../util';
import { Text, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import { colors } from '../consts';
import Nasties from './Nasties';

export default function DryTile({ itemData, handleDryClick, gameOver }) {
  const [flagged, setFlagged] = useState(false);
  const date = sweeperDate(itemData.item.date);

  function localHandlePress() {
    if (gameOver) return;
    if (itemData.item.checked) return;
    handleDryClick(itemData.item);
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
        ...styles.dryTile,
        backgroundColor: itemData.item.checked
          ? `${colors.gray}`
          : `${colors.white}`,
      }}
      onPress={localHandlePress}
      onLongPress={handleLongPress}
    >
      <>
        <Text style={styles.date}>{date}</Text>
        {itemData.item.checked && (
          <Nasties numNastyNeighbours={itemData.item.numNastyNeighbours} />
        )}

        {flagged && !itemData.item.checked && <Text>☂️</Text>}
      </>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  dryTile: {
    flex: 1,
    height: (Dimensions.get('window').width - 7 - 16) / 8, // this is right for a square? find what padding/margin is involved
    margin: 1,
    borderRadius: 2,
    shadowColor: colors.black,
    elevation: 10,
    borderColor: colors.white,
    borderWidth: 2,
  },

  date: {
    fontSize: 6,
  },
});
