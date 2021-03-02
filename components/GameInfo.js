import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import { colors } from '../consts';

export default function GameInfo({ gameOver, setNewGame, win }) {
  return (
    <View style={styles.gameInfo}>
      <Text
        style={{
          color: colors.black,
          fontSize: 18,
          letterSpacing: -2,
          fontWeight: 'bold',
        }}
      >
        {gameOver ? 'Game Over' : 'Game On'}
      </Text>
      {win && gameOver && <Text style={{ fontSize: 32 }}>😀</Text>}
      {!win && gameOver && <Text style={{ fontSize: 32 }}>😒</Text>}
      {!gameOver && <Text style={{ fontSize: 32 }}>🤔</Text>}
      <Button
        color={colors.black}
        accessibilityLabel="New Game"
        title="New Game"
        onPress={() => setNewGame(true)}
      />
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
