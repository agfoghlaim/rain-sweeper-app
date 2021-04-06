import React from 'react';
import { StyleSheet } from 'react-native';

import Header from './components/Header';

import { SettingsProvider } from './contexts/settingsContext';
import { GameProvider } from './contexts/gameContext';

// navigation related
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Game from './screens/Game';
import Settings from './screens/Settings';
import About from './screens/About';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GameProvider>
    <SettingsProvider>
      
      <Header title="Irish Rain Sweeper" />

      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Play" component={Game} />
          <Tab.Screen name="Settings" component={Settings} />
          <Tab.Screen name="About" component={About} />
        </Tab.Navigator>
      </NavigationContainer>
    </SettingsProvider>
    </GameProvider>
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
