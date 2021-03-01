import { DIRECTIONS, NUM_DAYS_IN_GAME, NUM_DAYS_IN_ROW } from './consts';

export function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function fetchData() {
  const url = 'https://irish-apis.netlify.app/weather/api';

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      query: `
				{
					dailyData(station: ATHENRY) {
						date
						rain
						hm
					}
				}
				`,
    }),
  });
  const ans = await res.json();

  const split = ans.data.dailyData.reduce(
    (acc, cur) => {
      if (cur.rain > 0) {
        acc.wet.push(cur);
      } else {
        acc.dry.push(cur);
      }
      return acc;
    },
    { wet: [], dry: [] }
  );

  const wet = shuffleArray(split.wet);
  const dry = shuffleArray(split.dry);
  const winnableData = dry.slice(0, 1000).concat(wet.slice(0, 200));
  const theAns = shuffleArray(winnableData);

  // TODO this is stupid, should be done later to the chosen 64 not all 600, 
  const winnableDataWithnNastyNeighbours = addNumNastyNeighboursToShuffledData(
    theAns
  );

  return winnableDataWithnNastyNeighbours;
}

export function addNumNastyNeighboursToShuffledData(days) {
  for (let i = 0; i < days.length; i++) {
    let numNastyNeighbours = 0;

    DIRECTIONS.forEach((direction) => {
      if (
        shouldCheckInThisDirection(i)[direction]() &&
        hasNastyNeighbour(i, direction, days)
      ) {
        numNastyNeighbours++;
      }
    });

    days[i].numNastyNeighbours = numNastyNeighbours;
    days[i].id = i; // TODO fix this, need proper ids.
    //days[i].checked = false; // TODO fix this, move or change the name of this function which already has a really long name!.
  }
  return days;
}
export function shouldCheckInThisDirection(i) {
  /**
   * if seeking square to the west, don't check if current square is @ left of the board or square[0]
   * if seeking square to the north-west, don't check if current square is @ left of the board or on the top row or is square[0]...etc.
   */
  return {
    west: () => !isLeft(i) && i > 0,
    northWest: () => !isLeft(i) && i > 0 && !isTop(i),
    north: () => !isTop(i) && i > 0,
    northEast: () => !isTop(i) && i > 0 && !isRight(i),
    east: () => !isRight(i),
    southEast: () => !isRight(i) && !isBottom(i),
    south: () => !isBottom(i),
    southWest: () => !isBottom(i) && !isLeft(i),
  };
}

export function hasNastyNeighbour(i, direction, days) {
  /**
   * Every square has up to 8 neighbours, one in every direction.
   * For example if there are 5 squares in each row... some square (square[i]'s) neighbours going from west clockwise around to south-west will be:
   * west: i-1
   * north-west: i-6 [ i - NUM_DAYS_IN_ROW - 1]
   * north: i-5 [i - NUM_DAYS_IN_ROW ]
   * north-east: i-4, [i - (NUM_DAYS_IN_ROW - 1)]
   * east: i+1,
   * south-east: i+6, [i + NUM_DAYS_IN_ROW + 1]
   * south: i+5, [i + NUM_DAYS_IN_ROW ]
   * south-west: i+4 [ i + (NUM_DAYS_IN_ROW - 1) ]
   * */

  const neighbours = {
    west: i - 1,
    northWest: i - NUM_DAYS_IN_ROW - 1,
    north: i - NUM_DAYS_IN_ROW,
    northEast: i - (NUM_DAYS_IN_ROW - 1),
    east: i + 1,
    southEast: i + NUM_DAYS_IN_ROW + 1,
    south: i + NUM_DAYS_IN_ROW,
    southWest: i + (NUM_DAYS_IN_ROW - 1),
  };

  const relevantNeighbourIndex = neighbours[direction];

  return days[relevantNeighbourIndex].rain > 0;
}
export function getNeighbourToThe(i, direction) {

  const neighbours = {
    west: i - 1,
    northWest: i - NUM_DAYS_IN_ROW - 1,
    north: i - NUM_DAYS_IN_ROW,
    northEast: i - (NUM_DAYS_IN_ROW - 1),
    east: i + 1,
    southEast: i + NUM_DAYS_IN_ROW + 1,
    south: i + NUM_DAYS_IN_ROW,
    southWest: i + (NUM_DAYS_IN_ROW - 1),
  };
  return neighbours[direction];
}
export function sweeperDate(string) {
  const dateInFormatFirefoxLikes = string.replace(/-/g, '/');

  const d = new Date(string);
  const year = d.getFullYear().toString().substring(2,4);
  //const month = d.getMonth();
  const month = d.toLocaleString('default', { month: 'long' }).substring(4, 7)
  const day = d.getDate();
  return `${day} ${month} '${year}`
  // eg 11 Feb 18
  
  // return new Date(dateInFormatFirefoxLikes).toLocaleString('en-GB', {
  //   day: 'numeric',
  //   month: 'short',
  //   year: '2-digit',
  // });
  // return new Date(string).toLocaleString('en-GB', {
  //   day: 'numeric',
  //   month: 'short',
  //   year: '2-digit',
  // });
}

export function setCheckedToFalse(arr) {
  return arr.map((day) => {
    day.checked = false;

    return day;
  });
}
function isLeft(num) {
  return num % NUM_DAYS_IN_ROW === 0;
}
function isRight(num) {
  return num % NUM_DAYS_IN_ROW === NUM_DAYS_IN_ROW - 1;
}
function isTop(num) {
  return num < NUM_DAYS_IN_ROW;
}
function isBottom(num) {
  return num >= NUM_DAYS_IN_GAME - NUM_DAYS_IN_ROW;
}

