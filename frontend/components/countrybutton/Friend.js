// // App.js
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Socket } from 'socket.io-client';
// import {
//   StyleSheet,
//   Text,
//   View,
//   Alert,
//   Keyboard,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
// } from 'react-native';

// export default function App() {
//   // Updated Questions Array
//   const questions = [
//     {
//       countryCode: 'in',
//       totalLetters: 5,
//       hint: 'IN--A',
//       ans: 'INDIA',
//       maxTime: 20,
//       id: 0,
//       timedOut: false,
//       userAnswers: [],
//     }, 
//     {
//       countryCode: 'us',
//       totalLetters: 6,
//       hint: 'U--T-D',
//       ans: 'UNITED',
//       maxTime: 10,
//       id: 1,
//       timedOut: false,
//       userAnswers: [],
//     },
//     {
//       countryCode: 'uk',
//       totalLetters: 7,
//       hint: 'E-G-A-D',
//       ans: 'ENGLAND',
//       maxTime: 10,
//       id: 2,
//       timedOut: false,
//       userAnswers: [],
//     },
//     {
//       countryCode: 'ca',
//       totalLetters: 6,
//       hint: 'C-N-D-',
//       ans: 'CANADA',
//       maxTime: 10,
//       id: 3,
//       timedOut: false,
//       userAnswers: [],
//     },
//     {
//       countryCode: 'au',
//       totalLetters: 9,
//       hint: 'A-S-R-L-A',
//       ans: 'AUSTRALIA',
//       maxTime: 10,
//       id: 4,
//       timedOut: false,
//       userAnswers: [],
//     },
//     {
//       countryCode: 'fr',
//       totalLetters: 6,
//       hint: 'F-A-C-',
//       ans: 'FRANCE',
//       maxTime: 10,
//       id: 5,
//       timedOut: false,
//       userAnswers: [],
//     },
//     {
//       countryCode: 'de',
//       totalLetters: 7,
//       hint: 'G-R-A-Y',
//       ans: 'GERMANY',
//       maxTime: 10,
//       id: 6,
//       timedOut: false,
//       userAnswers: [],
//     },
//     {
//       countryCode: 'jp',
//       totalLetters: 5,
//       hint: 'J-P-N-',
//       ans: 'JAPAN',
//       maxTime: 10,
//       id: 7,
//       timedOut: false,
//       userAnswers: [],
//     },
//     {
//       countryCode: 'it',
//       totalLetters: 5,
//       hint: 'I-A-Y',
//       ans: 'ITALY',
//       maxTime: 10,
//       id: 8,
//       timedOut: false,
//       userAnswers: [],
//     },
//     {
//       countryCode: 'br',
//       totalLetters: 6,
//       hint: 'B-A-I-',
//       ans: 'BRAZIL',
//       maxTime: 10,
//       id: 9,
//       timedOut: false,
//       userAnswers: [],
//     },
//   ];

//   // State Variables
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [coinCount, setCoinCount] = useState(0);
//   const [timeLeft, setTimeLeft] = useState(questions[0].maxTime);
//   const timerRef = useRef(null);
//   const [isTimerRunning, setIsTimerRunning] = useState(false);
//   const [letterInputs, setLetterInputs] = useState([]);
//   const [chatMessages, setChatMessages] = useState([]); // Chat messages state
//   const [chatInputText, setChatInputText] = useState(''); // Input text state for chat
//   const [result, setResult] = useState(null); // 'correct', 'incorrect', or null

//   const inputRefs = useRef([]);
//   const currentQuestion = questions[currentQuestionIndex];
//   const countryName = currentQuestion ? currentQuestion.ans.toUpperCase() : '';

//   // Initialize Letter Inputs based on Hint
//   useEffect(() => {
//     if (currentQuestion) {
//       startNewRound();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentQuestionIndex]);

//   // Cleanup timer on component unmount
//   useEffect(() => {
//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//       }
//     };
//   }, []);

