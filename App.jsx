import React from 'react';

// navigation
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SettingsProvider } from './contexts/settingsContext';
import { GameProvider } from './contexts/gameContext';

// screens
import Game from './screens/Game';
import Settings from './screens/Settings';
import About from './screens/About';

import { colors } from './consts';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GameProvider>
      <SettingsProvider>

        <NavigationContainer>
          <Tab.Navigator
            tabBarOptions={{
              activeTintColor: colors.black,
              activeBackgroundColor: colors.white,
              inactiveBackgroundColor: colors.black,

              tabStyle: {
                justifyContent: 'center',
              },
              style: {
                height: 40,
                borderTopColor: colors.darkBlack,
              },

              labelStyle: {
                textTransform: 'uppercase',
                fontWeight: 'bold',
                letterSpacing: 1,
                fontSize: 14,
              },
            }}
          >
            <Tab.Screen name="Play" component={Game} />
            <Tab.Screen name="Settings" component={Settings} />
            <Tab.Screen name="About" component={About} />
          </Tab.Navigator>
        </NavigationContainer>
      </SettingsProvider>
    </GameProvider>
  );
}
