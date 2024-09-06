import React from 'react';
import { View, StyleSheet, Text, Modal, TouchableOpacity } from 'react-native';

function Gamewin({ visible, onPlayAgain }) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.winMessage}>Congratulations! You won!</Text>
          <Text style={styles.winCountdown}>Next round starts in: </Text>
          <TouchableOpacity onPress={onPlayAgain} style={styles.playAgainButton}>
            <Text style={styles.playAgainButtonText}>Back </Text>
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
  winMessage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 10,
  },
  winCountdown: {
    fontSize: 24,
    color: '#333',
    marginBottom: 20,
  },
  playAgainButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fdbb2d',
    borderRadius: 5,
  },
  playAgainButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Gamewin;
