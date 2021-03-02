import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { colors } from '../consts';
import Board from '../components/Board';
export default function GameScreen() {
  return (
    <View style={styles.gameScreenWrap}>
      <Board />
    </View>
  );
}

const styles = StyleSheet.create({
  gameScreenWrap: {
    flex: 1,
    width: '100%',
  },
});
