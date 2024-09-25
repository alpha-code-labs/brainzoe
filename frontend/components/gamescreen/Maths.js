import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

function Maths() {
  const navigation = useNavigation(); // Use the navigation hook

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.squareButton}
        onPress={() => navigation.navigate("Mathsplayscreen")}> {/* Use navigation from the hook */}
        <Text style={styles.buttonText}>Play Now</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Maths;

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
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
