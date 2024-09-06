import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet } from 'react-native';

function Computer() {
  // State variables
  const [currentFlag, setCurrentFlag] = useState(null); // Flag image and country data
  const [userGuess, setUserGuess] = useState(''); // User's input guess
  const [aiGuess, setAIGuess] = useState(''); // AI's guess
  const [timer, setTimer] = useState(5); // Countdown timer
  const [userScore, setUserScore] = useState(0); // User's score
  const [aiScore, setAIScore] = useState(0); // AI's score
  const [gameOver, setGameOver] = useState(false); // Game over flag

  useEffect(() => {
    // Initialize the game when the component mounts
    startGame();
  }, []);

  // Function to start the game and handle the timer
  const startGame = () => {
    setCurrentFlag(getRandomFlag()); // Load a random flag
    setUserGuess(''); // Reset user's guess
    setAIGuess(''); // Reset AI's guess
    setGameOver(false); // Reset game over flag

    // Start the timer countdown
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 9) {
          clearInterval(interval); // Clear interval when timer reaches 0
          checkAnswers(); // Check the guesses when time is up
          return 5; // Reset timer for next round
        }
        return prevTimer - 1; // Decrement timer
      });
    }, 8000);
  };

  // Function to check the user's and AI's guesses
  const checkAnswers = () => {
    const correctAnswer = currentFlag.country; // Assume the flag object has a 'country' property
    if (userGuess.toLowerCase() === correctAnswer.toLowerCase()) {
      setUserScore((prevScore) => prevScore + 1); // Increase user score
    }
    if (aiGuess.toLowerCase() === correctAnswer.toLowerCase()) {
      setAIScore((prevScore) => prevScore + 1); // Increase AI score
    }
    setGameOver(true); // End the game round
  };

  // Function to handle the AI's guess
  const handleAIGuess = () => {
    const aiGuess = getRandomCountry(); // Simple random guess for AI
    setAIGuess(aiGuess); // Set AI's guess
  };

  return (
    <View style={styles.container}>
      {/* Image Display */}
      {currentFlag && (
        <Image source={{ uri: currentFlag.imageUri }} style={styles.flagImage} />
      )}

      {/* Timer Display */}
      <Text style={styles.timer}>Time Left: {timer} seconds</Text>

      {/* User Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your guess"
        value={userGuess}
        onChangeText={setUserGuess}
        editable={!gameOver} // Disable input if the game is over
      />
      <Button title="Submit Guess" onPress={checkAnswers} disabled={gameOver} />

      {/* AI Guess Display */}
      <Text style={styles.aiGuess}>AI Guess: {gameOver ? aiGuess : '???'}</Text>

      {/* Score Display */}
      <Text style={styles.scores}>User Score: {userScore}</Text>
      <Text style={styles.scores}>AI Score: {aiScore}</Text>

      {/* Start Next Round Button */}
      {gameOver && (
        <Button title="Next Round" onPress={startGame} />
      )}
    </View>
  );
}

// Function to get a random flag (placeholder function)
const getRandomFlag = () => {
  return {
    imageUri: 'https://example.com/flag.png',
    country: 'Example Country'
  };
};

// Function to get a random country name (placeholder function)
const getRandomCountry = () => {
  const countries = ['Country A', 'Country B', 'Country C']; // Replace with actual country list
  return countries[Math.floor(Math.random() * countries.length)];
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  flagImage: {
    width: 200,
    height: 150,
    marginBottom: 16,
  },
  timer: {
    fontSize: 18,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 16,
    width: '80%',
  },
  aiGuess: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 16,
  },
  scores: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default Computer;
