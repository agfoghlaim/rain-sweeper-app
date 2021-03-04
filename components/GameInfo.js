import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import { colors } from '../consts';

export default function GameInfo({ gameOver, newGame, setNewGame, win, roll }) {
  function decideEmoji() {
    if (gameOver && typeof newGame === 'undefined') {
      return '😴';
    } else if (!gameOver && typeof newGame === 'boolean') {
      return '🤔';
    } else if (win && gameOver && typeof newGame === 'boolean') {
      return '😀';
    } else if (
      typeof newGame === 'boolean' &&
      typeof win === 'boolean' &&
      gameOver
    ) {
      return '😒';
    } else {
      return '>';
    }
  }
  
  return (
    <View style={styles.gameInfo}>
      <Text style={{ fontSize: 32 }}> {decideEmoji()}</Text>

      {!gameOver && <Text>Round: {roll + 1}</Text>}

      {gameOver && (
        <Button
          color={colors.black}
          accessibilityLabel={win ? 'Next Round' : 'New Game'}
          title={win ? 'Next Round' : 'New Game'}
          onPress={() => setNewGame(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gameInfo: {
    flex: 1,
    minHeight: 64,
    padding: 16,
    backgroundColor: colors.gray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    borderRadius: 4,
  },
});
