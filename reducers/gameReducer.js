import {
  shuffleArray,
  addNumNastyNeighboursToShuffledData,
  setCheckedToFalse,
  sliceNumDaysInAGameConst,
} from '../util';

export default function gameReducer(state, action) {
  switch (action.type) {
    case 'FETCH':
      return {
        loading: false,
        error: '',
        data: action.payload.gameData,
        allData: action.payload.allData,
      };
    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case 'SHUFFLE':
      // payload is allData, do the following 4 things to it & return some gameData.
      const { payload } = action;
      const gameData = [
        // 1. shuffle allData,
        shuffleArray,

        // 2. slice off gameData (.length === NUM_DAYS_IN_GAME),
        sliceNumDaysInAGameConst,

        // 3. set all data[checked] to false,
        setCheckedToFalse,

        // 4. add data[numNastyNeighbours] to gameData.
        addNumNastyNeighboursToShuffledData,
      ].reduce((payload, fn) => {
        return fn(payload);
      }, payload);

      return {
        ...state,
        data: gameData,
      };

    case 'CHECK_TILE':
      return {
        ...state,
        data: action.payload,
      };
    case 'REVEAL_ALL':
      return {
        ...state,
        data: action.payload,
      };

    default:
      return { ...state };
  }
}
