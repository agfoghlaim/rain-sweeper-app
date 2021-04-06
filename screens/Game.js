import React from 'react';
import { View, StyleSheet} from 'react-native';
import Board from '../components/Board';

import { colors } from '../consts';
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
    backgroundColor: colors.black,

    justifyContent: 'center',
  },
});
