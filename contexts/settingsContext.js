import React, { createContext, useReducer, useContext } from 'react';
import settingsReducer from '../reducers/settingsReducer';
 const SettingsContext = createContext(null);

const initialSettings = {
  selectedStation: 'ATHENRY',
};

export function SettingsProvider({ children }) {
  const [settings, dispatch] = useReducer(settingsReducer, initialSettings);
  return (
    <SettingsContext.Provider value={{ settings, settingsDispatch: dispatch }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  return context;
}
