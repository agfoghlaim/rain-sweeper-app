import React from 'react';

import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../consts';

export default function Error({msg}) {

  return (
    <View style={styles.loadingWrap}>
      <Text style={styles.emoji} >🤔</Text>
			<Text style={styles.text}>{msg}...</Text>
    </View>
  );
}

const styles = StyleSheet.create({

	loadingWrap: {
		flex: 1,
		justifyContent: 'center', 
		alignItems: 'center'
	},
	emoji: {
		fontSize: 20
	},
	text: {
		fontSize: 16,
		color: colors.red
	}
});
