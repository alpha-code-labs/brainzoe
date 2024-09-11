// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   Image,
// } from 'react-native';
// import Gameover from './Gameover';
// import Gamewin from './Gamewin';
// import { useNavigation } from '@react-navigation/native';

// const CARD_VALUES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

// // const CARD_VALUES = [
// //   { uri: require('../assets/flipflopimage/fruitsimages/Banana.png') },
// //   { uri: require('../assets/flipflopimage/fruitsimages/Banana.png') },
// //   { uri: require('../assets/flipflopimage/fruitsimages/Banana.png') },
// //   { uri: require('../assets/flipflopimage/fruitsimages/Banana.png') },
// //   { uri: require('../assets/flipflopimage/fruitsimages/Banana.png') },
// //   { uri: require('../assets/flipflopimage/fruitsimages/Banana.png') },
// //   { uri: require('../assets/flipflopimage/fruitsimages/Banana.png') },
// //   { uri: require('../assets/flipflopimage/fruitsimages/Banana.png') },
// // ];

// const SHUFFLED_CARDS = [...CARD_VALUES, ...CARD_VALUES].sort(
//   () => Math.random() - 0.5,
// );

// const Gameplayflipflopscreen = () => {
//   const navigation = useNavigation();
//   const [cards, setCards] = useState(
//     SHUFFLED_CARDS.map(value => ({value, flipped: false, matched: false})),
//   );

//   const [flippedIndices, setFlippedIndices] = useState([]);
//   const [score, setScore] = useState(0);
//   const [matches, setMatches] = useState(0);
//   const [timer, setTimer] = useState(0);
//   const [gameOver, setGameOver] = useState(false);
//   const [win, Setwin] = useState(false);
//   const [updatetime, setUpdatetime] = useState(60);

//   //if a kid win  with match the pop screen will give congrats to him and tell him this time time will reduce to 5 sec until 15 sec then back to flip flop screen
//   //when time will end another screen will be saying try again

//   const resetGame = () => {
//     // Shuffle the cards and reset their state
//     const resetCards = SHUFFLED_CARDS.map(value => ({value, flipped: false}));

//     setCards(resetCards);
//     setFlippedIndices([]);
//     setScore(0);
//     setMatches(0);
//     setTimer(0);
//     setGameOver(false);
//     Setwin(false);  // Reset win state

//   };

//   const onPlayAgain = () =>{

//     // navigation.navigate('Flipflop');
//     const resetCards = SHUFFLED_CARDS.map(value => ({value, flipped: false}));
//     setCards(resetCards);
//     setFlippedIndices([]);
//     setScore(score+10);
//     setMatches(0);
//     Setwin(false);
//     setGameOver(false);

//   }

//   useEffect(() => {
//     let interval;
//     if (!gameOver) {
//       interval = setInterval(() => {
//         setTimer(prev => {
//           if (prev >= 59) {
//             // Set game over when 30 seconds are up
//             setGameOver(true);
//             clearInterval(interval);
//             return 60; // Set the timer to exactly 60 seconds when the game ends
//           }
//           return prev + 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [gameOver]);

//   const handleCardPress = index => {
//     const newFlippedIndices = [...flippedIndices, index];
//     setCards(
//       cards.map((card, i) => (i === index ? {...card, flipped: true} : card)),
//     );

//     if (newFlippedIndices.length === 2) {
//       const [first, second] = newFlippedIndices;
//       if (cards[first].value === cards[second].value) {
//         setScore(score + 10);
//         setMatches(matches + 1);
//         setCards(
//           cards.map((card, i) =>
//             newFlippedIndices.includes(i) ? {...card, matched: true} : card,
//           ),
//         );
//         // if (matches + 1 === 8) setGameOver(true);
//         if (matches + 1 === 8) {
//           Setwin(true);
//           setGameOver(false);

