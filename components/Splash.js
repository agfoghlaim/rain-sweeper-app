import React from 'react';
import { View, StyleSheet, Dimensions, Text, Button } from 'react-native';
import { colors } from '../consts';

export default function Splash({ win, numWet, rain, date, roll, setNewGame }) {
  function localHandleDismissSplash() {
    setNewGame(true);
  }

  let msg = '';
  if (roll === 4) {
    msg = '😎🌂';

    // Two spare umbrellas every 10 rounds.
  } else if (roll > 0 && roll % 10 === 0) {
    msg = '😎🌂🌂';
  }

  return win ? (
    <View style={styles.splash}>
      <Text style={styles.emoji}>{msg === '' ? '😎' : msg}</Text>
      <Text style={styles.text2}>You avoided {numWet} rainy days</Text>
      <Button
        color={colors.orange}
        onPress={localHandleDismissSplash}
        title="Keep Going"
      />
    </View>
  ) : (
    <View style={styles.splash}>
      <Text style={styles.text1}>Game Over</Text>
      <Text style={{ fontSize: 64 }}>☔</Text>
      <Text style={styles.text2}>
        There was {rain}mm of rain on {date}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  splash: {
    backgroundColor: colors.black,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    width: '100%',
    position: 'absolute',
    zIndex: 9,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text1: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  text2: {
    color: colors.orange,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emoji: { fontSize: 32, margin: 20 },
});
