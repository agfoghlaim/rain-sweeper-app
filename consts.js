export const colors = {
  black: '#333131',
  lightBlack: '#333131',
  white: '#fff',
  orange: '#ffa410',
  purple: '#703fb9',
  lightPurple: '#a084ca',
  red: '#ff401a',
  gray: '#cac4b9',
  darkGray: '#ababab',
  darkBlack: '#181717',
  green: '#0c8f2c',
  blue: '#396fb4',
  lightBlue: '#00e1ff',
  blackOpacity: 'rgba(51,49,49,0.3)',
};

export const DIRECTIONS = [
  'west',
  'northWest',
  'north',
  'northEast',
  'east',
  'southEast',
  'south',
  'southWest',
];

// Except for date fontSize everything should work properly if these are changed.
// NUM_DAYS_IN_GAME % NUM_DAYS_IN_ROW === 0 must be true.
export const NUM_DAYS_IN_ROW = 8;
export const NUM_DAYS_IN_GAME = 64;

export const STATIONS = [
  { name: 'ATHENRY', displayName: 'Athenry' },
  { name: 'BALLYHAISE', displayName: 'Ballyhaise' },
  { name: 'BELMULLET', displayName: 'Belmullet' },
  { name: 'CASEMENT', displayName: 'Casement' },
  { name: 'CLAREMORRIS', displayName: 'Claremorris' },
  { name: 'CORK_AIRPORT', displayName: 'Cork Airport' },
  { name: 'DUBLIN_AIRPORT', displayName: 'Dublin Airport' },
  { name: 'DUNSANY', displayName: 'Dunsany' },
  { name: 'FINNER', displayName: 'Finner' },
  { name: 'GURTEEN', displayName: 'Gurteen' },
  { name: 'JOHNSTOWN_CASTLE', displayName: 'Johnstown Castle' },
  { name: 'KNOCK_AIRPORT', displayName: 'Knock Airport' },
  { name: 'MACE_HEAD', displayName: 'Mace Head' },
  { name: 'MALIN_HEAD', displayName: 'Malin Head' },
  { name: 'MARKREE', displayName: 'Markree Castle' },
  { name: 'MOORE_PARK', displayName: 'Moore Park' },
  { name: 'MT_DILLON', displayName: 'Mt Dillon' },
  { name: 'MULLINGAR', displayName: 'Mullingar' },
  { name: 'NEWPORT_FURNACE', displayName: 'Newport' }, // Newport doesn't work, returns all nulls. Is a weather api issue.
  { name: 'OAK_PARK', displayName: 'Oak Park' },
  { name: 'PHOENIX_PARK', displayName: 'Phoenix Park' },
  { name: 'ROCHES_POINT', displayName: "Roche's Point" },
  { name: 'SHANNON_AIRPORT', displayName: 'Shannon Airport' },
  { name: 'SHERKIN_ISLAND', displayName: 'Sherkin Island' },
  { name: 'VALENTIA_OBSERVATORY', displayName: 'Valentia Observatory' },
];
