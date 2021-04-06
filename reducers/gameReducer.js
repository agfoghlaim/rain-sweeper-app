import {
  shuffleArray,
  addNumNastyNeighboursToShuffledData,
  setCheckedToFalse,
  setCheckedToTrue,
  sliceNumDaysInAGameConst,
} from '../util';
function getGameData(allData) {
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
  }, allData);
  return gameData;
}

export default function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_FETCHED_DATA':
      return {
        ...state,
        loading: false,
        error: '',
        data: action.payload.gameData,
        allData: action.payload.allData,
      };
    case 'SET_FETCHED_ALL_DATA': {
      const prevData = state.allData;
      return {
        ...state,
        loading: false,
        error: '',
        allData: action.payload.allData,
        prevData: prevData,
      };
    }
    case 'FETCH_ERROR':
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.loading,
      };
    case 'FETCHING':
      return {
        ...state,
        loading: action.loading,
        error: action.error,
      };
    case 'RESET_ROLL':
      return {
        ...state,
        roll: 0,
      };
    case 'CALC_WET_DAYS': {
      const wetDays = state.data.filter((item) => item.rain > 0);

      return {
        ...state,
        numWet: wetDays.length || 0,
      };
    }
    case 'INCREMENT_ROLL':
      return {
        ...state,
        roll: state.roll + 1,
      };

    case 'RESET SCORE':
      return {
        ...state,
        score: 0,
      };
    case 'SCORE': {
      const currentScore = Number(state.score);
      const updateScore = currentScore + action.numWet * 10; // more exciting.
      return {
        ...state,
        score: updateScore,
      };
    }
    case 'CULPRIT':
      return {
        ...state,
        culprit: action.payload,
      };
    case 'SHUFFLE':
      return {
        ...state,
        data: getGameData(state.allData),
      };

    case 'CHECK_TILE':
      return {
        ...state,
        data: action.payload,
      };
    case 'REVEAL_ALL': {
      const revealed = setCheckedToTrue(state.data);
      return {
        ...state,
        data: revealed,
      };
    }
    case 'NUM_LIVES':
      return {
        ...state,
        numLives: !isNaN(action.payload) ? action.payload : 0,
      };
    case 'UPDATE_NUM_LIVES': {
      const calcNumLives = function () {
        if (state.roll === 4) {
          return 1;
        } else if (state.roll > 0 && state.roll % 9 === 0) {
          return 2;
        } else {
          return 0;
        }
      };
      const inc = calcNumLives();
      return {
        ...state,
        numLives: state.numLives + inc,
      };
    }
    default:
      return { ...state };
  }
}
