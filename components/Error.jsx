import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { colors } from '../consts';

export default function Error({ msg, tryAgain }) {
  return (
    <View style={styles.loadingWrap}>
      <Text style={styles.emoji}>🤔</Text>
      <Text style={styles.text}>
        {msg}
      </Text>
      <View style={styles.tryAgainBtn}>
        <Button
          accessibilityLabel="Try fetching data again"
          color={colors.red}
          title="Try Again"
          onPress={tryAgain}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 20,
  },
  text: {
    fontSize: 14,
    color: colors.red,
    marginVertical: 10,

    padding: 3,
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontFamily: 'monospace',
  },
  tryAgainBtn: {
    marginVertical: 20,
  },
});
