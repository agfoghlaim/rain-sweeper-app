import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors } from '../consts';

export default function Header({title}) {

	return (
		<View style={styles.header}>
			<Text style={styles.headerText}>{title}</Text>
		</View>
	)

}

const styles = StyleSheet.create({
	header: {
		backgroundColor:colors.orange,
		height: 112,
		width: '100%',
		paddingTop: 48,
		alignItems: 'center',
		justifyContent: 'center'
	},
	headerText: {
		color: colors.black,
		fontSize: 18,
		fontWeight: '700',
		letterSpacing: 0.75,
	}
});