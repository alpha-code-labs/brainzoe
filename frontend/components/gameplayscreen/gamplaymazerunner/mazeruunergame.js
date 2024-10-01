import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Dimensions,
  Animated,
  TouchableOpacity, // Import TouchableOpacity
} from 'react-native';
import Svg, { Rect, Circle } from 'react-native-svg';

const GridScreen = () => {
  const windowWidth = Dimensions.get('window').width;
  const gridSize = 15; // Increased grid size for a more complex maze
  const gridContainerSize = windowWidth * 0.95; // 95% of screen width
  const cellSize = gridContainerSize / gridSize; // Adjust cell size based on grid size

  // Define cell types
  const CELL_TYPES = {
    WALL: 'wall',
    PATH: 'path',
    START_USER: 'start_user',
    START_COMPUTER: 'start_computer',
    END: 'end',
  };

  // Directions
  const mazeDirections = [
    { row: -2, col: 0 }, // Up
    { row: 2, col: 0 }, // Down
    { row: 0, col: -2 }, // Left
    { row: 0, col: 2 }, // Right
  ];

  const moveDirections = [
    { row: -1, col: 0 }, // Up
    { row: 1, col: 0 }, // Down
    { row: 0, col: -1 }, // Left
    { row: 0, col: 1 }, // Right
  ];

  // Utility function to shuffle an array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  // Initialize the maze grid
  const createInitialGrid = () => {
    // Initialize grid with walls
    const grid = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => ({ type: CELL_TYPES.WALL }))
    );

    // Recursive Backtracking Maze Generation
    const generateMaze = (row, col) => {
      // Add boundary checks
      if (
        row < 0 ||
        row >= gridSize ||
        col < 0 ||
        col >= gridSize ||
        !grid[row] ||
        !grid[row][col]
      ) {
        return;
      }

      if (grid[row][col].type === CELL_TYPES.PATH) {
        return; // Already visited
      }

      grid[row][col] = { type: CELL_TYPES.PATH };
      const directions = [...mazeDirections];
      shuffleArray(directions); // Randomize directions

      for (const dir of directions) {
        const newRow = row + dir.row;
        const newCol = col + dir.col;

        // Ensure newRow and newCol are within bounds
        if (
          newRow >= 1 &&
          newRow < gridSize - 1 &&
          newCol >= 1 &&
          newCol < gridSize - 1 &&
          grid[newRow] &&
          grid[newRow][newCol] &&
          grid[newRow][newCol].type === CELL_TYPES.WALL
        ) {
          const wallRow = row + dir.row / 2;
          const wallCol = col + dir.col / 2;

          // Ensure wallRow and wallCol are within bounds
          if (
            wallRow >= 0 &&
            wallRow < gridSize &&
            wallCol >= 0 &&
            wallCol < gridSize &&
            grid[wallRow] &&
            grid[wallRow][wallCol]
          ) {
            grid[wallRow][wallCol] = { type: CELL_TYPES.PATH }; // Remove wall
            generateMaze(newRow, newCol);
          }
        }
      }
    };

    // Start maze generation from random position
    const startRow = Math.floor(Math.random() * (gridSize / 2)) * 2 + 1;
    const startCol = Math.floor(Math.random() * (gridSize / 2)) * 2 + 1;
    generateMaze(startRow, startCol);

    // Place start and end points
    if (grid[1] && grid[1][1]) {
      grid[1][1] = { type: CELL_TYPES.START_USER }; // User starts near top-left
    }
    if (grid[gridSize - 2] && grid[gridSize - 2][gridSize - 2]) {
      grid[gridSize - 2][gridSize - 2] = {
        type: CELL_TYPES.START_COMPUTER,
      }; // Computer starts near bottom-right
    }
    if (grid[1] && grid[1][gridSize - 2]) {
      grid[1][gridSize - 2] = { type: CELL_TYPES.END }; // End point near top-right
    }

    return grid;
  };

  const [grid, setGrid] = useState(createInitialGrid());
  const [userPosition, setUserPosition] = useState({ row: 1, col: 1 });
  const [computerPosition, setComputerPosition] = useState({
    row: gridSize - 2,
    col: gridSize - 2,
  });
  const [computerPath, setComputerPath] = useState([
    { row: gridSize - 2, col: gridSize - 2 },
  ]);
  const [timeLeft, setTimeLeft] = useState(120); // Increased time due to larger maze
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [showLetsGo, setShowLetsGo] = useState(false);
  const [score, setScore] = useState(0); // Add score state

  // Animated values for user and computer positions
  const userAnimX = useRef(
    new Animated.Value(userPosition.col * cellSize + cellSize / 2)
  ).current;
  const userAnimY = useRef(
    new Animated.Value(userPosition.row * cellSize + cellSize / 2)
  ).current;
  const computerAnimX = useRef(
    new Animated.Value(computerPosition.col * cellSize + cellSize / 2)
  ).current;
  const computerAnimY = useRef(
    new Animated.Value(computerPosition.row * cellSize + cellSize / 2)
  ).current;

  // Countdown before game starts
  useEffect(() => {
    let countdownInterval = null;
    if (!gameStarted) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown > 1) {
            return prevCountdown - 1;
          } else if (prevCountdown === 1) {
            setShowLetsGo(true);
            return 0;
          } else {
            clearInterval(countdownInterval);
            setGameStarted(true);
            return 0;
          }
        });
      }, 1000);
    }

    return () => clearInterval(countdownInterval);
  }, [gameStarted]);

  // Timer effect
  useEffect(() => {
    if (!gameStarted || gameEnded) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameEnded(true);
          Alert.alert(
            "Time's Up!",
            'You ran out of time.',
            [{ text: 'OK', onPress: () => {} }],
            { cancelable: false }
          );
          return 0;
        } else {
          return prevTime - 1;
        }
      });
    }, 1000); // Decrease time every second

    return () => clearInterval(timer);
  }, [gameStarted, gameEnded]);

  // Handle user cell press
  const handleCellPress = useCallback(
    (row, col) => {
      if (!gameStarted || gameEnded) return;

      const { row: userRow, col: userCol } = userPosition;

      // Check if the pressed cell is adjacent to the user's current position
      const isAdjacent = moveDirections.some(
        (dir) => userRow + dir.row === row && userCol + dir.col === col
      );

      if (isAdjacent) {
        if (!grid[row] || !grid[row][col]) return;

        const cell = grid[row][col];

        if (cell.type === CELL_TYPES.WALL) {
          Alert.alert('Invalid Move', 'You cannot move through walls.');
        } else if (cell.type === CELL_TYPES.END) {
          // Move the user to the end position before showing the alert
          moveUser(row, col);
          setGameEnded(true);

          // Update the score
          setScore((prevScore) => prevScore + 100); // Award 100 points

          Alert.alert(
            'Congratulations',
            'You reached the end before the computer!',
            [{ text: 'OK', onPress: () => {} }],
            { cancelable: false }
          );
        } else if (
          cell.type === CELL_TYPES.PATH ||
          cell.type === CELL_TYPES.START_USER
        ) {
          // Move the user
          moveUser(row, col);
        }
      } else {
        Alert.alert('Invalid Move', 'You can only move to adjacent cells.');
      }
    },
    [userPosition, grid, gameStarted, gameEnded]
  );

  // Move user to a new position with fast animation
  const moveUser = (row, col) => {
    Animated.parallel([
      Animated.timing(userAnimX, {
        toValue: col * cellSize + cellSize / 2,
        duration: 50, // Fast animation
        useNativeDriver: false,
      }),
      Animated.timing(userAnimY, {
        toValue: row * cellSize + cellSize / 2,
        duration: 50, // Fast animation
        useNativeDriver: false,
      }),
    ]).start(() => {
      setUserPosition({ row, col });
    });
  };

  // Move computer using DFS with backtracking
  useEffect(() => {
    let computerMoving = true;

    const moveComputer = () => {
      if (!gameStarted || gameEnded || !computerMoving) return;

      const path = findPathWithBacktracking(computerPosition, grid);
      if (path && path.length > 1) {
        const nextMove = path[1]; // Next position in the path

        if (!grid[nextMove.row] || !grid[nextMove.row][nextMove.col]) return;

        const cell = grid[nextMove.row][nextMove.col];

        const animationDuration = 200; // Adjust as needed
        const movementDelay = 300; // Delay between movements in milliseconds

        if (cell.type === CELL_TYPES.END) {
          // Move the computer to the end position before showing the alert
          Animated.parallel([
            Animated.timing(computerAnimX, {
              toValue: nextMove.col * cellSize + cellSize / 2,
              duration: animationDuration,
              useNativeDriver: false,
            }),
            Animated.timing(computerAnimY, {
              toValue: nextMove.row * cellSize + cellSize / 2,
              duration: animationDuration,
              useNativeDriver: false,
            }),
          ]).start(() => {
            setComputerPosition(nextMove);
            setComputerPath((prevPath) => [
              ...prevPath,
              { row: nextMove.row, col: nextMove.col },
            ]);
            setGameEnded(true);
            Alert.alert(
              'Game Over',
              'The computer reached the end before you.',
              [{ text: 'OK', onPress: () => {} }],
              { cancelable: false }
            );
          });
        } else {
          Animated.parallel([
            Animated.timing(computerAnimX, {
              toValue: nextMove.col * cellSize + cellSize / 2,
              duration: animationDuration,
              useNativeDriver: false,
            }),
            Animated.timing(computerAnimY, {
              toValue: nextMove.row * cellSize + cellSize / 2,
              duration: animationDuration,
              useNativeDriver: false,
            }),
          ]).start(() => {
            setComputerPosition(nextMove);
            setComputerPath((prevPath) => [
              ...prevPath,
              { row: nextMove.row, col: nextMove.col },
            ]);
            // Schedule next move after delay
            setTimeout(() => {
              moveComputer();
            }, movementDelay);
          });
        }
      } else {
        // No path found; computer can't move
      }
    };

    if (gameStarted && !gameEnded) {
      moveComputer();
    }

    return () => {
      computerMoving = false; // Stop computer movement on unmount
    };
  }, [gameStarted, gameEnded, computerPosition, grid]);

  // Find a path using DFS with backtracking
  const findPathWithBacktracking = (startPos, grid) => {
    const visited = Array.from({ length: gridSize }, () =>
      Array.from({ length: gridSize }, () => false)
    );

    const path = [];
    const found = dfs(startPos.row, startPos.col, visited, path, grid);
    return found ? path : null;
  };

  const dfs = (row, col, visited, path, grid) => {
    if (
      row < 0 ||
      col < 0 ||
      row >= gridSize ||
      col >= gridSize ||
      !grid[row] ||
      !grid[row][col]
    )
      return false;
    if (visited[row][col]) return false;
    const cell = grid[row][col];
    if (cell.type === CELL_TYPES.WALL) return false;

    visited[row][col] = true;
    path.push({ row, col });

    if (cell.type === CELL_TYPES.END) return true;

    const directions = [...moveDirections];
    shuffleArray(directions); // Randomize directions

    for (let dir of directions) {
      const newRow = row + dir.row;
      const newCol = col + dir.col;
      if (dfs(newRow, newCol, visited, path, grid)) return true;
    }

    path.pop(); // Backtrack
    return false;
  };

  // Restart the game
  const restartGame = () => {
    const newGrid = createInitialGrid();
    setGrid(newGrid);

    const userStartPos = { row: 1, col: 1 };
    const computerStartPos = { row: gridSize - 2, col: gridSize - 2 };

    setUserPosition(userStartPos);
    setComputerPosition(computerStartPos);
    setComputerPath([computerStartPos]);
    setTimeLeft(120); // Reset timer
    setCountdown(3);
    setGameStarted(false);
    setGameEnded(false);
    setShowLetsGo(false);

    // Reset animated positions
    userAnimX.setValue(userStartPos.col * cellSize + cellSize / 2);
    userAnimY.setValue(userStartPos.row * cellSize + cellSize / 2);
    computerAnimX.setValue(computerStartPos.col * cellSize + cellSize / 2);
    computerAnimY.setValue(computerStartPos.row * cellSize + cellSize / 2);
  };

  return (
    <View style={styles.container}>
      {/* Display Score */}
      {gameStarted && !gameEnded && (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Score: {score}</Text>
        </View>
      )}

      {/* Display Timer */}
      {gameStarted && !gameEnded && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>Time Left: {timeLeft} s</Text>
        </View>
      )}

      {/* Display Countdown */}
      {!gameStarted && (
        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>
            {showLetsGo ? "Let's Go!" : countdown}
          </Text>
        </View>
      )}

      {/* SVG Grid */}
      <Svg
        width={gridContainerSize}
        height={gridContainerSize}
        onPress={
          gameStarted && !gameEnded
            ? (event) => {
                const { locationX, locationY } = event.nativeEvent;
                const col = Math.floor(locationX / cellSize);
                const row = Math.floor(locationY / cellSize);
                handleCellPress(row, col);
              }
            : null
        }
      >
        {/* Render the grid cells */}
        {grid.map((rowData, rowIndex) =>
          rowData.map((cell, colIndex) => {
            let fillColor = '#000'; // Default wall color

            // Determine the fill color based on cell type
            if (cell.type === CELL_TYPES.WALL) {
              fillColor = '#000'; // Wall color (Black)
            } else if (cell.type === CELL_TYPES.PATH) {
              fillColor = '#fff'; // Path color (White)
            } else if (cell.type === CELL_TYPES.START_USER) {
              fillColor = '#228B22'; // User start point (Forest Green)
            } else if (cell.type === CELL_TYPES.START_COMPUTER) {
              fillColor = '#4682B4'; // Computer start point (Steel Blue)
            } else if (cell.type === CELL_TYPES.END) {
              fillColor = '#00008B'; // End point color (Dark Blue)
            }

            return (
              <Rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * cellSize}
                y={rowIndex * cellSize}
                width={cellSize}
                height={cellSize}
                fill={fillColor}
                stroke="#ccc"
                strokeWidth={0.5}
              />
            );
          })
        )}

        {/* Render the computer's path */}
        {computerPath.map((pos, index) => (
          <Rect
            key={`path-${index}`}
            x={pos.col * cellSize}
            y={pos.row * cellSize}
            width={cellSize}
            height={cellSize}
            fill="rgba(255, 69, 0, 0.3)" // Light OrangeRed color with transparency
          />
        ))}

        {/* User Marker */}
        <AnimatedCircle
          cx={userAnimX}
          cy={userAnimY}
          r={cellSize * 0.35}
          fill="#FFD700" // Gold color
        />

        {/* Computer Marker */}
        <AnimatedCircle
          cx={computerAnimX}
          cy={computerAnimY}
          r={cellSize * 0.35}
          fill="#FF4500" // OrangeRed color
        />
      </Svg>

      {/* Restart Button */}
      {gameEnded && (
        <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
          <Text style={styles.restartButtonText}>Restart Game</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Animated versions of SVG components
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: '#F5FCFF',
  },
  timerContainer: {
    position: 'absolute',
    top: 50, // Adjust as needed
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  timerText: {
    color: '#fff',
    fontSize: 18,
  },
  scoreContainer: {
    position: 'absolute',
    top: 10,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  scoreText: {
    color: '#fff',
    fontSize: 18,
  },
  countdownContainer: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 10,
  },
  countdownText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  restartButton: {
    marginTop: 20,
    backgroundColor: '#FF5722',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GridScreen;
