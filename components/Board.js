import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useRef,
  useContext
} from 'react';


import { useSettings } from '../contexts/settingsContext';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';

import GameInfo from './GameInfo';
import Tile from './Tile';
import Loading from './Loading';
import Error from './Error';
import Splash from './Splash';
import {
  prepData,
  fetchData,
  shouldCheckInThisDirection,
  getNeighbourToThe,
  checkGameOver,
  setCulprit,
} from '../util';

import {
  colors,
  NUM_DAYS_IN_ROW,
  NUM_DAYS_IN_GAME,
  DIRECTIONS,
} from '../consts';

import gameReducer from '../reducers/gameReducer';

// NOTE: culprit is now saved in two places. on realData.culprit as well as realData.data[i].culprit
// NOTE: Date in the format 10 May '19 should be set initially in FETCH not individually everytime it's rendered.

export default function Board() {
  /**
   *
   * When a <Dry> day is clicked, it's tricky to check neighbouring days and manage re-renders. Push all neighbours to be checked/revealed in here and update state all at once.
   *
   */
  const KEEP_TRACK = [];

  const initialState = {
    roll: 0,
    score: 0,
    loading: true,
    error: '',
    culprit: null,
    allData: [], // all data shuffled & with numNastyNeighbours- ratio is 1:5 wet:dry
    data: [], // game data, .length === NUM_DAYS_IN_GAME
    numWet: undefined,
    numLives: 3,
  };

  const [realData, dispatch] = useReducer(gameReducer, initialState);

  const {settings, settingsDispatch } = useSettings();
 


  const [newGame, setNewGame] = useState(undefined);
  const [gameOver, setGameOver] = useState(true);

  const [win, setWin] = useState(undefined);
  const [showSplash, setShowSplash] = useState(false);
  const splashTimer = useRef(null);
  const [betweenRounds, setBetweenRounds] = useState(false);
  // const [numWet, setNumWet] = useState(null);
  const { numWet, numLives } = realData;
  const go = useCallback(async function load() {
    try {
      let station = settings.selectedStation ? settings.selectedStation : 'ATHENRY';
      const allData = await fetchData(station);

      dispatch({ type: 'SET_FETCHED_DATA', error: '', payload: allData });
    } catch (err) {
      console.log(err);
      dispatch({ type: 'FETCH_ERROR', error: 'Error fetching data' });
    }
  }, []);

  // Fetch data manually. In the case of no internet when the app loads, this can be called from the error component.
  function tryAgain() {
    dispatch({ type: 'FETCHING', error: '', loading: true });
    go();
  }

  // Fetch data on load
  useEffect(() => {
    dispatch({ type: 'FETCHING', error: '', loading: true });
    go();
  }, []);

  // Starting new round (or new Game)
  useEffect(() => {
    if (!newGame) return;

    setGameOver(false);
    setWin(false);
    dispatch({ type: 'SHUFFLE' });
    dispatch({ type: 'CALC_WET_DAYS' });
    setNewGame(false);
  }, [newGame, setWin]);

  // Starting New Game (not just new round)
  useEffect(() => {
    /*
    win === undefined means first round
    win === true means new round
    win === false means new Game/new round
    */

    if (!newGame) return;

    if (win) return;
    dispatch({ type: 'RESET_ROLL' });
    dispatch({ type: 'RESET SCORE' });
    dispatch({ type: 'NUM_LIVES', payload: 3 });
  }, [newGame, setWin, win]);

  // timeout to hide splash set in handle LOSE game
  useEffect(() => {
    if (!showSplash || win) return;

    // Remove you lost splash after 3 seconds.
    splashTimer.current = setTimeout(() => setShowSplash(false), 3000);

    // Clean up setTimeout.
    return function cleanup() {
      if (splashTimer.current) {
        clearTimeout(splashTimer.current);
        splashTimer.current = null;
      }
    };
  }, [showSplash, setShowSplash, win]);

  // Between Rounds.
  useEffect(() => {
    if (!betweenRounds) return;
    if (!gameOver) return;
    if (!win) return;

    // 1. Update numLives (for round 5 & %10 === 0)
    dispatch({ type: 'UPDATE_NUM_LIVES' });

    // 2. Increment round.
    dispatch({ type: 'INCREMENT_ROLL' });

    // 3. Increment score.
    dispatch({ type: 'SCORE', numWet });

    // 4. Show 'between rounds' splash.
    setShowSplash(true);

    // 5. Stop this from happening more than once between every round.
    setBetweenRounds(false);

    // Clean up timeout.
    return function cleanup() {
      if (splashTimer.current) {
        clearTimeout(splashTimer.current);
      }
    };
  }, [betweenRounds, gameOver, win, setShowSplash, setBetweenRounds, numWet]);

  // Reveal all tiles on game over.
  useEffect(() => {
    if (!gameOver) return;

    // Reveal all tiles by setting all realData.data.checked = true.
    dispatch({ type: 'REVEAL_ALL' });
  }, [gameOver]);

  // Check if game should be over. This is for successful scenario. <Wet/> sets setGame(false) if a rainy day is clicked.
  useEffect(() => {
    if (gameOver) return;

    // Check if game should be over (ie. all dry days checked).
    const isGameOver = checkGameOver(realData.data);
    if (isGameOver) {
      setGameOver(true);
      setWin(true);
      setBetweenRounds(true);
    }
  }, [setGameOver, gameOver, realData.data, setWin]);

  //#endregion

  //#region handlers
  function handleWetClick(data) {
    // This function only gets called when numLives === 0 so setGameOver immediately.
    setGameOver(true);

    // Set which day done it.
    const badDay = data.id;

    // Show splash. 'Game Over' splash will show because win has not been set to true.
    setShowSplash(true);

    // Map data and add a .culprit = true to the day that lost the game.
    const updated = setCulprit(realData.data, badDay);

    // Update state. Set realData.data[badDay].culprit = true.
    dispatch({ type: 'CHECK_TILE', payload: updated });

    // Update state. Also set realData.culprit = badDay.
    dispatch({ type: 'CULPRIT', payload: badDay });
  }

  function doTheUpdate() {
    // Update state with KEEP_TRACK. Set clicked <Dry/> to checked as well as any of it's neighbours.
    const copy = realData.data;
    const updated = copy.map((item) => {
      if (KEEP_TRACK.includes(item.id)) {
        return {
          ...item,
          checked: true,
        };
      }
      return item;
    });
    dispatch({ type: 'CHECK_TILE', payload: updated });
  }

  function handleDryClick(datum) {
    const isChecked = KEEP_TRACK.filter((w) => w === datum.id);

    // Return if this day has already been checked.
    if (isChecked.length) return;

    const numNastyNeighbours = realData.data[datum.id].numNastyNeighbours;

    // If this day has MORE than ZERO rainy days (bombs) surrounding it, push it into KEEP_TRACK so it won't get checked again. Then update state and return.
    if (numNastyNeighbours !== 0) {
      KEEP_TRACK.push(datum.id);

      doTheUpdate(KEEP_TRACK);
      return;
    }

    // If this day has ZERO rainy days surrounding it, also push it into KEEP_TRACK so it won't get checked again. Also send it to checkNeighbour() to 'click' on it's surrounding days.
    KEEP_TRACK.push(datum.id);
    checkNeighbour(datum);

    // If we get to here, the original day that was clicked on & all it's relevant neighbours are in KEEP_TRACK array.
    doTheUpdate(KEEP_TRACK);

    function checkNeighbour(datum) {
      // Find days in each direction, 'click' on them.
      for (const direction of DIRECTIONS) {
        if (shouldCheckInThisDirection(datum.id)[direction]()) {
          const thisOne = getNeighbourToThe(
            datum.id,
            direction,
            NUM_DAYS_IN_GAME,
            NUM_DAYS_IN_ROW
          );

          handleDryClick(realData.data[thisOne]);
        }
      }
    }
  }
  //#endregion handlers
  function renderTiles(data) {
    return (
      <Tile
        key={data.id}
        itemData={data.item}
        handleWetClick={handleWetClick}
        handleDryClick={handleDryClick}
        gameOver={gameOver}
        numLives={numLives}
        setNumLives={(pay) => dispatch({ type: 'NUM_LIVES', payload: pay })}
      />
    );
  }

  return (
    <View style={styles.boardWrap}>
      {showSplash && win && (
        <Splash
          numWet={numWet}
          win={win}
          roll={realData.roll}
          setShowSplash={setShowSplash}
          setNewGame={setNewGame}
        />
      )}
      {showSplash && !win && (
        <Splash
          win={win}
          roll={realData.roll}
          rain={realData?.data[realData.culprit]?.rain}
          date={realData?.data[realData.culprit]?.date}
        />
      )}

      <GameInfo
        style={styles.gameInfo}
        score={realData.score}
        gameOver={gameOver}
        setNewGame={setNewGame}
        newGame={newGame}
        win={win}
        roll={realData.roll}
        numLives={numLives}
        error={realData.error}
        loading={realData.loading}
      />

      <View style={styles.board}>
        {!!realData.data &&
        !!realData.data.length &&
        typeof win === 'boolean' ? (
          <FlatList
            style={styles.boardBg}
            data={realData.data.slice(0, NUM_DAYS_IN_GAME)}
            renderItem={renderTiles}
            numColumns={NUM_DAYS_IN_ROW}
            key={(item) => item.date}
          />
        ) : !realData.loading && realData.error !== '' ? (
          <Error msg={realData.error} tryAgain={tryAgain} />
        ) : realData.loading ? (
          <Loading />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boardWrap: {
    flex: 1,
    backgroundColor: colors.black,
    padding: 8,
  },
  board: {
    flex: 6,
    minHeight: Dimensions.get('window').width,
  },
});
