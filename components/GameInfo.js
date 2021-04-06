import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Animated } from 'react-native';

import { colors } from '../consts';

export default function GameInfo({
  gameOver,
  newGame,
  score,
  setNewGame,
  win,
  roll,
  numLives,
  error,
  loading,
  selectedStation
}) {
  const initialScale = useState(new Animated.Value(1))[0];

  function drawAttentionToNextRoundButton() {
    Animated.loop(
      Animated.spring(initialScale, {
        toValue: 1.02,
        friction: 1,
        tension: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }

  const lives = useRef(null);
  useEffect(() => {
    if (!gameOver) return;

    if (win) {
      drawAttentionToNextRoundButton();
    }
  }, [gameOver]);
  
  useEffect(()=> {
    if(gameOver) return;
    lives.current = numLives;
  },[gameOver])
  //////////////////////////
  
  const [emoji, setEmoji] = useState({ emoji: '🤔', desc: 'thinking emoji' });
  useEffect(() => {

    if (!numLives) return;

    if (numLives < lives.current) {

      setEmoji({ emoji: '🙄', desc: 'eyeroll emoji' });

      const timer = setTimeout(
        () => setEmoji({ emoji: '🤔', desc: 'thinking emoji' }),
        300
      );

      // Clean up setTimeout.
      return function cleanup() {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }
  }, [numLives, lives, gameOver]);


  function decideEmoji() {
    if (gameOver && typeof newGame === 'undefined') {
      return {
        emoji: '😴',
        desc: 'sleeping emoji',
      };
    } else if (!gameOver && typeof newGame === 'boolean') {
      return emoji;
    } else if (win && gameOver && typeof newGame === 'boolean') {
      return { emoji: '😀', desc: 'grinning emoji' };
    } else if (
      typeof newGame === 'boolean' &&
      typeof win === 'boolean' &&
      gameOver
    ) {
      return { emoji: '😒', desc: 'sad emoji' };
    } else {
      return '';
    }
  }

  return (
    <View style={styles.gameInfo}>
      <Text style={styles.station}>{selectedStation}</Text>
      <Text style={styles.score}>Score: {score}</Text>
      <Text style={{ fontSize: 32 }}> {decideEmoji().emoji}</Text>

      {!gameOver ? (
        <>
          <Text style={styles.umbrellas}>
            {numLives < 4 && numLives > 0
              ? Array.from(Array(numLives)).map(() => '🌂')
              : numLives === 0
              ? '⚠️'
              : numLives
              ? `🌂 x ${numLives}`
              : ''}
          </Text>
          <Text style={styles.round}>Round: {roll + 1}</Text>
        </>
      ) : (
        <Animated.View
          style={{
            transform: [
              { scale: initialScale },
              { perspective: 1000 }, // react native docs says: without this line this Animation will not render on Android while working fine on iOS
            ],
          }}
        >
          <Button
            color={colors.black}
            accessibilityLabel={win ? 'Next Round' : 'New Game'}
            disabled={Boolean(error) || loading}
            title={win ? 'Next Round' : 'New Game'}
            onPress={() => {
              setNewGame(true);
            }}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  gameInfo: {

    position: 'relative',
    //  flex: 1,
     minHeight: 64,
    padding: 16,
    // backgroundColor: colors.red,
    marginHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    
    borderWidth: 2,
    borderRightColor: colors.white,
    borderBottomColor: colors.white,
    borderLeftColor: colors.darkGray,
    borderTopColor: colors.darkGray,
    // marginVertical: 16,
    // marginTop: 48,
    borderRadius: 4,
    // borderBottomColor: colors.black,
    // borderWidth: 8,
    // borderTopWidth: 0,
    // borderLeftWidth: 0,
    // borderRightWidth: 0,
  },
  score: {
    fontFamily: 'monospace',
    fontWeight: '600',
    fontSize: 14,
    color: colors.red,
    backgroundColor: colors.white,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  round: {
    fontFamily: 'monospace',
    fontWeight: '600',
    fontSize: 14,
    color: colors.white,
    backgroundColor: colors.red,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  station: {
    fontFamily: 'monospace',
    fontWeight: '500',
    fontSize: 8,
    top: -2,
    left: -2,
    color: colors.black,
    position: 'absolute',
    backgroundColor: colors.orange,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,

  },
});
