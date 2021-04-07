import React, { useState, useEffect, useCallback, useRef } from 'react';

import { View, StyleSheet, FlatList, Dimensions } from 'react-native';
import { useSettings } from '../contexts/settingsContext';
import { useGame } from '../contexts/gameContext';

import GameInfo from './GameInfo';
import Tile from './Tile';
import Loading from './Loading';
import Error from './Error';
import Splash from './Splash';
import {
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

/*
NOTE: culprit is now saved in two places. on realData.culprit as well as realData.data[i].culprit
*/

export default function Board() {
  /*
  When a <Dry> day is clicked, it's tricky to check neighbouring days and manage re-renders.
  Push all neighbours to be checked/revealed in here and update state all at once.
   */
  const KEEP_TRACK = [];

  const { settings, settingsDispatch } = useSettings();
  const { selectedStation, stationChanged, prevStation } = settings;

  const { realData, dispatch } = useGame();
  const { numWet, numLives } = realData;

  const [newGame, setNewGame] = useState(undefined);
  const [gameOver, setGameOver] = useState(true);
  const [win, setWin] = useState(undefined);
  const [showSplash, setShowSplash] = useState(false);
  const [betweenRounds, setBetweenRounds] = useState(false);
  const [umbrellasUsed, setUmbrellasUsed] = useState(0);
  const splashTimer = useRef(null);

  const go = useCallback(async () => {
    try {
      const allData = await fetchData(selectedStation);

      if (!allData || allData.error) {
        dispatch({ type: 'FETCH_ERROR', error: 'Error fetching data' });

        return;
      }

      dispatch({ type: 'SET_FETCHED_DATA', error: '', payload: allData });
    } catch (err) {
      console.error(err);
      dispatch({ type: 'FETCH_ERROR', error: 'Error fetching data' });
    }
  }, [dispatch, selectedStation]);

  // Fetch data manually. In the case of no internet when the app loads, this can be called from the error component.
  function tryAgain() {
    dispatch({ type: 'FETCHING', error: '', loading: true });
    go();
  }

  // #region useEffects

  // Fetch data on load
  useEffect(() => {
    dispatch({ type: 'FETCHING', error: '', loading: true });
    go();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Starting New Game (not just new round)... this should now happen whenever selectedStation is changed
  useEffect(() => {
    if (!newGame) return;
    if (win) return;
    dispatch({ type: 'RESET_ROLL' });
    dispatch({ type: 'RESET SCORE' });
    dispatch({ type: 'NUM_LIVES', payload: 3 });

    if (stationChanged) {
      settingsDispatch({ type: 'SET_STATION_CHANGED', payload: false });
    }
  }, [newGame, setWin, win, dispatch, stationChanged, settingsDispatch]);

  // Starting new round (or new Game)
  useEffect(() => {
    if (!newGame) return;

    setGameOver(false);
    setWin(false);

    dispatch({ type: 'SHUFFLE' });
    dispatch({ type: 'CALC_WET_DAYS' });
    setShowSplash(false);
    setNewGame(false);
  }, [newGame, setGameOver, setWin, prevStation, dispatch, setNewGame]);

  // For every new game, reset umbrellasUsed.
  useEffect(() => {
    setUmbrellasUsed(0);
  }, [newGame]);

  useEffect(() => {
    if (!stationChanged) return;
    function endGame() {
      // This function only gets called when numLives === 0 so setGameOver immediately.
      setGameOver(true);
      setWin(false);
      setShowSplash(false);
      dispatch({ type: 'RESET_SCORE' });
    }
    endGame();
  }, [stationChanged, dispatch]);

  // timeout to hide splash set in handle LOSE game
  useEffect(() => {
    if (!showSplash || win) return undefined;

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
    if (!betweenRounds) return undefined;
    if (!gameOver) return undefined;
    if (!win) return undefined;

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
  }, [betweenRounds, gameOver, win, numWet, dispatch]);

  // Reveal all tiles on game over.
  useEffect(() => {
    if (!gameOver) return;

    // Reveal all tiles by setting all realData.data.checked = true.
    dispatch({ type: 'REVEAL_ALL' });
  }, [gameOver, dispatch]);

  // Check if game should be over. This is for successful scenario. <Wet/> sets setGame(false) if a rainy day is clicked.
  useEffect(() => {
    if (gameOver) return;

    // Check if round should be over (ie. all dry days checked).
    const isRoundOver = checkGameOver(realData.data);
    if (isRoundOver) {
      setGameOver(true);
      setWin(true);
      setBetweenRounds(true);
    }
  }, [setGameOver, gameOver, realData.data, setWin, settingsDispatch]);

  // #endregion

  // #region handlers
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

    const { numNastyNeighbours } = realData.data[datum.id];
    // If this day has MORE than ZERO rainy days (bombs) surrounding it, push it into KEEP_TRACK so it won't get checked again. Then update state and return.
    if (numNastyNeighbours !== 0) {
      KEEP_TRACK.push(datum.id);

      doTheUpdate(KEEP_TRACK);
      return;
    }

    // If this day has ZERO rainy days surrounding it, also push it into KEEP_TRACK so it won't get checked again. Also send it to checkNeighbour() to 'click' on it's surrounding days.
    KEEP_TRACK.push(datum.id);

    // eslint-disable-next-line no-use-before-define
    checkNeighbour(datum);

    // If we get to here, the original day that was clicked on & all it's relevant neighbours are in KEEP_TRACK array.
    doTheUpdate(KEEP_TRACK);

    // airbnb lint is freaking out because datum is named the same inside checkNeighbour scope (ignore it.)
    // eslint-disable-next-line no-shadow
    function checkNeighbour(datum) {
      // Find days in each direction, 'click' on them.

      // eslint-disable-next-line no-restricted-syntax
      for (const direction of DIRECTIONS) {
        if (shouldCheckInThisDirection(datum.id)[direction]()) {
          const thisOne = getNeighbourToThe(
            datum.id,
            direction,
            NUM_DAYS_IN_GAME,
            NUM_DAYS_IN_ROW,
          );

          handleDryClick(realData.data[thisOne]);
        }
      }
    }
  }

  // Either increment or decrement umbrellas used (from Wet/Dry Tile components).
  // GameInfo component needs this so it can calculate numWet vs umbrellasUsed.
  function handleSetUmbrellasUsed() {
    const currentUmbrellas = umbrellasUsed;
    return {
      decrement: () => setUmbrellasUsed(currentUmbrellas - 1),
      increment: () => setUmbrellasUsed(currentUmbrellas + 1),
    };
  }
  // #endregion handlers

  // #region render related functions

  // renderItem function for FlatList component
  function renderTiles(data) {
    return (
      <Tile
        key={data.id}
        itemData={data.item}
        handleWetClick={handleWetClick}
        handleDryClick={handleDryClick}
        gameOver={gameOver}
        numLives={numLives}
        handleSetUmbrellasUsed={handleSetUmbrellasUsed}
        setNumLives={(pay) => dispatch({ type: 'NUM_LIVES', payload: pay })}
      />
    );
  }

  // Render either the game, error or loading.
  function decideComponent() {
    if (
      realData.data &&
      realData.data.length &&
      typeof win === 'boolean' &&
      !stationChanged
    ) {
      return (
        <FlatList
          // eslint-disable-next-line no-use-before-define
          style={styles.boardBg}
          data={realData.data.slice(0, NUM_DAYS_IN_GAME)}
          renderItem={renderTiles}
          numColumns={NUM_DAYS_IN_ROW}
          key={(item) => item.date}
        />
      );
    }
    if (!realData.loading && realData.error !== '') {
      return <Error msg={realData.error} tryAgain={tryAgain} />;
    }
    if (realData.loading) {
      return <Loading />;
    }
    return null;
  }

  // #endregion

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
        selectedStation={selectedStation}
        score={realData.score}
        gameOver={gameOver}
        setNewGame={setNewGame}
        newGame={newGame}
        numWet={numWet}
        umbrellasUsed={umbrellasUsed}
        win={win}
        roll={realData.roll}
        numLives={numLives}
        error={realData.error}
        loading={realData.loading}
      />

      <View style={styles.board}>{decideComponent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  boardWrap: {
    backgroundColor: colors.gray,
    borderRadius: 4,
    marginHorizontal: 8,
    justifyContent: 'center',
    paddingTop: 20,
    marginVertical: 12,
  },
  board: {
    height: Dimensions.get('window').width + 6,
    borderWidth: 2,
    borderRightColor: colors.white,
    borderBottomColor: colors.white,
    borderLeftColor: colors.darkGray,
    borderTopColor: colors.darkGray,
    borderRadius: 4,
    marginHorizontal: 4,
    marginTop: 24,
    marginBottom: 24,
    padding: 4,
  },
  selectedStation: {
    justifyContent: 'flex-start',
    backgroundColor: colors.orange,
    padding: 8,
    borderRadius: 4,
    fontSize: 10,
    color: colors.black,
    fontFamily: 'monospace',
    elevation: 8,
  },
});
