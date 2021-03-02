import React, { useState, useEffect, useReducer } from 'react';
import { View, StyleSheet, FlatList, Dimensions } from 'react-native';

import GameInfo from './GameInfo';
import Tile from './Tile';
import Loading from './Loading';
import Error from './Error';

import {
  fetchData,
  shouldCheckInThisDirection,
  getNeighbourToThe,
  setCheckedToTrue,
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
export default function Board() {
  /**
   *
   * When a <Dry> day is clicked, it's tricky to check neighbouring days and manage re-renders. Push all neighbours to be checked/revealed in here and update state all at once.
   *
   */
  const KEEP_TRACK = [];

  const initialState = {
    loading: true,
    error: '',
    allData: [], // all data shuffled & with numNastyNeighbours- ration is 1:5 wet:dry
    data: [], // game data, .length === NUM_DAYS_IN_GAME
  };

  const [realData, dispatch] = useReducer(gameReducer, initialState);
  const [newGame, setNewGame] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  // Fetch data on load
  useEffect(() => {
    async function go() {
      try {
        const allData = await fetchData();
        dispatch({ type: 'FETCH', error: '', payload: allData });
      } catch (err) {
        console.log(err);
        dispatch({ type: 'FETCH_ERROR', error: 'Error fetching data' });
      }
    }
    go();
  }, []);

  // Shuffle when newGame changes.
  useEffect(() => {
    if (!newGame) return;
    setGameOver(false); // okay?
    setWin(false);
    dispatch({ type: 'SHUFFLE', payload: realData.allData });

    setNewGame(false);
  }, [newGame]);

  // Reveal all tiles on game over.
  useEffect(() => {
    if (!gameOver) return;

    // Set all realData.data.checked = true.
    const revealed = setCheckedToTrue(realData.data);

    dispatch({ type: 'REVEAL_ALL', payload: revealed });
  }, [gameOver]);

  // Check if game should be over. This is for successful scenario. <Wet/> sets setGame(false) if a rainy day is clicked.
  useEffect(() => {
    if (gameOver) return;

    const isGameOver = checkGameOver(realData.data);
    if (isGameOver) {
      setGameOver(true);
      setWin(true);
    }
  }, [setGameOver, gameOver, realData.data, setWin]);

  function renderTile(itemData) {
    return (
      <Tile
        itemData={itemData}
        handleWetClick={handleWetClick}
        handleDryClick={handleDryClick}
        gameOver={gameOver}
      />
    );
  }

  function handleWetClick(data) {
    setGameOver(true);

    // set which day done it...
    const badDay = data.id;

    // map data and add a .culprit = true to the day that lost the game.
    const updated = setCulprit(realData.data, badDay);

    dispatch({ type: 'CHECK_TILE', payload: updated });
  }

  function doTheUpdate() {
    // update state with KEEP_TRACK. Set clicked <Dry/> to checked as well as any of it's neighbours.
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

    // return if this day has already been checked
    if (isChecked.length) return;

    const numNastyNeighbours = realData.data[datum.id].numNastyNeighbours;

    // if this day has MORE than ZERO rainy days (bombs) surrounding it, push it into KEEP_TRACK so it won't get checked again. Then update state and return.
    if (numNastyNeighbours !== 0) {
      KEEP_TRACK.push(datum.id);

      doTheUpdate(KEEP_TRACK);
      return;
    }

    // if this day has ZERO rainy days surrounding it, also push it into KEEP_TRACK so it won't get checked again. Also send it to checkNeighbour() to 'click' on it's surrounding days.
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

  return (
    <View style={styles.boardWrap}>
      <GameInfo
        style={styles.gameInfo}
        gameOver={gameOver}
        setNewGame={setNewGame}
        win={win}
      />

      <View style={styles.board}>
        {!!realData.data && !!realData.data.length ? (
          <FlatList
            style={styles.boardBg}
            data={realData.data.slice(0, NUM_DAYS_IN_GAME)}
            renderItem={renderTile}
            numColumns={NUM_DAYS_IN_ROW}
            key={(item, index) => item.date}
          />
        ) : !realData.loading && realData.error.msg !== '' ? (
          <Error msg={realData.error} />
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
