import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { colors } from '../consts';

export default function Splash({win, roll, rain, date }) {
  return win ? (
    <View style={styles.splash}>
      <Text style={styles.text1}>{roll} in a row</Text>
      <Text style={styles.text1}>Keep going</Text>
      <Text style={styles.emoji}>😬</Text>
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
    height: '100%',
    width: Dimensions.get('window').width,
    position: 'absolute',
    zIndex: 9,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  text1: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  text2: { color: colors.orange, fontSize: 16, fontWeight: 'bold' },
  emoji: { fontSize: 32 },
});
