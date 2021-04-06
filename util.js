import { DIRECTIONS, NUM_DAYS_IN_GAME, NUM_DAYS_IN_ROW } from './consts';

export function shuffleArray(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function fetchData(station = 'ATHENRY') {
  const url = 'https://irish-apis.netlify.app/weather/api';

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      // eslint-disable-next-line no-tabs
      query: `{
					dailyData(station: ${station}) {
						date
						rain
					}
				}`,
    }),
  });
  const ans = await res.json();

  if (
    ans.errors ||
    !ans.data ||
    !ans.data.dailyData ||
    !ans.data.dailyData.length
  ) {
    return false;
  }

  // remove any null values
  const noNulls = ans.data.dailyData.filter((d) => d.rain !== null);

  // Split the response into {wet, dry}.
  const split = noNulls.reduce(
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

  // Shuffle the wet/dry arrays.
  const wet = shuffleArray(split.wet);
  const dry = shuffleArray(split.dry);

  // Return if there's not enough data available to play.
  if (wet.length < 200 || dry.length < 1000) return false;

  // Concat wet/dry arrays @ 5:1 (dry:wet) ratio.
  const winnableData = dry.slice(0, 1000).concat(wet.slice(0, 200));

  // Shuffle the data.
  const allDataShuffled = shuffleArray(winnableData);

  // Format the dates.
  // eslint-disable-next-line no-use-before-define
  const allDataWithNiceDates = formatDates(allDataShuffled);

  // Slice off gameData( .length === NUM_DAYS_IN_GAME )l
  const gameData = allDataWithNiceDates.slice(0, NUM_DAYS_IN_GAME);

  // Add .numNastyNeighbours to the gameData.
  // eslint-disable-next-line no-use-before-define
  const gameDataWithNumNasties = addNumNastyNeighboursToShuffledData(gameData);

  // Return object.
  // object.allData length is 1200 long & can be shuffled to create more gameData without re fetching.
  // object.gameData length is NUM_DAYS_IN_GAME

  return {
    allData: allDataShuffled,
    gameData: gameDataWithNumNasties,
  };
}

export function addNumNastyNeighboursToShuffledData(days) {
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < days.length; i++) {
    let numNastyNeighbours = 0;

    DIRECTIONS.forEach((direction) => {
      if (
        // eslint-disable-next-line no-use-before-define
        shouldCheckInThisDirection(i)[direction]() &&
        // eslint-disable-next-line no-use-before-define
        hasNastyNeighbour(i, direction, days)
      ) {
        // eslint-disable-next-line no-plusplus
        numNastyNeighbours++;
      }
    });

    // eslint-disable-next-line no-param-reassign
    days[i].numNastyNeighbours = numNastyNeighbours;

    // eslint-disable-next-line no-param-reassign
    days[i].id = i;
    // days[i].checked = false; // TODO fix this, move or change the name of this function which already has a really long name!.
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

// Used in gameReducer 'SHUFFLE'.
export function sliceNumDaysInAGameConst(arr) {
  return arr.slice(0, NUM_DAYS_IN_GAME);
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

export function formatDates(arr) {
  return arr.map((item) => {
    item.date = sweeperDate(item.date);
    return item;
  });
}

export function setCheckedToFalse(arr) {
  return arr.map((day) => {
    day.checked = false;
    return day;
  });
}
export function setCheckedToTrue(arr) {
  return arr.map((day) => {
    day.checked = true;
    return day;
  });
}

export function checkGameOver(copy) {
  // over success if... game is true & all dry are checked?
  const numDryDaysUnchecked = copy.filter((day) => day.rain === 0);
  const maybeOver = numDryDaysUnchecked.filter((dryDay) => !dryDay.checked);

  if (!maybeOver.length) {
    return true;
  }
  return false;
}

export function setCulprit(arr, culpritId) {
  return arr.map((item) => {
    if (item.id === culpritId) {
      return {
        ...item,
        culprit: true,
      };
    }
    return item;
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
function sweeperDate(string) {
  // string from api will be in format "05-mar-2010".
  // function will return "5 Mar '10".
  const d = new Date(string);
  const year = d.getFullYear().toString().substring(2, 4); // "19"
  const month = d.toLocaleString('default', { month: 'long' }).substring(4, 7); // "Jan"
  const day = d.getDate();
  return `${day} ${month} '${year}`;
}
