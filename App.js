import React from 'react';
import { StyleSheet, View } from 'react-native';

import GameScreen from './screens/Game';
import Header from './components/Header';

import { SettingsProvider } from './contexts/settingsContext';

export default function App() {
  return (
    <SettingsProvider>
      <View style={styles.container}>
        <Header title="Irish Rain Sweeper" />
        <GameScreen />
      </View>
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    alignContent: 'center',
  },
});
