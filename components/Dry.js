import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Dimensions, TouchableHighlight } from 'react-native';
import { colors } from '../consts';
import Nasties from './Nasties';
import Umbrella from './Unbrella';

export default function DryTile({
  itemData,
  flagged,
  setFlagged,
  handleDryClick,
  gameOver,
}) {

  // Destructure from itemData.item.
  // const {
  //   item: { checked, date, numNastyNeighbours },
  // } = itemData;
const { checked, date, numNastyNeighbours } = itemData;
  function localHandlePress() {
    if (gameOver) return;
    if (checked) return;
    handleDryClick(itemData);
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
        backgroundColor: checked ? `${colors.gray}` : `${colors.white}`,
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
    height: (Dimensions.get('window').width - 7 - 16) / 8,
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
