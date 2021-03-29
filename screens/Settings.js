import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

export default function SettingsScreen() {
  return (
    <View style={styles.gameScreenWrap}>
      <Text>Settings Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  settingsScreenWrap: {
    flex: 1,
    width: '100%',
  },
});