//   // Start a New Round
//   const startNewRound = useCallback(() => {
//     if (!currentQuestion) return;

//     // Initialize letterInputs based on the hint
//     const initializedLetters = currentQuestion.hint.split('').map((char) =>
//       char === '-' ? '' : char
//     );
//     setLetterInputs(initializedLetters);

//     setTimeLeft(currentQuestion.maxTime);
//     setIsTimerRunning(true);
//     setResult(null); // Reset result for the new round

//     // Clear any existing timer before starting a new one
//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//       timerRef.current = null;
//     }

//     // Set focus on the first editable input field
//     setTimeout(() => {
//       const firstEditableIndex = initializedLetters.findIndex((char) => char === '');
//       if (inputRefs.current[firstEditableIndex]) {
//         inputRefs.current[firstEditableIndex].focus();
//       }
//     }, 100);

//     // Start a new timer
//     timerRef.current = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timerRef.current);
//           setIsTimerRunning(false);
//           setResult('incorrect'); // Automatically set to incorrect on timeout
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   }, [currentQuestion]);

//   // Evaluate the Answer
//   const evaluateAnswer = useCallback(() => {
//     // Clear the timer if it's still running
//     if (timerRef.current) {
//       clearInterval(timerRef.current);
//       timerRef.current = null; // Reset the ref
//     }

//     setIsTimerRunning(false); // Update the timer state

//     const guess = letterInputs.join('').toUpperCase();
//     if (guess === countryName) {
//       setCoinCount((prevCoins) => prevCoins + 10); // Add 10 coins for the correct answer
//       setResult('correct'); // Set result to 'correct'
//     } else {
//       setResult('incorrect'); // Set result to 'incorrect'
//     }

//     // Optionally, you can automatically proceed to the next question here
//     // handleNextQuestion();
//   }, [letterInputs, countryName]);

//   // Reset the Game
//   const resetGame = useCallback(() => {
//     setCurrentQuestionIndex(0);
//     setCoinCount(0);
//     setIsTimerRunning(false);
//     setResult(null);
//   }, []);

//   // Handle Letter Change
//   const handleLetterChange = (text, index) => {
//     // Prevent changing pre-filled letters
//     if (currentQuestion.hint[index] !== '-') return;

//     const newLetters = [...letterInputs];
//     newLetters[index] = text.replace(/[^a-zA-Z]/g, '').toUpperCase();
//     setLetterInputs(newLetters);

//     if (text !== '' && index < countryName.length - 1) {
//       // Find the next editable index
//       const nextIndex = newLetters.findIndex((char, idx) => char === '' && idx > index);
//       if (nextIndex !== -1 && inputRefs.current[nextIndex]) {
//         inputRefs.current[nextIndex].focus();
//       } else {
//         Keyboard.dismiss();
//       }
//     }
//   };

//   // Handle Submit
//   const handleSubmit = () => {
//     evaluateAnswer();
//   };

//   // Handle Chat Message Submission
//   const handleSendMessage = () => {
//     if (chatInputText.trim()) {
//       setChatMessages((prevMessages) => [
//         ...prevMessages,
//         { id: Date.now().toString(), message: chatInputText.trim() },
//       ]);
//       setChatInputText(''); // Clear the input field after sending the message
//     }
//   };

//   // Function to Handle Proceeding to the Next Question
//   const handleNextQuestion = () => {
//     if (currentQuestionIndex + 1 < questions.length) {
//       setCurrentQuestionIndex((prev) => prev + 1);
//     } else {
//       Alert.alert('Game Over', 'All questions answered.', [{ text: 'OK', onPress: resetGame }]);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         ListHeaderComponent={
//           <>
//             {/* Game Header */}
//             <View style={styles.topBar}>
//               <Text style={styles.playerName}>Dummy Player</Text>
//               <Text style={styles.coinText}>Coins: {coinCount}</Text>
//             </View>

