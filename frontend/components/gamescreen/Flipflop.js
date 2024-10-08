import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';


function Flipflop({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.squareButton} 
        onPress={() => navigation.navigate("Gameplayflipflopscreen")}
      >
        {/* <Image 
          source={require('../assets/fruits.png')} // Replace with your image path
          style={styles.image} 
        /> */}
        <Text style={styles.buttonText}>Play Now</Text>
      </TouchableOpacity> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareButton: {
    width: 100,  // Set square size
    height: 100,
    backgroundColor: '#FF6347', // Background color for the square button
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10, // Optional: for rounded corners
    marginBottom: 20, // Space between button and other components
  },
  image: {
    width: 60,
    height: 60,
    marginBottom: 5, // Space between image and text
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Flipflop;
