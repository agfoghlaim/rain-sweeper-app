import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../consts';

import Header from '../components/Header';

export default function AboutScreen() {
  return (
    <>
      <Header title="Irish Rain Sweeper" />
      <View style={styles.aboutScreenWrap}>
        <Text style={styles.text}>
          Irish Rain Sweeper is something like Minesweeper except instead of
          mines there are rainy days and instead of flags there are umbrellas.
          The game uses real Met Éireann data.
        </Text>
        <Text style={styles.text}>
          You get three spare umbrellas for every game, these open automatically
          if you choose a rainy day. You can add/remove your own umbrellas by
          long pressing. The more rounds you clear the more spare umbrellas you
          can collect.
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  aboutScreenWrap: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.darkBlack,
    padding: 16,
    justifyContent: 'center',
  },
  text: {
    color: colors.white,
    marginBottom: 8,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'monospace',
  },
});