//             <View>
//               <Text style={styles.title}>Country Guessing Game</Text>
//               {currentQuestion && (
//                 <>
//                   <Text style={styles.timer}>Time Left: {timeLeft}s</Text>
//                   <Text style={styles.hint}>Hint: {currentQuestion.hint}</Text>
//                   <View style={styles.dashesContainer}>
//                     {letterInputs.map((letter, index) => (
//                       <TextInput
//                         key={index}
//                         ref={(ref) => (inputRefs.current[index] = ref)}
//                         style={styles.letterInput}
//                         maxLength={1}
//                         value={letter}
//                         onChangeText={(text) => handleLetterChange(text, index)}
//                         editable={currentQuestion.hint[index] === '-' && isTimerRunning}
//                         autoCapitalize="characters"
//                         keyboardType="default"
//                         returnKeyType="next"
//                         onSubmitEditing={() => {
//                           // Focus next editable input
//                           const nextEditableIndex = letterInputs.findIndex(
//                             (char, idx) => char === '' && idx > index
//                           );
//                           if (nextEditableIndex !== -1 && inputRefs.current[nextEditableIndex]) {
//                             inputRefs.current[nextEditableIndex].focus();
//                           } else {
//                             Keyboard.dismiss();
//                           }
//                         }}
//                       />
//                     ))}
//                   </View>
//                   <TouchableOpacity
//                     style={styles.submitButton}
//                     onPress={handleSubmit}
//                     disabled={!isTimerRunning}
//                   >
//                     <Text style={styles.submitButtonText}>Submit</Text>
//                   </TouchableOpacity>
//                 </>
//               )}
//             </View>

//             {/* Chat messages */}
//             <ScrollView style={styles.chatBox}>
//               {chatMessages.map((item) => (
//                 <View key={item.id} style={styles.chatMessage}>
//                   <Text style={styles.chatText}>{item.message}</Text>
//                 </View>
//               ))}
//             </ScrollView>

//             {/* Chat Input and Send Button */}
//             <View style={styles.chatInputContainer}>
//               <TextInput
//                 style={styles.chatInput}
//                 placeholder="Enter your message"
//                 value={chatInputText}
//                 onChangeText={setChatInputText}
//               />
//               <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
//                 <Text style={styles.sendButtonText}>Send</Text>
//               </TouchableOpacity>
//             </View>
//           </>
//         }
//       />

//       {/* Winning Modal */}
//       <Modal
//         transparent={true}
//         visible={result === 'correct'}
//         animationType="slide"
//         onRequestClose={() => setResult(null)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>🎉 You Won! 🎉</Text>
//             <Text style={styles.modalMessage}>Congratulations! You answered correctly.</Text>
//             <TouchableOpacity style={styles.modalButton} onPress={handleNextQuestion}>
//               <Text style={styles.modalButtonText}>Next Question</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* Losing Modal */}
//       <Modal
//         transparent={true}
//         visible={result === 'incorrect'}
//         animationType="slide"
//         onRequestClose={() => setResult(null)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>😞 Better Luck Next Time! 😞</Text>
//             <Text style={styles.modalMessage}>
//               {timeLeft === 0
//                 ? `Time's up! The correct answer was ${currentQuestion.ans}.`
//                 : 'Don\'t give up! Try the next one.'}
//             </Text>
//             <TouchableOpacity style={styles.modalButton} onPress={handleNextQuestion}>
//               <Text style={styles.modalButtonText}>Next Question</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// // Stylesheet
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   topBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: '#9575CD',
//     borderRadius: 10,
//     margin: 10,
//   },
//   playerName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   coinText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginVertical: 5,
//     textAlign: 'center',
//   },
//   timer: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'red',
//     marginBottom: 5,
//     textAlign: 'center',
//   },
//   hint: {
//     fontSize: 18,
//     fontStyle: 'italic',
//     marginBottom: 10,
//     textAlign: 'center',
//     color: '#4A90E2', // Updated color for the hint text
//     fontWeight: '500', // Slightly bolder than normal
//   },
//   dashesContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 10,
//   },
//   letterInput: {
//     borderBottomWidth: 2,
//     borderColor: '#000',
//     width: 40,
//     height: 50,
//     marginHorizontal: 2,
//     textAlign: 'center',
//     fontSize: 24,
//   },
//   submitButton: {
//     backgroundColor: '#2196F3',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 15,
//     alignSelf: 'center',
//   },
//   submitButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   chatBox: {
//     height: 200,
//     backgroundColor: '#fff',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     margin: 10,
//     borderRadius: 10,
//     borderColor: '#ccc',
//     borderWidth: 1,
//   },
//   chatMessage: {
//     marginBottom: 5,
//   },
//   chatText: {
//     fontSize: 16,
//   },
//   chatInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     marginBottom: 20,
//   },
//   chatInput: {
//     flex: 1,
//     borderColor: '#666',
//     borderWidth: 1,
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     borderRadius: 5,
//   },
//   sendButton: {
//     marginLeft: 10,
//     backgroundColor: '#2196F3',
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 5,
//   },
//   sendButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   // Modal styles
//   modalContainer: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContent: {
//     width: '80%',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   modalMessage: {
//     fontSize: 18,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   modalButton: {
//     backgroundColor: '#2196F3',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   modalButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });





