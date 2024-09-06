import React from 'react'
import { Text,View,StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

function Maths({navigation}) {
  return (
    <View style={styles.container}>
   <TouchableOpacity 
      style={styles.squareButton}
      onPress={() => navigation.navigate("Mathsplayscreen")}>
     <Text style={styles.buttonText}>Play Now</Text>
    </TouchableOpacity>
    </View>
  )
}

export default Maths


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