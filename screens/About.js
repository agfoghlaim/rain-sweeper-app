import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../consts';

export default function AboutScreen() {
  return (
    <View style={styles.aboutScreenWrap}>
      {/* <Text style={styles.heading}>About</Text> */}
      <Text style={styles.text}>
        Galway RainSweeper is something like Minesweeper except instead of mines
        there are rainy days and instead of flags there are umbrellas. The game
        uses real Met Éireann data. 
      </Text>
			<Text style={styles.text}>
			You get
        three spare umbrellas for every game, these open automatically if you
        choose a rainy day. You can add/remove your own umbrellas by long pressing. The more rounds you clear the more spare
        umbrellas you can collect.
			</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  aboutScreenWrap: {
    flex: 1,
    width: '100%',
		backgroundColor: colors.black,
		padding: 16,
		justifyContent: 'center'
  },
	// heading: {
	// 	color: colors.white,
	// 	fontSize: 24,
	// 	fontWeight: 'bold',
	// 	marginBottom: 18
	// },
	text: {
		color: colors.white,
		marginBottom: 8,
		fontSize: 16,
		lineHeight: 24,
		fontFamily: 'monospace'
	}
});
