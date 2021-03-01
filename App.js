import React from 'react';
import { StyleSheet, View } from 'react-native';

import GameScreen from './screens/Game';
import Header from './components/Header';
export default function App() {
  return (
    <View style={styles.container}>
      <Header title="Galway RainSweeper" />
      <GameScreen/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    alignContent: 'center'
  }

});
