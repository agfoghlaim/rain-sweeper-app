export default function settingsReducer(state, action) {
  const prev = state.selectedStationDisplay;
  switch (action.type) {
    // but only actually change this if the newly selected station fetches successfully
    case 'SELECT_STATION':
      return {
        ...state,
        selectedStation: action.payload.name,
        selectedStationDisplay: action.payload.displayName,
        stationChanged: true,
        prevStation: prev,
      };
    case 'SET_STATION_CHANGED':
      return {
        ...state,
        stationChanged: action.payload,
      };
    case 'STATION_CHANGE_ERROR':
      return {
        ...state,
        stationChangeError: action.payload,
      };

    default:
      console.warn('Default case settingsReducer.js');
      return {
        ...state,
      };
  }
}
