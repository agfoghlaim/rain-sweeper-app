import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
// import useLatestWeather from '../hooks/useLatestWeather';
import { colors } from '../consts';
import Board from '../components/Board';
export default function GameScreen() {
  //const weather = useLatestWeather();
  return (
    <View style={styles.gameScreenWrap}>
      <View style={styles.topWrap}>
        <Text style={{ color: '#fff' }}>Emoji Here</Text>
        {/* <Text style={{color: '#fff'}}>{weather.weather_text}</Text> */}
        <Button style={styles.btn} title="New Game" />
      </View>
      <View style={styles.gameWrap}>
        <Text style={{ color: '#fff' }}>Hi</Text>
    
        <Board />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gameScreenWrap: {
    backgroundColor: colors.white,
    flex: 1,
    padding: 8,
    alignItems: 'center',
    width: '100%',
  },
  topWrap: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //minHeight: '20%' // game takes as much as possible but min of 20%,
  },
  gameWrap: {
    flex: 5, // 5 times more space than .topWrap
    //  alignItems: 'center',
    
    // backgroundColor: 'lightgreen',
    width: '100%',
    //  justifyContent:'center'
  },
  btn: {
    width: 400,
  },
});
