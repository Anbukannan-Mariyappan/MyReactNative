import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Dimensions } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Constants from "./Constants";
import GameLoop from "./systems/GameLoop";
import Food from "./components/Food";
import Head from "./components/Head";
import Tail from "./components/Tail";

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';


// Function to generate random positions within the grid boundaries
const getRandomPositionWithinBounds = () => {
  const x = Math.floor(Math.random() * Constants.GRID_SIZE);
  const y = Math.floor(Math.random() * Constants.GRID_SIZE);
  return [x, y];
};

export default function App() {
  const engine = useRef(null);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentFood, setCurrentFood] = useState(alphabet[Math.floor(Math.random() * alphabet.length)]);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [back, setBack] = useState(); 
  const [tail, setTail] = useState([]);
  const [difficulty, setDifficulty] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (isGameStarted && engine.current) {
      resetGame();
    }
  }, [isGameStarted]);

  const startGame = (level) => {
    setDifficulty(level);
    setIsGameStarted(true);
    setIsGameRunning(true);
  };

  const resetGame = () => {
    setScore(0);
    setWrong(0);
    setBack();
    setTail([]);
    setIsGameOver(false);
    setIsGameRunning(true);

    const newFood = alphabet[Math.floor(Math.random() * alphabet.length)];
    setCurrentFood(newFood);
    const newFoodPosition = getRandomPositionWithinBounds();
    const headStartPosition = getRandomPositionWithinBounds();

    if (engine.current) {
      engine.current.swap({
        head: {
          position: headStartPosition,
          size: Constants.CELL_SIZE,
          updateFrequency: getSnakeSpeed(difficulty),
          nextMove: getSnakeSpeed(difficulty),
          xspeed: 7,
          yspeed: 0,
          moving: false,
          currentFood: newFood, // Display the current food inside the head
          renderer: <Head />,
        },
        food: {
          position: newFoodPosition,
          size: Constants.CELL_SIZE,
          currentFood: newFood,
          renderer: <Food />,
        },
        tail: {
          size: Constants.CELL_SIZE,
          elements: tail,
          renderer: <Tail />,
        },
      });
      engine.current.dispatch({ type: 'reset-food', position: newFoodPosition, newFood });
    }
  };

  const handleKeyPress = (char) => {
    const inputText = char.toUpperCase();

    if (inputText === currentFood) {
      setScore(score + 1);
      const newFood = alphabet[Math.floor(Math.random() * alphabet.length)];
      setCurrentFood(newFood);
      if (engine.current) {
        engine.current.dispatch({ type: 'move-snake-to-food' });
      }
    } else {
      setWrong(wrong + 1);
    }
  };

  const handleGameEvent = (event) => {
    if (event.type === 'food-eaten') {
      setTail([...tail, { position: [...tail[tail.length - 1]?.position || [0, 0]] }]);
      const newFood = alphabet[Math.floor(Math.random() * alphabet.length)];
      setCurrentFood(newFood);
      const newFoodPosition = getRandomPositionWithinBounds();
      if (engine.current) {
        engine.current.dispatch({ type: 'reset-food', position: newFoodPosition, newFood });
      }
    } else if (event.type === 'game-over') {
      setIsGameRunning(false);
      setIsGameOver(true);
    } else if (event.type === 'game-restart') {
      setIsGameRunning(true);
      setIsGameOver(false);
    }
  };

  const getSnakeSpeed = (level) => {
    switch (level) {
      case 'easy':
        return 40;
      case 'medium':
        return 25;
      case 'hard':
        return 10;
      default:
        return 30;
    }
  };

  const boardSize = width * 0.6;

  if (!isGameStarted) {
    return (
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome to the Snake Game!</Text>
        <Text style={styles.selectDifficultyText}>Select Difficulty Level:</Text>
        <TouchableOpacity style={[styles.difficultyButton, styles.easyButton]} onPress={() => startGame('easy')}>
          <Text style={styles.difficultyButtonText}>Easy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.difficultyButton, styles.mediumButton]} onPress={() => startGame('medium')}>
          <Text style={styles.difficultyButtonText}>Medium</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.difficultyButton, styles.hardButton]} onPress={() => startGame('hard')}>
          <Text style={styles.difficultyButtonText}>Hard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      {!isGameOver && (
        <>
          {/* Move the Scoreboard above the game area */}
          <View style={styles.scoreboardContainer}>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Score: {score}</Text>
              <Text style={styles.scoreText}>Wrong: {wrong}</Text>             
            </View>  
          </View>
          <View style={styles.gameArea}>
            <GameEngine
              ref={engine}
              style={[styles.board, { width: boardSize, height: boardSize }]}
              entities={{
                head: {
                  position: [0, 0],
                  size: Constants.CELL_SIZE,
                  updateFrequency: getSnakeSpeed(difficulty),
                  nextMove: getSnakeSpeed(difficulty),
                  xspeed: 0,
                  yspeed: 0,
                  moving: false,
                  currentFood: currentFood, // Pass the letter to the Head component
                  renderer: <Head />,
                },
                food: {
                  position: getRandomPositionWithinBounds(),
                  size: Constants.CELL_SIZE,
                  currentFood: currentFood,
                  renderer: <Food />,
                },
                tail: {
                  size: Constants.CELL_SIZE,
                  elements: tail,
                  renderer: <Tail />,
                },
              }}
              systems={[GameLoop]}
              running={isGameRunning}
              onEvent={handleGameEvent}
            />
          </View>
        </>
      )}
      {!isGameOver && (
        <View style={styles.keyboard}>
          {[..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((char) => (
            <TouchableOpacity
              key={char}
              style={styles.keyboardKey}
              onPress={() => handleKeyPress(char)}
            >
              <Text style={styles.keyboardText}>{char}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {isGameOver && (
        <View style={styles.restartContainer}>
          <Text style={styles.gameover}> Game Over! </Text>
          <TouchableOpacity style={styles.restartButton} onPress={resetGame}>
            <Text style={styles.restartButtonText}>Restart Game</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const { width, height } = Dimensions.get('window');

// Base unit size, equivalent to 1em
const baseUnit = width * 0.01; // 1% of screen width as base unit

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6e0b5", // Light beige background for a soft and welcoming feel.
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: baseUnit * 6, // Equivalent to 2em
    fontWeight: 'bold',
    color: '#66545e',
    textShadowColor: '#a39193',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 5,
  },
  selectDifficultyText: {
    fontSize: baseUnit * 4, // Equivalent to 1.5em
    marginVertical: baseUnit * 2, // Using relative spacing
    color: '#66545e',
    fontStyle: 'italic',
  },
  difficultyButton: {
    padding: baseUnit * 3, // Relative padding
    margin: baseUnit * 2, // Relative margin
    borderRadius: baseUnit * 1.2, // Relative radius
    shadowColor: '#000',
    shadowOffset: { width: 0, height: baseUnit * 0.5 },
    shadowOpacity: 0.2,
    shadowRadius: baseUnit * 1,
    elevation: 5,
  },
  easyButton: {
    backgroundColor: '#aa6f2c',
  },
  mediumButton: {
    backgroundColor: '#f1a655',
  },
  hardButton: {
    backgroundColor: '#ff6f61',
  },
  difficultyButtonText: {
    fontSize: baseUnit * 4, // Relative font size
    color: '#000000',
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: baseUnit * 2,
    //borderWidth: baseUnit * 2,
    width:"100%",
    height:"100%"
  },
  board: {
    width: '90%', // Width as percentage to make it responsive
    //aspectRatio: 1, // Maintains square shape
    borderWidth: baseUnit * 2, // Relative border width
    borderColor: '#964B00',
    backgroundColor: '#FFAB56',
    borderRadius: baseUnit * 0.8, 
  },
  keyboard: {
    bottom: baseUnit * 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: baseUnit,
    backgroundColor: '#f6e0b5',
  },
  keyboardKey: {
    width: '13%', // Relative width for responsiveness
    aspectRatio: 1, // Keeps the keys square
    margin: baseUnit * 0.3, // Relative margin
    borderRadius: baseUnit * 3,
    backgroundColor: '#FF8B17',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: baseUnit * 0.4 },
    shadowOpacity: 0.2,
    shadowRadius: baseUnit * 0.3,
    elevation: 5,
  },
  keyboardText: {
    fontSize: baseUnit * 5, // Relative font size
    color: '#562B00',
    fontWeight: 'bold',
  },
  scoreContainer: {
    backgroundColor: '#FF8B17',
    padding: baseUnit,
    borderRadius: baseUnit * 0.8,
    alignItems: 'left',
  },
  scoreText: {
    fontSize: baseUnit * 5, // Relative font size
    fontWeight: 'bold',
    color: '#721c24',
  },
  restartContainer: {
    position: 'absolute',
    bottom: baseUnit * 100,
    left: 0,
    right: 0,
    alignItems: 'center',
   
  },
  restartButton: {
    backgroundColor: '#562B00',
    padding: baseUnit * 1.2,
    borderRadius: baseUnit * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: baseUnit * 0.4 },
    shadowOpacity: 0.2,
    shadowRadius: baseUnit * 0.3,
    elevation: 5,
    borderRadius: baseUnit * 1.2, // Relative radius
  },
  restartButtonText: {
    fontSize: baseUnit * 8, // Relative font size
    color: '#fff',
    fontWeight: 'bold',
  },
  gameover: {
    textAlign: "cnter",
    bottom: baseUnit * 5,
    fontSize: baseUnit * 15,
    color: "red",

  }
  
 
});
