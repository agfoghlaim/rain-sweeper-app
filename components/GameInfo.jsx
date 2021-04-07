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
  numWet,
  error,
  loading,
  selectedStation,
  umbrellasUsed,
}) {
  const initialScale = useState(new Animated.Value(1))[0];
  const [umbrellasVsWet, setUmbrellasVsWet] = useState(' ');
  const lives = useRef(null);
  useEffect(() => {
    function drawAttentionToNewGameButton() {
      Animated.loop(
        Animated.spring(initialScale, {
          toValue: 1.02,
          friction: 1,
          tension: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ).start();
    }

    drawAttentionToNewGameButton();
  }, [initialScale]);

  // Run once for every new game. Initialise umbrellasVsWet to numWet.
  useEffect(() => {
    const shouldBeNum = numWet;
    if (Number.isNaN(shouldBeNum)) {
      return;
    }
    setUmbrellasVsWet(shouldBeNum);
  }, [numWet, newGame]);

  useEffect(() => {
    if (gameOver) return;
    lives.current = numLives;

    // This should only happen once per game...
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver]);

  // Run when umbrella is added or removed in Wet/Dry Tile component or when numWet changes (ie. new game).
  useEffect(() => {
    const ans = numWet - umbrellasUsed;
    if (Number.isNaN(ans)) {
      return;
    }
    setUmbrellasVsWet(ans);
  }, [umbrellasUsed, numWet]);

  const [emoji, setEmoji] = useState({ emoji: '🤔', desc: 'thinking emoji' });
  useEffect(() => {
    if (!numLives) return undefined;

    if (numLives < lives.current) {
      setEmoji({ emoji: '🙄', desc: 'eyeroll emoji' });

      const timer = setTimeout(
        () => setEmoji({ emoji: '🤔', desc: 'thinking emoji' }),
        300,
      );

      // Clean up setTimeout.
      return function cleanup() {
        if (timer) {
          clearTimeout(timer);
        }
      };
    }
    return undefined;
  }, [numLives, lives, gameOver]);

  function decideEmoji() {
    if (gameOver && typeof newGame === 'undefined') {
      return {
        emoji: '😴',
        desc: 'sleeping emoji',
      };
    }
    if (!gameOver && typeof newGame === 'boolean') {
      return emoji;
    }
    if (win && gameOver && typeof newGame === 'boolean') {
      return { emoji: '😀', desc: 'grinning emoji' };
    }
    if (typeof newGame === 'boolean' && typeof win === 'boolean' && gameOver) {
      return { emoji: '😒', desc: 'sad emoji' };
    }
    return { emoji: '🤔', desc: 'thinking emoji' };
  }

  function renderNumLives() {
    if (numLives < 4 && numLives > 0) {
      return Array.from(Array(numLives)).map(() => '🌂');
    }
    if (numLives && numLives > 0) {
      return `🌂 x ${numLives}`;
    }
    if (numLives === 0) {
      return '⚠️';
    }

    return '';
  }

  return (
    <View style={styles.gameInfo}>
      <Text style={styles.station}>{selectedStation}</Text>
      <View style={styles.left}>
        <Text style={styles.numWet}>{umbrellasVsWet}</Text>
        <Text style={styles.score}>
          Score:
          {score}
        </Text>
      </View>

      <Text style={styles.faceEmoji}>{decideEmoji().emoji}</Text>

      {!gameOver ? (
        <View style={styles.right}>
          <Text style={styles.umbrellas}>{!gameOver && renderNumLives()}</Text>

          <Text style={styles.round}>
            Round:
            {roll + 1}
          </Text>
        </View>
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
    minHeight: 64,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderRightColor: colors.white,
    borderBottomColor: colors.white,
    borderLeftColor: colors.darkGray,
    borderTopColor: colors.darkGray,
    borderRadius: 4,
  },
  left: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },

  faceEmoji: {
    fontSize: 32,
    alignSelf: 'center',
    borderRightColor: colors.darkGray,
    borderBottomColor: colors.darkGray,
    borderLeftColor: colors.white,
    borderTopColor: colors.white,
    borderWidth: 2,
    borderRadius: 4,
    paddingLeft: 3,
  },
  umbrellas: {
    marginBottom: 4,
    backgroundColor: colors.white,
    alignSelf: 'flex-end',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: -4,
    color: colors.white,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    minWidth: 24,
  },
  score: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.white,
    backgroundColor: colors.purple,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  round: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.purple,
    backgroundColor: colors.white,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  station: {
    fontFamily: 'monospace',
    fontWeight: '500',
    fontSize: 8,
    top: -22,
    left: -6,
    color: colors.black,
    position: 'absolute',
    backgroundColor: colors.orange,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
  },
  numWet: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    letterSpacing: -2,
    alignSelf: 'flex-start',
    marginBottom: 4,
    color: colors.white,
    marginRight: 4,
    backgroundColor: colors.purple,
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    minWidth: 24,
  },
});