//         }
//       } else {
//         setTimeout(() => {
//           setCards(
//             cards.map((card, i) =>
//               newFlippedIndices.includes(i) ? {...card, flipped: false} : card,
//             ),
//           );
//         }, 1000);
//       }
//       setFlippedIndices([]);
//     } else {
//       setFlippedIndices(newFlippedIndices);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.timer}>Time: {timer}s</Text>
//       <Text style={styles.score}>Score: {score}</Text>
//       <View style={styles.grid}>
//         {cards.map((card, index) => (
//           <TouchableOpacity
//             key={index}
//             style={[
//               styles.card,
//               card.flipped || card.matched ? styles.flipped : styles.unflipped,
//             ]}
//             onPress={() => handleCardPress(index)}>
//             {card.flipped || card.matched ? (
//               <Text style={styles.cardValue}>{card.value}</Text>
//             ) : null}
//           </TouchableOpacity>
//         ))}
//       </View>
//       {gameOver && !win && (
//   <Gameover score={score} visible={gameOver} onRestart={resetGame} />
// )}
// {win && (
//   <Gamewin visible={win} onPlayAgain={onPlayAgain} />
// )}

//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
//   grid: {width: '80%', flexDirection: 'row', flexWrap: 'wrap'},
//   card: {
//     width: '23%',
//     margin: '1%',
//     height: '23%',
//     aspectRatio: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//     borderWidth: 2,
//   },
//   unflipped: {
//     backgroundColor: '#fdbb2d', // Make sure unflipped cards are visible
//     borderColor: '#555',
//   },
//   flipped: {
//     backgroundColor: '#fff',
//     borderColor: '#ddd',
//   },
//   cardValue: {fontSize: 24, color: '#000'},
//   timer: {fontSize: 20, marginBottom: 10},
//   score: {fontSize: 20, marginBottom: 10},
//   gameOver: {fontSize: 24, color: 'red', margin: 20},
//   resetButton: {
//     marginTop: 20,
//     padding: 10,
//     backgroundColor: '#fdbb2d',
//     borderRadius: 5,
//   },
// });

// export default Gameplayflipflopscreen;

// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Modal, Button } from 'react-native';
// import Gameover from './Gameover';
// import Gamewin from './Gamewin';
// import { useNavigation } from '@react-navigation/native';

// const CARD_VALUES = ['A', 'B']; // Only 2 unique values for a 2x2 grid

// const shuffleArray = (array) => {
//   return array.sort(() => Math.random() - 0.5);
// };

// const Gameplayflipflopscreen = () => {
//   const navigation = useNavigation();
//   const [cards, setCards] = useState(
//     shuffleArray([...CARD_VALUES, ...CARD_VALUES]).map(value => ({ value, flipped: false, matched: false }))
//   );
//   const [flippedIndices, setFlippedIndices] = useState([]);
//   const [score, setScore] = useState(0);
//   const [matches, setMatches] = useState(0);
//   const [timer, setTimer] = useState(0);
//   const [gameOver, setGameOver] = useState(false);
//   const [win, Setwin] = useState(false);
//   const [showIntro, setShowIntro] = useState(true); // State to control the introduction modal

//   useEffect(() => {
//     let interval;

//     // Start the timer only if the game is not over, the user hasn't won, and the intro is not showing
//     if (!gameOver && !win && !showIntro) {
//       interval = setInterval(() => {
//         setTimer(prev => {
//           if (prev >= 59) {
//             setGameOver(true);
//             clearInterval(interval);
//             return 60;
//           }
//           return prev + 1;
//         });
//       }, 1000);
//     }

//     return () => clearInterval(interval); // Clear interval when game is over, user wins, or the intro is shown again
//   }, [gameOver, win, showIntro]); // Add 'showIntro' as a dependency

//   const resetGame = () => {
//     const shuffledCards = shuffleArray([...CARD_VALUES, ...CARD_VALUES]);
//     const resetCards = shuffledCards.map(value => ({ value, flipped: false, matched: false }));
//     setCards(resetCards);
//     setFlippedIndices([]);
//     setScore(0);
//     setMatches(0);
//     setTimer(0);
//     setGameOver(false);
//     Setwin(false);
//   };

