import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const questions = [
  {
    question: "The ___ is the largest land animal.",
    options: ['Lion', 'Elephant', 'Giraffe', 'Rhino'],
    correctAnswer: 'Elephant',
    explanation: 'Elephants are the largest land animals. Example: "The elephant used its trunk to drink water."'
  },
  {
    question: "The sun is part of the ___ system.",
    options: ['Solar', 'Galaxy', 'Planet', 'Star'],
    correctAnswer: 'Solar',
    explanation: 'The solar system includes the sun and the planets that orbit it.'
  },
  {
    question: "A group of lions is called a ___.",
    options: ['Flock', 'Herd', 'Pack', 'Pride'],
    correctAnswer: 'Pride',
    explanation: 'A group of lions is called a pride. Example: "The pride of lions rested under a tree."'
  },
  {
    question: "___ is the process by which plants make food.",
    options: ['Photosynthesis', 'Respiration', 'Germination', 'Transpiration'],
    correctAnswer: 'Photosynthesis',
    explanation: 'Photosynthesis is the process where plants use sunlight to make food from carbon dioxide and water.'
  },
  {
    question: "The ___ is the tallest animal in the world.",
    options: ['Elephant', 'Kangaroo', 'Giraffe', 'Tiger'],
    correctAnswer: 'Giraffe',
    explanation: 'Giraffes are the tallest animals, with their long necks helping them reach leaves on tall trees.'
  },
  {
    question: "Water freezes at ___ degrees Celsius.",
    options: ['100', '0', '50', '25'],
    correctAnswer: '0',
    explanation: 'Water freezes at 0°C. Example: "The water turned to ice at 0°C."'
  },
  {
    question: "Humans have ___ senses.",
    options: ['4', '5', '6', '7'],
    correctAnswer: '5',
    explanation: 'Humans have five senses: sight, hearing, touch, taste, and smell.'
  },
  {
    question: "The ___ is known as the king of the jungle.",
    options: ['Tiger', 'Lion', 'Elephant', 'Bear'],
    correctAnswer: 'Lion',
    explanation: 'The lion is often called the king of the jungle because of its majestic appearance and power.'
  },
  {
    question: "The ___ protects the heart and lungs in the human body.",
    options: ['Rib cage', 'Skull', 'Spine', 'Pelvis'],
    correctAnswer: 'Rib cage',
    explanation: 'The rib cage protects the heart and lungs by encasing them in a bony structure.'
  },
  {
    question: "___ is the largest planet in our solar system.",
    options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 'Jupiter',
    explanation: 'Jupiter is the largest planet in our solar system, much larger than Earth.'
  },
  {
    question: "___ is the closest planet to the sun.",
    options: ['Venus', 'Mars', 'Earth', 'Mercury'],
    correctAnswer: 'Mercury',
    explanation: 'Mercury is the closest planet to the sun. Example: "Mercury has very extreme temperatures."'
  },
  {
    question: "The ___ is responsible for pumping blood throughout the body.",
    options: ['Brain', 'Lungs', 'Liver', 'Heart'],
    correctAnswer: 'Heart',
    explanation: 'The heart pumps blood throughout the body, delivering oxygen and nutrients to tissues.'
  },
  {
    question: "The ___ carries oxygenated blood from the heart to the rest of the body.",
    options: ['Veins', 'Arteries', 'Capillaries', 'Nerves'],
    correctAnswer: 'Arteries',
    explanation: 'Arteries carry oxygen-rich blood from the heart to the tissues in the body.'
  },
  {
    question: "The ___ is the hardest natural substance on Earth.",
    options: ['Gold', 'Silver', 'Diamond', 'Iron'],
    correctAnswer: 'Diamond',
    explanation: 'Diamonds are the hardest natural substance on Earth. Example: "Diamonds are often used in jewelry."'
  },
  {
    question: "Humans and most animals breathe in ___ and exhale carbon dioxide.",
    options: ['Oxygen', 'Nitrogen', 'Hydrogen', 'Helium'],
    correctAnswer: 'Oxygen',
    explanation: 'Humans breathe in oxygen, which is needed for survival, and exhale carbon dioxide.'
  }
];

function WorldmatchGame() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [chances, setChances] = useState(3);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  const currentQuestion = questions[currentQuestionIndex];

  // Handle timer
  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else {
        handleNextQuestion();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle answer selection
  const handleAnswer = (selectedOption) => {
    if (selectedOption === currentQuestion.correctAnswer) {
      Alert.alert('Correct!', currentQuestion.explanation);
      setScore(score + 10); // Add points
      handleNextQuestion();
    } else {
      setChances(chances - 1);
      Alert.alert('Wrong!', `You have ${chances - 1} chances left.`);
      if (chances === 1) {
        Alert.alert('Game Over', 'You are out of chances!');
        resetGame();
      }
    }
  };

  // Move to the next question
  const handleNextQuestion = () => {
    setTimeLeft(30); // Reset timer
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      Alert.alert('Game Over', `Your final score is ${score}`);
      resetGame();
    }
  };

  // Reset game
  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setChances(3);
    setScore(0);
    setTimeLeft(30);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>Chances: {chances}</Text>
      <Text style={styles.infoText}>Score: {score}</Text>
      <Text style={styles.infoText}>Time Left: {timeLeft}s</Text>
      <Text style={styles.infoText}>Total Questions: {questions.length}</Text>
      
      {/* Display question number */}
      <Text style={styles.infoText}>Question {currentQuestionIndex + 1}/{questions.length}</Text>
      
      <Text style={styles.questionText}>{currentQuestion.question}</Text>

      {currentQuestion.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionButton}
          onPress={() => handleAnswer(option)}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  questionText: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#6200ea',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  optionText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
  },
  infoText: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
  },
});

export default WorldmatchGame;
