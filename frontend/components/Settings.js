import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, AppState } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';

// Initialize sound object
const song = new Sound('music.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('Failed to load the sound', error);
    return;
  }
});

function Settings() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'active') {
        playSound();
      } else {
        song.pause(() => console.log('Paused due to app background or inactive state'));
        setIsPlaying(false);
      }
    };

    // Listen to app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Play sound when the component mounts and the app is active
    playSound();

    // Cleanup function to stop sound and remove event listener when component unmounts
    return () => {
      song.stop(() => console.log('Stopped due to component unmount'));
      subscription.remove(); // Correct way to remove the event listener
    };
  }, []);

  const playSound = () => {
    song.play((success) => {
      if (success) {
        console.log('Successfully finished playing');
      } else {
        console.log('Playback failed due to audio decoding errors');
      }
    });
    setIsPlaying(true);
  };

  const toggleMusic = () => {
    if (isPlaying) {
      song.pause(() => console.log('Paused by user'));
    } else {
      playSound();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={styles.settingsContainer}>
      <TouchableOpacity style={styles.settingsButton} onPress={() => setModalVisible(true)}>
        <Icon name="settings-outline" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Modal for Popup */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Settings</Text>
            <TouchableOpacity onPress={toggleMusic} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>
                {isPlaying ? 'Turn Music Off' : 'Turn Music On'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({
  settingsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#9575CD',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});