//   const onPlayAgain = () => {
//     const shuffledCards = shuffleArray([...CARD_VALUES, ...CARD_VALUES]);
//     const resetCards = shuffledCards.map(value => ({ value, flipped: false, matched: false }));
//     setCards(resetCards);
//     setFlippedIndices([]);
//     setScore(score + 10);
//     setTimer(0);
//     setMatches(0);
//     Setwin(false); // Reset win state
//     setGameOver(false); // Reset gameOver state
//   }

//   const handleCardPress = index => {
//     const newFlippedIndices = [...flippedIndices, index];
//     setCards(
//       cards.map((card, i) => (i === index? { ...card, flipped: true } : card)),
//     );

//     if (newFlippedIndices.length === 2) {
//       const [first, second] = newFlippedIndices;
//       if (cards[first].value === cards[second].value) {
//         setScore(score + 10);
//         setMatches(matches + 1);
//         setCards(
//           cards.map((card, i) =>
//             newFlippedIndices.includes(i) ? { ...card, matched: true } : card,
//           ),
//         );
//         if (matches + 1 === 2) { // 2 matches needed for a win in a 2x2 grid
//           Setwin(true);
//           setGameOver(false);
//         }
//       } else {
//         setTimeout(() => {
//           setCards(
//             cards.map((card, i) =>
//               newFlippedIndices.includes(i) ? { ...card, flipped: false } : card,
//             ),
//           );
//         }, 1000);
//       }
//       setFlippedIndices([]);
//     } else {
//       setFlippedIndices(newFlippedIndices);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Introduction Modal */}
//       <Modal
//         visible={showIntro}
//         transparent={true}
//         animationType="slide"
//       >
//         <View style={styles.modalBackground}>
//           <View style={styles.modalContainer}>
//             <Text style={styles.introText}>Welcome to the Memory Game!</Text>
//             <Text style={styles.introDescription}>
//               Try to match all the pairs of cards by flipping them over. Remember the position of each card to win the game!
//             </Text>
//             <Button title="Start Game" onPress={() => setShowIntro(false)} />
//           </View>
//         </View>
//       </Modal>

//       <Text style={styles.timer}>Time: {timer}s</Text>
//       <Text style={styles.score}>Score: {score}</Text>
//       <View style={styles.grid}>
//         {cards.map((card, index) => (
//           <TouchableOpacity
//             key={index}
//             style={[
//               styles.card,
//               card.flipped || card.matched ? styles.flipped : styles.unflipped,
//             ]}
//             onPress={() => handleCardPress(index)}>
//             {card.flipped || card.matched ? (
//               <Text style={styles.cardValue}>{card.value}</Text>
//             ) : null}
//           </TouchableOpacity>
//         ))}
//       </View>
//       {gameOver && !win && (
//         <Gameover score={score} visible={gameOver} onRestart={resetGame} />
//       )}
//       {win && (
//         <Gamewin visible={win} onPlayAgain={onPlayAgain} />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   grid: {
//     width: '80%',
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     height:'45%',
//   },
//   card: {
//     width: '45%', // 45% width to fit 2 cards per row with some spacing
//     height:'45%',
//     margin: '2.5%',
//     aspectRatio: 1, // Square cards
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//     borderWidth: 2,
//   },
//   unflipped: {
//     backgroundColor: '#fdbb2d',
//     borderColor: '#555',
//   },
//   flipped: {
//     backgroundColor: '#fff',
//     borderColor: '#ddd',
//   },
//   cardValue: { fontSize: 24, color: '#000' },
//   timer: { fontSize: 20, marginBottom: 10 },
//   score: { fontSize: 20, marginBottom: 10 },
//   gameOver: { fontSize: 24, color: 'red', margin: 20 },

//   // Modal styles
//   modalBackground: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContainer: {
//     width: '80%',
//     padding: 20,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     alignItems: 'center',
//   },
//   introText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   introDescription: {
//     fontSize: 18,
//     color: '#333',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
// });

// export default Gameplayflipflopscreen;






