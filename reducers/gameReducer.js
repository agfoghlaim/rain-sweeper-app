import {
  shuffleArray,
  addNumNastyNeighboursToShuffledData,
  setCheckedToFalse,
} from '../util';

import {NUM_DAYS_IN_GAME} from '../consts';

export default function gameReducer(state, action) {
  switch (action.type) {
    case 'FETCH':
      return {
        loading: false,
        error: '',
        data: action.payload.slice(0,NUM_DAYS_IN_GAME),
        allData: action.payload
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case 'SHUFFLE':
      const { payload } = action;
      const ans = [
        shuffleArray,
        setCheckedToFalse,
        addNumNastyNeighboursToShuffledData,
      ].reduce((payload, fn) => {
        return fn(payload);
      }, payload);

      return {
        ...state,
        data: ans.slice(0,NUM_DAYS_IN_GAME),
      };

    case 'CHECK_TILE':
      return {
        ...state,
        data: action.payload,
      };
    case 'REVEAL_ALL':
      return {
        ...state, 
        data: action.payload
      }

    default:
      return { ...state };
  }
}
