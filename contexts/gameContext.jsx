import React, { createContext, useReducer, useContext } from 'react';
import gameReducer from '../reducers/gameReducer';

const GameContext = createContext(null);

const initialState = {
  roll: 0,
  score: 0,
  loading: true,
  error: '',
  culprit: null,
  allData: [], // all data shuffled- ratio is 1:5 wet:dry
  data: [], // game data, .length === NUM_DAYS_IN_GAME
  numWet: undefined,
  numLives: 3,
};

export function GameProvider({ children }) {
  const [realData, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{ realData, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  return context;
}
