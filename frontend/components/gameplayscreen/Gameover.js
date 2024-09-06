import React from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity } from 'react-native';

function Gameover({ score, visible, onRestart }) {

  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <Text style={styles.scoreText}>Final Score: {score}</Text>
          <TouchableOpacity onPress={onRestart} style={styles.restartButton}>
            <Text style={styles.restartButtonText}>Restart Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 24,
    color: '#333',
    marginBottom: 20,
  },
  restartButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fdbb2d',
    borderRadius: 5,
  },
  restartButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Gameover;
