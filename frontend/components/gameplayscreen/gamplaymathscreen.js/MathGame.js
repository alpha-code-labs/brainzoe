import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, Easing } from 'react-native-reanimated';

  const MathsGame = () => {
  const [questions, setQuestions] = useState([]); // Array to store generated questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track the current question
  const [userAnswer, setUserAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [timer, settimer] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false); // State to control motivational message
  const [motivationText, setMotivationText] = useState(''); // State to store the motivational message

  // Reanimated shared values
  const problemScale = useSharedValue(0);
  const messageOpacity = useSharedValue(0);
  const motivationOpacity = useSharedValue(0); // Shared value for motivational message

  // Function to generate random math problems
  const generateProblem = () => {
    const num1 = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
    const num2 = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let problem = `${num1} ${operator} ${num2}`;
    let correctAnswer;

    // Calculate the correct answer based on the operator
    switch (operator) {
      case '+':
        correctAnswer = num1 + num2;
        break;
      case '-':
        correctAnswer = num1 - num2;
        break;
      case '*':
        correctAnswer = num1 * num2;
        break;
    }

    return { problem, correctAnswer }; // Return the problem and its correct answer as an object
  };

  // Generate 10 random questions on component mount
  useEffect(() => {
    const generatedQuestions = Array.from({ length: 10 }, () => generateProblem());
    setQuestions(generatedQuestions);
    problemScale.value = withSpring(1, {
      damping: 5,
      stiffness: 100,
    });
  }, []);

  // Effect to handle the timer
  useEffect(() => {
    let interval;
    if (timer > 0 && !gameOver) {
      interval = setInterval(() => {
        settimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && !gameOver) {
      setGameOver(true);
      setMessage('Time up! Game Over.');
    }

    return () => clearInterval(interval);
  }, [timer, gameOver]);

  // Function to handle user's answer submission
  const handleSubmit = () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (parseInt(userAnswer) === currentQuestion.correctAnswer) {
      setMessage('Correct!');
      showMotivationalMessage(); // Show motivational message when the answer is correct
      goToNextQuestion();
    } else {
      setMessage('Try again!');
    }

    // Animate the feedback message
    messageOpacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.ease),
    });
  };

  // Function to show motivational message
  const showMotivationalMessage = () => {
    const messages = [
      "You're doing great!", 
      "Keep it up!", 
      "Fantastic job!", 
      "Amazing work!", 
      "You're on fire!",
    ];

    // Update motivation message based on question index
    const motivationIndex = Math.floor(currentQuestionIndex / 3) % messages.length;
    setMotivationText(messages[motivationIndex]);

    setShowMotivation(true);
    motivationOpacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.ease),
    });

    setTimeout(() => {
      motivationOpacity.value = withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      });
      setShowMotivation(false);
    }, 1000); // Show message for 1 second
  };

  // Function to move to the next question
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      settimer(10); // Reset the timer for the next question
      setUserAnswer('');
      setMessage('');
      problemScale.value = 0; // Reset scale before animating
      problemScale.value = withSpring(1, {
        damping: 5,
        stiffness: 100,
      });
    } else {
      setMessage('Congratulations! You have completed all questions.');
      setGameOver(true);
    }
  };

  // Function to restart the game
  const restartGame = () => {
    setGameOver(false);
    setCurrentQuestionIndex(0);
    settimer(10);
    setUserAnswer('');
    setMessage('');
    setMotivationText('');
    const newQuestions = Array.from({ length: 10 }, () => generateProblem());
    setQuestions(newQuestions);
  };

  // Animated styles
  const animatedProblemStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: problemScale.value }],
    };
  });

  const animatedMessageStyle = useAnimatedStyle(() => {
    return {
      opacity: messageOpacity.value,
    };
  });

  const animatedMotivationStyle = useAnimatedStyle(() => {
    return {
      opacity: motivationOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      {/* Timer display */}
      <Text>Time: {timer}s</Text>

      {/* Question Counter */}
      <Text>Question: {currentQuestionIndex + 1} / {questions.length}</Text>

      {/* Animated math problem */}
      <Animated.View style={animatedProblemStyle}>
        <Text style={styles.problemText}>
          {questions.length > 0 && !gameOver ? questions[currentQuestionIndex].problem : 'Loading...'}
        </Text>
      </Animated.View>

      {/* Motivational message */}
      {showMotivation && (
        <Animated.View style={[styles.motivationContainer, animatedMotivationStyle]}>
          <Text style={styles.motivationText}>{motivationText}</Text>
        </Animated.View>
      )}

      {/* User input */}
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter your answer"
        value={userAnswer}
        onChangeText={setUserAnswer}
        editable={!gameOver} // Disable input if the game is over
      />

      {/* Styled Submit button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={gameOver}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      {/* Restart button */}
      {gameOver && (
        <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
          <Text style={styles.buttonText}>Restart Game</Text>
        </TouchableOpacity>
      )}

      {/* Animated feedback message */}
      <Animated.View style={animatedMessageStyle}>
        <Text style={styles.messageText}>{message}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  problemText: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#4CAF50', // Green background
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white', // White text
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  messageText: {
    fontSize: 18,
    marginTop: 20,
  },
  restartButton: {
    backgroundColor: '#FF5722', // Orange background
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  motivationContainer: {
    marginTop: 10,
    backgroundColor: '#FFD700', // Yellow background for motivation
    padding: 10,
    borderRadius: 5,
  },
  motivationText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MathsGame;
