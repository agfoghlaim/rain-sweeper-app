import React, { useState, useEffect, useReducer } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button
} from 'react-native';
import {fetchData} from '../util';
import Tile from './Tile';
import { colors } from '../consts';
import gameReducer from '../reducers/gameReducer';
export default function Board() {


  const initialState = {
    loading: true,
    error: '',
    data: [],
  };

  const [realData, dispatch] = useReducer(gameReducer, initialState);
  const [newGame, setNewGame] = useState(false);

  useEffect(()=>{
    async function go(){
      try{

        const theAns = await fetchData();
   
        dispatch({ type: 'FETCH', error: '', payload: theAns });
        setNewGame(false);
      } catch(err) {
        console.log(err)
        dispatch({ type: 'FETCH_ERROR', error: 'Error fetching data' });
        setNewGame(false);
      }
    }
     go();
  }, [])

  // Shuffle when newGame changes.
  useEffect(() => {
    if(!newGame) return;

    dispatch({type: 'SHUFFLE', payload: realData.data});

    setNewGame(false);
  }, [newGame]);

  function renderTile(itemData) {
    return <Tile itemData={itemData} />;
  }

  return (
    <View styles={styles.board}>
      <Button title="press" onPress={() => setNewGame(true)} />
      {realData.data && realData.data.length && (
        <FlatList
          style={{ backgroundColor: colors.gray, padding: 16, borderRadius: 4 }}
          data={realData.data.slice(0, 64)}
          renderItem={renderTile}
          numColumns={8}
          key={(item, index) => item.date}
        />
      )}
      {
        realData.error && <Text>Error: {realData.error}</Text>
      }
      {
        realData.loading && <Text>Loading...</Text>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    flex: 1,
    backgroundColor: 'red',
    padding: 16,
    flexWrap: 'wrap',
    width: '100%',
  },
});
