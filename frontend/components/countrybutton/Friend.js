import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { socket } from '../../socket';
import { fetchUserProfile } from '../../redux/features/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function App() {
  // Access the user from the Redux state
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userAuth || {});

  // State Variables
  const [userId, setUserId] = useState(null);
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
  const [startcountdown, setStartcountdown] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [winner, setWinner] = useState(null);

  // Refs
  const messageInputRef = useRef(null);
  const answerInputRef = useRef(null); // Single answer input ref
  const timerRef = useRef(null);
  const timerIntervalRef = useRef(null); // To keep track of the interval

  // Fetch the user profile when the component mounts
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

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
      const currentUser = roomData.users.find(
        (usr) => usr.username === user.userName
      );
      if (currentUser) {
        setUserId(currentUser.userId);
      }
      setChatMessages(roomData.messages);
      setIsLoading(false);
    });

    // Listen for room updates
    socket.on('room-update', (updatedRoom) => {
      console.log('🔄 Room updated:', updatedRoom);
      setRoom(updatedRoom);
      setUsers(updatedRoom.users);
      setChatMessages(updatedRoom.messages);

      if (updatedRoom !== null) {
        setStartcountdown(updatedRoom.startsIn);

        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
        timerIntervalRef.current = setInterval(() => {
          setStartcountdown((prev) => {
            if (prev > 0) {
              return prev - 1;
            } else {
              clearInterval(timerIntervalRef.current);
              return 0;
            }
          });
        }, 1000);
      }
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

    // Function to calculate the winner
    const calculateWinner = () => {
      if (users && users.length > 0) {
        const sortedUsers = [...users].sort((a, b) => b.score - a.score);
        const topUser = sortedUsers[0];
        setWinner(topUser);
        Alert.alert(
          'Game Over',
          `The winner is ${topUser.username} with ${topUser.score} points!`
        );
      }
    };

    // Listen for game end
    socket.on('game-end', () => {
      setGameEnded(true);
      calculateWinner(); // Calculate the winner when the game ends

      console.log('🏁 Game has ended.');

      Alert.alert('Game Over', 'The game has ended.');
      resetGame();
    });

    // Listen for correct guess
    socket.on('correctGuess', ({ username: winnerName, points }) => {
      console.log(
        `🎯 ${winnerName} answered correctly and earned ${points} points.`
      );
      if (winnerName === user.userName) {
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
    };
  }, [user.userName]);

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
      // Alert.alert('Error', 'Please enter an answer.');
      return;
    }

    // Emit answer to the socket.io server
    socket.emit('ans-update', {
      ans: guess,
      questionId: currentQuestion.id,
      userId,
      roomName: room.roomName,
    });

    console.log(
      `sent ans: ${guess}, ${userId}, ${room.roomName} qId: ${currentQuestion.id} for evaluation`
    );

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
    setWinner(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    // Do not disconnect the socket here if it's shared across components
  };

  // Function: Join Room
  const joinRoom = () => {
    if (!user || !user.userName) {
      Alert.alert('Error', 'User information is not available.');
      return;
    }

    setIsLoading(true);

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('join-room', { username: user.userName });
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
      sender: user.userName,
    });

    setChatMessages((prev) => [
      ...prev,
      {
        sender: user.userName,
        message: message.trim(),
        timeStamp: new Date(),
      },
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
          {/* <Text style={styles.usernameText}>
            Username: {user.userName}
          </Text> */}
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
          {/* <View style={styles.topBar}>
            <Text style={styles.playerName}>{user.userName}</Text>
            <Text style={styles.coinText}>Coins: {coinCount}</Text>
          </View> */}

          {/* Waiting Lobby */}
          {!room.gameStarted && (
            <View style={styles.waitingLobby}>
              <Text style={styles.playersHeader}>
                Players ({users.length}/10):
              </Text>
              <Text style={styles.waitingText}>
                Waiting for other players to join...
              </Text>
              {/* Display user's username */}
              {/* <Text style={styles.usernameText}>
                Username: {user.userName}
              </Text> */}

              {gameEnded && winner && (
                <View>
                  <Text>
                    The winner is {winner.userName} with {winner.score}
                  </Text>
                </View>
              )}

              {startcountdown !== null && (
                <Text>Game starts in: {startcountdown}s</Text>
              )}
              <FlatList
                data={users}
                keyExtractor={(user) => user.userId}
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
                <Text style={styles.timerText}>
                  Time Left: {timeLeft}s
                </Text>
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
                {users.map((userItem) => (
                  <Text key={userItem.userId} style={styles.score}>
                    {userItem.username}: {userItem.score}
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

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  usernameText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
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
