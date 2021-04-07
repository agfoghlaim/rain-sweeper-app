import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors } from '../consts';

export default function Header({ title }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.black,
    height: 90,
    width: '100%',
    paddingTop: 48,
    alignItems: 'center',
    justifyContent: 'center',

  },
  headerText: {
    color: colors.white,
    fontSize: 16,

    fontWeight: '700',
    letterSpacing: 1,

    textTransform: 'uppercase',
    fontFamily: 'monospace',
  },
});