import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import Gameover from './Gameover';
import Gamewin from './Gamewin';
import { useNavigation } from '@react-navigation/native';
import { resetCoin, updatecoin } from '../../redux/features/coinSlice';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CARD_VALUES = ['A', 'B']; // Only 2 unique values for a 2x2 grid

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const Gameplayflipflopscreen = () => {
  const dispatch = useDispatch();
  const coins = useSelector((state) => state.coin); // Retrieve coins from Redux store

  const navigation = useNavigation();
  const [cards, setCards] = useState(
    shuffleArray([...CARD_VALUES, ...CARD_VALUES]).map((value) => ({
      value,
      flipped: false,
      matched: false,
    }))
  );
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [score, setScore] = useState(0); // Local score state
  const [matches, setMatches] = useState(0);
  const [timer, setTimer] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [win, Setwin] = useState(false);
  const [showIntro, setShowIntro] = useState(true); // State to control the introduction modal

  // Reanimated shared values and animated styles
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    opacity.value = 1;
    scale.value = 1;
  }, [showIntro]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      }),
      transform: [
        {
          scale: withTiming(scale.value, {
            duration: 500,
            easing: Easing.out(Easing.ease),
          }),
        },
      ],
    };
  }, []);

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

  const resetGame = useCallback(() => {
    setScore(0); // Reset local score for a new game
    const shuffledCards = shuffleArray([...CARD_VALUES, ...CARD_VALUES]);
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
    Setwin(false);
  }, []);

  const handleCardPress = (index) => {
    const newFlippedIndices = [...flippedIndices, index];
    setCards(
      cards.map((card, i) => (i === index ? { ...card, flipped: true } : card))
    );

    if (newFlippedIndices.length === 2) {
      const [first, second] = newFlippedIndices;
      if (cards[first].value === cards[second].value) {
        setScore((prevScore) => prevScore + 10); // Update local score
        setMatches((prevMatches) => prevMatches + 1);
        setCards(
          cards.map((card, i) =>
            newFlippedIndices.includes(i) ? { ...card, matched: true } : card
          )
        );
        if (matches + 1 === 2) {
          // 2 matches needed for a win in a 2x2 grid
          Setwin(true);
          setGameOver(false);
        }
      } else {
        setTimeout(() => {
          setCards(
            cards.map((card, i) =>
              newFlippedIndices.includes(i) ? { ...card, flipped: false } : card
            )
          );
        }, 1000);
      }
      setFlippedIndices([]);
    } else {
      setFlippedIndices(newFlippedIndices);
    }
  };

  const onPlayAgain = () => {
    resetGame(); // Reset the game state for a new round`
    dispatch(updatecoin(score)); // Dispatch the final score to the Redux store
    navigation.navigate('Flipflop');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>Time: {timer}s</Text>
      <Text style={styles.score}>Score: {score}</Text>
      <View style={styles.grid}>
        {cards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.card,
              card.flipped || card.matched ? styles.flipped : styles.unflipped,
            ]}
            onPress={() => handleCardPress(index)}
          >
            {card.flipped || card.matched ? (
              <Text style={styles.cardValue}>{card.value}</Text>
            ) : null}
          </TouchableOpacity>
        ))}
      </View>

      {showIntro && (
        <Animated.View style={[styles.modalBackground, animatedStyle]}>
          <View style={styles.modalContainer}>
            <Text style={styles.introText}>Welcome to the Memory Game!</Text>
            <Text style={styles.introDescription}>
              Try to match all the pairs of cards by flipping them over.
              Remember the position of each card to win the game!
            </Text>
            <Button title="Start Game" onPress={() => setShowIntro(false)} />
          </View>
        </Animated.View>
      )}

      {gameOver && !win && (
        <Gameover score={score} visible={gameOver} onRestart={resetGame} />
      )}
      {win && <Gamewin visible={win} onPlayAgain={onPlayAgain} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  grid: {
    width: '80%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    height: '45%',
  },
  card: {
    width: '45%', // 45% width to fit 2 cards per row with some spacing
    height: '45%',
    margin: '2.5%',
    aspectRatio: 1, // Square cards
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
  },
  unflipped: {
    backgroundColor: '#fdbb2d',
    borderColor: '#555',
  },
  flipped: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  cardValue: {
    fontSize: 24,
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
