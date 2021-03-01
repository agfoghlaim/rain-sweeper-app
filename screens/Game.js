import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { colors } from '../consts';
import Board from '../components/Board';
export default function GameScreen() {
  return (
    <View style={styles.gameScreenWrap}>
      <View style={styles.topWrap}>
        <Text style={{ color: colors.black }}>Emoji Here</Text>
        <Button style={styles.btn} title="New Game" />
      </View>
      <View style={styles.gameWrap}>
        <Board />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gameScreenWrap: {
    backgroundColor: colors.white,
    flex: 1,
    padding: 4,
    alignItems: 'center',
    width: '100%',
  },
  topWrap: {
    flex: 1,
    width: '100%',
    padding: 16,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //minHeight: '20%' // game takes as much as possible but min of 20%,
  },
  gameWrap: {
    flex: 5, // 5 times more space than .topWrap
    width: '100%',
  },
  btn: {
    width: 400,
  },
});
