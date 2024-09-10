import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin'; // Google Sign-in package
import Google from '../assets/logo/Google.png'; // Make sure the path is correct for your project

function Login() {
  const [isPressed, setIsPressed] = useState(false);

  // Configure Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '728520045081-jf2tetm6rkrlt582stmft298q25p38c8.apps.googleusercontent.com', // Your Web Client ID
      offlineAccess: true, // If you want to get refresh tokens
    });
  }, []); // This runs only once when the component mounts

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices(); // Ensure Google Play Services are available
      const userInfo = await GoogleSignin.signIn(); // Sign in with Google
      const idToken = userInfo.idToken; // You can pass this to your backend or use in your logic
      console.log("Google ID Token", idToken);
    } catch (error) {
      console.error("Google Sign-In Error", error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.instructionText}>Sign in using your Google account</Text>
      </View>
      <TouchableOpacity
        style={[styles.googleButton, isPressed && styles.pressedGoogleButton]} // Apply styles when pressed
        onPressIn={() => setIsPressed(true)}  // Triggered when the button is pressed
        onPressOut={() => setIsPressed(false)} // Triggered when the button is released
        onPress={handleGoogleSignIn}  // Trigger the Google Sign-In flow
      >        
        <Image source={Google} style={styles.googleLogo} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', // Pushes the button to the bottom
    alignItems: 'center',
    backgroundColor: '#d1c4e9', // Light purple background
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center', // Centers the text in the available space
  },
  instructionText: {
    fontSize: 28, // Larger font size for better visibility
    fontWeight: 'bold', // Bold text
    color: '#4a148c', // Dark purple color for text
    marginBottom: 20, // Adds spacing between the text and the button
    textAlign: 'center', // Center the text
    paddingHorizontal: 20, // Adds some padding to the sides
  },
  googleButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 30, // Add some margin to give space between the button and the bottom of the screen
  },
  pressedGoogleButton: {
    transform: [{ scale: 0.95 }], // Slightly smaller when pressed
  },
  googleLogo: {
    width: 150, // Adjust the width of the logo as needed
    height: 50,  // Adjust the height of the logo as needed
    resizeMode: 'contain', // Ensures the logo keeps its aspect ratio
  },
});

export default Login;
