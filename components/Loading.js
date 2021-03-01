import React from 'react';

import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../consts';

export default function Loading() {
  return (
    <View style={styles.loadingWrap}>
      <ActivityIndicator size="large" color={colors.orange} />
    </View>
  );
}

const styles = StyleSheet.create({

	loadingWrap: {
		flex: 1,
		justifyContent: 'center', 
		alignItems: 'center'
	}
});
