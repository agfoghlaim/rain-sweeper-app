import React from 'react';
import { Text } from 'react-native';
import { colors } from '../consts';

function decideColor(numNastyNeighbours) {
  if (numNastyNeighbours === 0) {
    return colors.orange;
  }

  if (numNastyNeighbours === 1) {
    return colors.green;
  }

  if (numNastyNeighbours === 2) {
    return colors.blue;
  }
  return colors.red;
}

export default function Nasties({ numNastyNeighbours }) {
  const color = {
    color: decideColor(numNastyNeighbours),
  };

  return (
    <Text style={{ ...color, fontWeight: 'bold' }}>{numNastyNeighbours}</Text>
  );
}