// App.js
// App.js
// frontend/App.js
import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Keyboard,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { socket } from '../../socket';

// Import the shared socket instance


export default function App() {
  // State Variables
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState(null);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [coinCount, setCoinCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [gameEnded, setGameEnded] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // New State Variable for User's Answer
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs
  const messageInputRef = useRef(null);
  const answerInputRef = useRef(null); // Single answer input ref
  const timerRef = useRef(null);

  useEffect(() => {
    // Connect the socket when the component mounts
    if (!socket.connected) {
      socket.connect();
    }

    // Event: Successful Connection
    socket.on('connect', () => {
      console.log('✅ Connected to the Socket.io server!');
      setIsConnected(true);
    });

    // Event: Disconnection
    socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from the server:', reason);
      setIsConnected(false);
      Alert.alert('Disconnected', `Disconnected from server: ${reason}`);
    });

    // Event: Connection Error
    socket.on('connect_error', (error) => {
      console.log('⚠️ Connection Error:', error.message);
      Alert.alert('Connection Error', error.message);
    });

    // Listen for room joined
    socket.on('joined', (roomData) => {
      console.log('🏠 Joined room successfully!', roomData);
      setRoom(roomData);
      setUsers(roomData.users);
      setChatMessages(roomData.messages);
      setIsLoading(false);
    });

    // Listen for room updates
    socket.on('room-update', (updatedRoom) => {
      console.log('🔄 Room updated:', updatedRoom);
      setRoom(updatedRoom);
      setUsers(updatedRoom.users);
      setChatMessages(updatedRoom.messages);
    });

    // Listen for new chat messages
    socket.on('message-update', (messages) => {
      console.log('💬 New messages received:', messages);
      setChatMessages(messages);
    });

    // Listen for question updates
    socket.on('question-update', (question) => {
      console.log('📝 New question received:', question);
      if (!question || !question.ans) {
        console.error('Invalid question received:', question);
        return;
      }
      setCurrentQuestion(question);
      setUserAnswer(''); // Reset user's answer
      setTimeLeft(question.maxTime);
      setIsSubmitting(false); // Allow submissions for the new question

      // Start Timer
      startTimer(question.maxTime);
    });

    // Listen for user updates (scores and answers)
    socket.on('user-update', ({ users: updatedUsers }) => {
      console.log('👥 User updates received:', updatedUsers);
      setUsers(updatedUsers);
    });

    // Listen for game end
    socket.on('game-end', () => {
      console.log('🏁 Game has ended.');
      setGameEnded(true);
      Alert.alert('Game Over', 'The game has ended.');
      resetGame();
    });

    // Listen for correct guess
    socket.on('correctGuess', ({ username: winner, points }) => {
      console.log(`🎯 ${winner} answered correctly and earned ${points} points.`);
      if (winner === username) {
        setCoinCount((prev) => prev + points);
        // You can add additional UI feedback here
      }
    });

    // Listen for end of round
    socket.on('endRound', ({ country }) => {
      console.log('🏁 Round ended. Correct answer:', country);
      setCorrectAnswer(country); // Set the correct answer
      setIsSubmitting(false); // Allow submissions for the next question
    });

    // Cleanup listeners on Unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('joined');
      socket.off('room-update');
      socket.off('message-update');
      socket.off('question-update');
      socket.off('user-update');
      socket.off('game-end');
      socket.off('correctGuess');
      socket.off('endRound');
      // Do not disconnect the socket here if it's shared across components
    };
  }, [username]);

  // Function: Start Timer
  const startTimer = (duration) => {
    setTimeLeft(duration);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          // Do not auto-evaluate; the server will send the next question
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Function: Evaluate Answer
  const evaluateAnswer = () => {
    if (!currentQuestion) {
      console.log('No current question to evaluate.');
      return;
    }

    const guess = userAnswer.trim().toUpperCase();
    if (guess === '') {
      Alert.alert('Error', 'Please enter an answer.');
      return;
    }

    // Emit answer to the server
    socket.emit('ans-update', {
      ans: guess,
      questionId: currentQuestion.id,
      socketId: socket.id,
      roomName: room.roomName,
    });

    setIsSubmitting(true); // Disable submit button while processing
    setUserAnswer(''); // Clear the input

    // Do not handle result here; server will send updates
  };
 
  // Function: Reset Game
  const resetGame = () => {
    setRoom(null);
    setCurrentQuestion(null);
    setChatMessages([]);
    setUsers([]);
    setCoinCount(0);
    setGameEnded(false);
    setMessage('');
    setUserAnswer('');
    setCorrectAnswer('');
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    // Do not disconnect the socket here if it's shared across components
  };

  // Function: Join Room
  const joinRoom = () => {
    if (username.trim() === '') {
      Alert.alert('Error', 'Please enter a username.');
      return;
    }

    setIsLoading(true);

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('join-room', { username });

    // Handle a timeout for joining
    setTimeout(() => {
      if (!room) {
        Alert.alert('Timeout', 'Unable to join the room. Please try again.');
        setIsLoading(false);
        socket.disconnect();
      }
    }, 10000); // 10 seconds timeout
  };

  // Function: Send Chat Message
  const sendMessage = () => {
    if (message.trim() === '') {
      Alert.alert('Error', 'Please enter a message.');
      return;
    }

    socket.emit('user-message', {
      content: message,
      to: room.roomName,
      sender: username,
    });

    setChatMessages((prev) => [
      ...prev,
      { sender: username, message: message.trim(), timeStamp: new Date() },
    ]);
    setMessage('');
    if (messageInputRef.current) {
      messageInputRef.current.clear();
      messageInputRef.current.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {!room ? (
        // Lobby Screen: Enter Username and Join
        <View style={styles.lobbyContainer}>
          <Text style={styles.title}>Country Guessing Game</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your username"
            value={username}
            onChangeText={setUsername}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={joinRoom}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Join Game</Text>
            )}
          </TouchableOpacity>

          {/* Connection Status */}
          <View style={styles.statusContainer}>
            <Text
              style={[
                styles.statusText,
                { color: isConnected ? 'green' : 'red' },
              ]}
            >
              Status: {isConnected ? '✅ Connected' : '❌ Disconnected'}
            </Text>
          </View>
        </View>
      ) : (
        // Main Game Screen
        <View style={styles.gameContainer}>
          {/* Top Bar: Username and Coins */}
          <View style={styles.topBar}>
            <Text style={styles.playerName}>{username}</Text>
            <Text style={styles.coinText}>Coins: {coinCount}</Text>
          </View>

          {/* Waiting Lobby */}
          {!room.gameStarted && (
            <View style={styles.waitingLobby}>
              <Text style={styles.waitingText}>
                Waiting for other players to join...
              </Text>
              <Text style={styles.playersHeader}>
                Players ({users.length}/10):
              </Text>
              <FlatList
                data={users}
                keyExtractor={(item) => item.socketId}
                renderItem={({ item }) => (
                  <Text style={styles.player}>{item.username}</Text>
                )}
              />

              {/* Chat Section */}
              <View style={styles.chatBox}>
                <ScrollView>
                  {chatMessages.map((msg, index) => (
                    <View key={index} style={styles.chatMessage}>
                      <Text style={styles.chatSender}>{msg.sender}:</Text>
                      <Text style={styles.chatText}>{msg.message}</Text>
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.chatInputContainer}>
                  <TextInput
                    ref={messageInputRef}
                    style={styles.chatInput}
                    placeholder="Type a message..."
                    value={message}
                    onChangeText={setMessage}
                    onSubmitEditing={sendMessage}
                  />
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={sendMessage}
                  >
                    <Text style={styles.sendButtonText}>Send</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Game Started */}
          {room.gameStarted && currentQuestion && (
            <View style={styles.gameSection}>
              {/* Question and Timer */}
              <View style={styles.questionContainer}>
                <Text style={styles.hintText}>
                  Hint: {currentQuestion.hint}
                </Text>
                <Text style={styles.timerText}>Time Left: {timeLeft}s</Text>
              </View>

              {/* Single Answer Input */}
              <View style={styles.answerContainer}>
                <TextInput
                  ref={answerInputRef}
                  style={styles.fullAnswerInput}
                  placeholder="Type your answer here..."
                  value={userAnswer}
                  onChangeText={setUserAnswer}
                  onSubmitEditing={evaluateAnswer}
                  returnKeyType="done"
                  autoCapitalize="characters"
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={evaluateAnswer}
                disabled={isSubmitting || timeLeft === 0}
              >
                <Text style={styles.submitButtonText}>Submit Answer</Text>
              </TouchableOpacity>

              {/* User Scores */}
              <View style={styles.scoresContainer}>
                <Text style={styles.scoresHeader}>Scores:</Text>
                {users.map((user) => (
                  <Text key={user.socketId} style={styles.score}>
                    {user.username}: {user.score}
                  </Text>
                ))}
              </View>

              {/* Chat Section */}
              <View style={styles.chatBox}>
                <ScrollView>
                  {chatMessages.map((msg, index) => (
                    <View key={index} style={styles.chatMessage}>
                      <Text style={styles.chatSender}>{msg.sender}:</Text>
                      <Text style={styles.chatText}>{msg.message}</Text>
                    </View>
                  ))}
                </ScrollView>
                <View style={styles.chatInputContainer}>
                  <TextInput
                    ref={messageInputRef}
                    style={styles.chatInput}
                    placeholder="Type a message..."
                    value={message}
                    onChangeText={setMessage}
                    onSubmitEditing={sendMessage}
                  />
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={sendMessage}
                  >
                    <Text style={styles.sendButtonText}>Send</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}



// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  lobbyContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  gameContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#9575CD',
    borderRadius: 10,
    marginBottom: 10,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  coinText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  waitingLobby: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  waitingText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  playersHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  playersList: {
    maxHeight: 100,
    marginBottom: 10,
  },
  player: {
    fontSize: 16,
    marginLeft: 10,
  },
  chatBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    marginTop: 10,
  },
  chatMessage: {
    marginBottom: 5,
    flexDirection: 'row',
  },
  chatSender: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  chatText: {
    fontSize: 16,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  chatInput: {
    flex: 1,
    borderColor: '#666',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#2196F3',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  gameSection: {
    flex: 1,
    padding: 10,
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  hintText: {
    fontSize: 20,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
  answerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  // New Style for Single Answer Input
  fullAnswerInput: {
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 18,
    backgroundColor: '#fff',
    width: '80%',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scoresContainer: {
    marginBottom: 20,
  },
  scoresHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  score: {
    fontSize: 18,
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 30,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
