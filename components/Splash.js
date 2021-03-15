import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { colors } from '../consts';

export default function Splash({ win, numWet, rain, date, roll }) {
   let msg = '';
   if( roll === 4) {
  
    msg = '😎🌂'

  // 5. get two spare umbrellas every 10 rounds.
  }else if(roll > 0 && roll % 10 === 0){
    msg ='😎🌂🌂'
  }

  return win ? (
    <View style={styles.splash}>
      <Text style={styles.emoji}>{msg === '' ? '😎' : msg}</Text>
      <Text style={styles.text2}>You avoided {numWet} rainy days</Text>
      
    </View>
  ) : (
    <View style={styles.splash}>
      <Text style={styles.text1}>Game Over</Text>
      <Text style={{ fontSize: 64 }}>☔</Text>
      <Text style={styles.text2}>
        There was {rain}mm of rain on {date}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  splash: {
    backgroundColor: colors.black,
    height: '100%',
    width: Dimensions.get('window').width,
    position: 'absolute',
    zIndex: 9,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text1: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  text2: { color: colors.orange, fontSize: 16, fontWeight: 'bold' },
  emoji: { fontSize: 32, margin: 20 },
});
