import React from 'react'
import {
  Text
} from 'react-native';
import { colors } from '../consts';

export default function Nasties({numNastyNeighbours}){

	const color = {
		color: 	numNastyNeighbours === 0
			? colors.orange
			: numNastyNeighbours === 1
			? colors.green
			: numNastyNeighbours === 2
			? colors.blue
			: colors.red
	}
	return(
		<Text style={{...color}}>{numNastyNeighbours}</Text>
	)
};






