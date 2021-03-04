import React, { useState, useEffect } from 'react';

import {
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Animated,
} from 'react-native';

import { colors, NUM_DAYS_IN_ROW } from '../consts';

export default function Umbrella({}) {
	const initialScale = useState(new Animated.Value(4))[0];
  
	useEffect(()=>{
		feedBackWhenUmbrellaAdded();
	},[])
  function feedBackWhenUmbrellaAdded() {
    Animated.spring(initialScale, {
      toValue: 1,
      friction: 4,
      tension: 4,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }
	return (
		<Animated.View
		style={{
			transform: [
				{ scale: initialScale },
				{ perspective: 1000 }, // react native docs says: without this line this Animation will not render on Android while working fine on iOS
			],
		}}
	>
		<Text>☂️</Text>
	</Animated.View>
	)
}