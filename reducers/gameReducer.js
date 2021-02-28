import { shuffleArray } from '../util';

export default function gameReducer(state, action) {
  switch (action.type) {
    case 'FETCH':

      return {
        loading: false,
        error: '',
        data: action.payload,
      };
    case 'FETCH_ERROR':

      return {
				...state,
        loading: false,
        error: action.error,
    
      };
    case 'SHUFFLE':
      return {
        ...state,
        data: shuffleArray(action.payload),
      };

    default:
      return {...state};
  }
}
