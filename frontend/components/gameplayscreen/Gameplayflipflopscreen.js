import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, Animated } from 'react-native';
import Gameover from './Gameover';
import Gamewin from './Gamewin';
import { useNavigation } from '@react-navigation/native';
import { updatecoin, updatedCoinsonBackend } from '../../redux/features/coinSlice';
import { useSelector, useDispatch } from 'react-redux';

const CARD_VALUES = ['A', 'B']; // 2 unique values for a 2x2 grid

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const Gameplayflipflopscreen = () => {
  const dispatch = useDispatch();
  const coins = useSelector((state) => state.coin);
  const navigation = useNavigation();

  const [cards, setCards] = useState(() => {
    let cardValues = [...CARD_VALUES, ...CARD_VALUES]; // Duplicate values for pairs
    const shuffledCards = shuffleArray(cardValues);
    return shuffledCards.map((value) => ({
      value,
      flipped: false,
      matched: false,
    }));
  });

  const [flippedIndices, setFlippedIndices] = useState([]);
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [showIntro, setShowIntro] = useState(true);



  // Animated values for each card
  const flipAnimations = useRef(cards.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    let interval;
    if (!gameOver && !win && !showIntro) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev >= 59) {
            setGameOver(true);
            clearInterval(interval);
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [gameOver, win, showIntro]);

  // Reset the game
  const resetGame = useCallback(() => {
    setScore(0);
    let cardValues = [...CARD_VALUES, ...CARD_VALUES];
    const shuffledCards = shuffleArray(cardValues);
    const resetCards = shuffledCards.map((value) => ({
      value,
      flipped: false,
      matched: false,
    }));
    setCards(resetCards);
    setFlippedIndices([]);
    setMatches(0);
    setTimer(0);
    setGameOver(false);
    setWin(false);

    // Reset flip animations
    flipAnimations.forEach((anim) => anim.setValue(0));
  }, []);

  const flipCard = (index, toValue, callback) => {
    Animated.timing(flipAnimations[index], {
      toValue,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      if (callback) callback();
    });
  };

  const handleCardPress = (index) => {
    if (cards[index].flipped || cards[index].matched || flippedIndices.length === 2) {
      return;
    }

    // Flip the selected card
    flipCard(index, 1, () => {
      setCards((prevCards) =>
        prevCards.map((card, i) => (i === index ? { ...card, flipped: true } : card))
      );

      // Update the flipped indices
      setFlippedIndices((prevFlippedIndices) => [...prevFlippedIndices, index]);
    });
  };

  // useEffect to handle matching logic when two cards are flipped
  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.value === secondCard.value) {
        // Cards match
        setScore((prevScore) => prevScore + 10);
        setMatches((prevMatches) => {
          const newMatches = prevMatches + 1;
          if (newMatches === 2) {
            // 2 matches needed for a win in a 2x2 grid
            setWin(true);
            setGameOver(false);
          }
          return newMatches;
        });

        // Mark the matched cards
        setCards((prevCards) =>
          prevCards.map((card, i) =>
            i === firstIndex || i === secondIndex ? { ...card, matched: true } : card
          )
        );

        // Clear flipped indices
        setFlippedIndices([]);
      } else {
        // Cards do not match
        // Keep both cards flipped for a short duration before flipping back
        setTimeout(() => {
          flipCard(firstIndex, 0);
          flipCard(secondIndex, 0);

          setCards((prevCards) =>
            prevCards.map((card, i) =>
              i === firstIndex || i === secondIndex ? { ...card, flipped: false } : card
            )
          );

          // Clear flipped indices
          setFlippedIndices([]);
        }, 1000); // Adjust the duration as needed
      }
    }
  }, [flippedIndices, cards]);

  const getCardStyle = (index) => {
    const flipAnimation = flipAnimations[index];

    const frontAnimatedStyle = {
      transform: [
        {
          rotateY: flipAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '180deg'],
          }),
        },
      ],
    };

    const backAnimatedStyle = {
      transform: [
        {
          rotateY: flipAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: ['180deg', '360deg'],
          }),
        },
      ],
    };

    return {
      frontAnimatedStyle,
      backAnimatedStyle,
    };
  };


  const onPlayAgain = () => {
    resetGame();
    dispatch(updatedCoinsonBackend(score));
    navigation.navigate('Flipflop');
  };
 
 
  

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>Time:{timer}s</Text>
      <Text style={styles.score}>Score:{score}</Text>
      <View style={styles.grid}>
        {cards.map((card, index) => {
          const { frontAnimatedStyle, backAnimatedStyle } = getCardStyle(index);

          return (
            <TouchableOpacity
              key={index}
              style={styles.cardContainer}
              onPress={() => handleCardPress(index)}
              activeOpacity={1}
            >
              <View style={styles.cardInner}>
                <Animated.View style={[styles.flipCard, frontAnimatedStyle]}>
                  <View style={[styles.cardFace, styles.cardBack]}>
                    <Text style={styles.cardText}>?</Text>
                  </View>
                </Animated.View>
                <Animated.View
                  style={[
                    styles.flipCard,
                    styles.flipCardBack,
                    backAnimatedStyle,
                  ]}
                >
                  <View style={[styles.cardFace, styles.cardFront]}>
                    <Text style={styles.cardText}>{card.value}</Text>
                  </View>
                </Animated.View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {showIntro && (
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.introText}>Welcome to the Memory Game!</Text>
            <Text style={styles.introDescription}>
              Try to match all the pairs of cards by flipping them over.
              Remember the position of each card to win the game!
            </Text>
            <Button title="Start Game" onPress={() => setShowIntro(false)} />
          </View>
        </View>
      )}

      {gameOver && !win && (
        <Gameover score={score} visible={gameOver} onRestart={resetGame}/>
      )}
      {win && <Gamewin visible={win} onPlayAgain={onPlayAgain} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'yellow',
    alignItems: 'center',
    paddingTop: 50,
  },
  grid: {
    width: '80%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cardContainer: {
    width: '45%', // Adjusted to fit 2 cards per row
    margin: '2.5%',
    aspectRatio: 1,
  },
  cardInner: {
    flex: 1,
  },
  flipCard: {
    backfaceVisibility: 'hidden',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  flipCardBack: {
    transform: [{ rotateY: '180deg' }],
  },
  cardFace: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBack: {
    backgroundColor: '#fdbb2d',
    borderColor: '#555',
  },
  cardFront: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  cardText: {
    fontSize: 32,
    color: '#000',
  },
  timer: { fontSize: 20, marginBottom: 10 },
  score: { fontSize: 20, marginBottom: 10 },
  gameOver: { fontSize: 24, color: 'red', margin: 20 },

  // Modal styles
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  introText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  introDescription: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Gameplayflipflopscreen;
