import React, { useState, useEffect, useReducer } from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import Tile from './Tile';


import {
  fetchData,
  shouldCheckInThisDirection,
  getNeighbourToThe,
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
    data: [],
  };

  const [realData, dispatch] = useReducer(gameReducer, initialState);
  const [newGame, setNewGame] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    async function go() {
      try {
        const theAns = await fetchData();

        dispatch({ type: 'FETCH', error: '', payload: theAns });
        setNewGame(false);
      } catch (err) {
        console.log(err);
        dispatch({ type: 'FETCH_ERROR', error: 'Error fetching data' });
        setNewGame(false);
      }
    }
    go();
  }, []);

  // Shuffle when newGame changes.
  useEffect(() => {
    if (!newGame) return;
    setGameOver(false); // okay?
    dispatch({ type: 'SHUFFLE', payload: realData.data });

    setNewGame(false);
  }, [newGame]);

  useEffect(()=>{
    if(!gameOver) return;
    // if it's game over, set the culprit(not here), set all to checked.
  }, [gameOver])

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

    const copy = realData.data;
    const updated = copy.map((item) => {
      if (item.id === badDay) {
        return {
          ...item,
          culprit: true,
        };
      }
      return item;
    });
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
      // DIRECTIONS.forEach((direction) => {
      //   if (shouldCheckInThisDirection(datum.id)[direction]()) {
      //     const thisOne = getNeighbourToThe(
      //       datum.id,
      //       direction,
      //       NUM_DAYS_IN_GAME,
      //       NUM_DAYS_IN_ROW
      //     );
      //     handleDryClick(realData.data[thisOne]);
      //   }
      // });
    }
  }

  return (
    <View styles={styles.board}>
      <Button title="press" onPress={() => setNewGame(true)} />
      <Text>{gameOver ? 'game over' : 'game on'}</Text>
      {!!realData.data && !!realData.data.length && (
        <FlatList
          style={{ backgroundColor: colors.gray, padding: 8, borderRadius: 4 }}
          data={realData.data.slice(0, 64)}
          renderItem={renderTile}
          numColumns={8}
          key={(item, index) => item.date}
        />
      )}
      {!!realData.error && <Text>Error: {realData.error}</Text>}
      {!!realData.loading && <Text>Loading...</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    flex: 1,
    // backgroundColor: 'red',
    padding: 8,
    flexWrap: 'wrap',
    width: '100%',
  },
});
