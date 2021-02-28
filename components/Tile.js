import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../consts';

export default function Tile({ itemData }) {
  return (
    <TouchableOpacity
      style={styles.tile}
      onPress={() => console.log('do something')}
    >
      <View>
        <Text style={styles.tileDate}>{itemData.item.date}</Text>
        <Text style={styles.tileMM}>{itemData.item.rain}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    height: (Dimensions.get('window').width - 7 - 32) / 8, // this is right for a square? find what padding/margin is involved
    margin: 1,
    backgroundColor: colors.blue,
    borderRadius: 2,
    shadowColor: colors.black,
    elevation: 10,
    padding: 4,
  },
  tileDate: {
    fontSize: 10,
  },
  tileMM: {
    color: colors.black,
    fontWeight: '500',
    fontSize: 10,
    backgroundColor: colors.lightBlue,
    borderRadius: 1,
  },
});
