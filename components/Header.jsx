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
    backgroundColor: colors.darkGray,
    height: 90,
    width: '100%',
    paddingTop: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: colors.white,
    borderBottomWidth: 1, // can't figure out how to remove border top on the bottom tab container so make it look like it's meant to be like that.

  },
  headerText: {
    color: colors.black,
    fontSize: 16,

    fontWeight: '700',
    letterSpacing: 1,

    textTransform: 'uppercase',
    fontFamily: 'monospace',
  },
});
