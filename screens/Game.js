import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { colors } from '../consts';
import Board from '../components/Board';
export default function GameScreen() {
  return (
    <View style={styles.gameScreenWrap}>
      <View style={styles.gameWrap}>
        <Board />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gameScreenWrap: {
    backgroundColor: colors.black,
    flex: 1,
    width: '100%',
  },
});
