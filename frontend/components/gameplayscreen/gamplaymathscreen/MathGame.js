import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const MathsGame = () => {
  const [questions, setQuestions] = useState([]); // Array to store generated questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track the current question
  const [userAnswer, setUserAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false); // State to control motivational message
  const [motivationText, setMotivationText] = useState(''); // State to store the motivational message
  const [score, setScore] = useState(0); // State to track the score
  const [level, setLevel] = useState(1); // State to track the difficulty level

  // Reanimated shared values
  const problemScale = useSharedValue(0);
  const messageOpacity = useSharedValue(0);
  const motivationOpacity = useSharedValue(0); // Shared value for motivational message

  // Function to generate random math problems with increasing difficulty
  const generateProblem = () => {
    // Increase the range of numbers based on the level
    const maxNumber = level * 10;
    const num1 = Math.floor(Math.random() * maxNumber) + 1;
    const num2 = Math.floor(Math.random() * maxNumber) + 1;

    // Include more operators as the level increases
    let operators = ['+', '-'];
    if (level >= 2) operators.push('*');
    if (level >= 3) operators.push('/');

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
      case '/':
        correctAnswer = parseFloat((num1 / num2).toFixed(2)); // Round to 2 decimal places
        problem = `${num1} ÷ ${num2}`; // Display division symbol
        break;
      default:
        break;
    }

    return { problem, correctAnswer }; // Return the problem and its correct answer as an object
  };

  // Generate initial questions on component mount
  useEffect(() => {
    const generatedQuestions = Array.from({ length: 10 }, () => generateProblem());
    setQuestions(generatedQuestions);
    problemScale.value = withSpring(1, {
      damping: 5,
      stiffness: 100,
    });
  }, [level]); // Regenerate questions when the level changes

  // Effect to handle the timer
  useEffect(() => {
    let interval;
    if (timer > 0 && !gameOver) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
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

    // Handle division answers with decimals
    const correctAnswer = currentQuestion.correctAnswer;
    const userAnswerFloat = parseFloat(userAnswer);

    let isCorrect = false;

    // For division, allow a small margin of error
    if (currentQuestion.problem.includes('÷')) {
      isCorrect = Math.abs(userAnswerFloat - correctAnswer) < 0.01;
    } else {
      isCorrect = userAnswerFloat === correctAnswer;
    }

    if (isCorrect) {
      // Award points based on the time left (more points for faster answers)
      const pointsEarned = timer * level; // Points depend on remaining time and level
      setScore((prevScore) => prevScore + pointsEarned);

      setMessage(`Correct! +${pointsEarned} points`);
      showMotivationalMessage(); // Show motivational message when the answer is correct
      goToNextQuestion();
    } else {
      setMessage('Incorrect. Try again!');
    }

    // Animate the feedback message
    messageOpacity.value = withTiming(1, {
      duration: 500,
      easing: Easing.out(Easing.ease),
    });

    setTimeout(() => {
      messageOpacity.value = withTiming(0, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      });
    }, 1000); // Hide message after 1 second

    setUserAnswer(''); // Clear the input
  };

  // Function to show motivational message
  const showMotivationalMessage = () => {
    const messages = [
      "You're doing great!",
      'Keep it up!',
      'Fantastic job!',
      'Amazing work!',
      "You're on fire!",
    ];

    // Update motivation message based on question index
    const motivationIndex = currentQuestionIndex % messages.length;
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
      setTimer(10); // Reset the timer for the next question
      setMessage('');
      problemScale.value = 0; // Reset scale before animating
      problemScale.value = withSpring(1, {
        damping: 5,
        stiffness: 100,
      });
    } else {
      // Increase level after completing all questions
      if (level < 3) {
        setLevel(level + 1);
        setCurrentQuestionIndex(0);
        setTimer(10);
        setMessage(`Level Up! Welcome to Level ${level + 1}`);
        setUserAnswer('');
      } else {
        setMessage('Congratulations! You have completed all levels.');
        setGameOver(true);
      }
    }
  };

  // Function to restart the game
  const restartGame = () => {
    setGameOver(false);
    setCurrentQuestionIndex(0);
    setTimer(10);
    setUserAnswer('');
    setMessage('');
    setMotivationText('');
    setScore(0);
    setLevel(1);
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
      <Text style={styles.timerText}>Time: {timer}s</Text>

      {/* Score display */}
      <Text style={styles.scoreText}>Score: {score}</Text>

      {/* Level display */}
      <Text style={styles.levelText}>Level: {level}</Text>

      {/* Question Counter */}
      <Text style={styles.questionCounter}>
        Question: {currentQuestionIndex + 1} / {questions.length}
      </Text>

      {/* Animated math problem */}
      <Animated.View style={animatedProblemStyle}>
        <Text style={styles.problemText}>
          {questions.length > 0 && !gameOver
            ? questions[currentQuestionIndex].problem
            : 'Loading...'}
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
    backgroundColor: '#eef',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  problemText: {
    fontSize: 32,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: '#555',
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50', // Green background
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white', // White text
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  messageText: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: 'bold',
  },
  restartButton: {
    backgroundColor: '#FF5722', // Orange background
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  levelText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  questionCounter: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default MathsGame;
