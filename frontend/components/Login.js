// import React, { useState, useEffect } from 'react';
// import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
// import { GoogleSignin } from '@react-native-google-signin/google-signin'; // Google Sign-in package
// import Google from '../assets/logo/Google.png'; // Make sure the path is correct for your project

// function Login() {
//   const [isPressed, setIsPressed] = useState(false);

// //   Configure Google Sign-In
//   useEffect(() => {
//     GoogleSignin.configure({
//       webClientId: '259813186472-pb9tjg4e6mpcvto7leb47bhsoouhf39f.apps.googleusercontent.com', // Your Web Client ID
//       offlineAccess: true, // If you want to get refresh tokens
//     });
//   }, []); 
//   const handleGoogleSignIn = async () => {
   
    
//     try {
//         console.log("error after try box");
        
//       await GoogleSignin.hasPlayServices(); // Ensure Google Play Services are available
//       console.log("after hasplayServices");
//       const userInfo = await GoogleSignin.signIn(); // Sign in with Google
//       const idToken = userInfo.idToken;
//       console.log("Google ID Token", idToken);
//     } catch (error) {
//       console.error("Google Sign-In Error", error); // Add detailed logging
//       alert("Error: " + error.message); // Show error message to understand the cause
//     }
//   };
  

//   return (
//     <View style={styles.container}>
//       <View style={styles.contentContainer}>
//         <Text style={styles.instructionText}>Sign in using your Google account</Text>
//       </View>
//       <TouchableOpacity
//         style={[styles.googleButton, isPressed && styles.pressedGoogleButton]} // Apply styles when pressed
//         onPressIn={() => setIsPressed(true)}  // Triggered when the button is pressed
//         onPressOut={() => setIsPressed(false)} // Triggered when the button is released
//         onPress={handleGoogleSignIn}  // Trigger the Google Sign-In flow
//       >        
//         <Image source={Google} style={styles.googleLogo} />
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-end', // Pushes the button to the bottom
//     alignItems: 'center',
//     backgroundColor: '#d1c4e9', // Light purple background
//   },
//   contentContainer: {
//     flex: 1,
//     justifyContent: 'center', // Centers the text in the available space
//   },
//   instructionText: {
//     fontSize: 28, // Larger font size for better visibility
//     fontWeight: 'bold', // Bold text
//     color: '#4a148c', // Dark purple color for text
//     marginBottom: 20, // Adds spacing between the text and the button
//     textAlign: 'center', // Center the text
//     paddingHorizontal: 20, // Adds some padding to the sides
//   },
//   googleButton: {
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginBottom: 30, // Add some margin to give space between the button and the bottom of the screen
//   },
//   pressedGoogleButton: {
//     transform: [{ scale: 0.95 }], // Slightly smaller when pressed
//   },
//   googleLogo: {
//     width: 150, // Adjust the width of the logo as needed
//     height: 50,  // Adjust the height of the logo as needed
//     resizeMode: 'contain', // Ensures the logo keeps its aspect ratio
//   },
// });

// export default Login;



import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const storeToken = async (token) =>{
    try{
        await AsyncStorage.setItem('token', token);
        console.log("Token stored sucessfully");     
    }
    catch(error){        
        console.error('Failed to store the token', error)
    }
  };


  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.11:9001/auth/register', {
        userName: username,
        
        password: password,
    });
   
      if (response.status === 201) {
        Alert.alert('Success', 'Login Successful');
        const data = response.data

        // console.log(data);

        const token = data.jwt
        console.log('Token:',token);
        

        //Store the token in AsyncStorage
        await storeToken(token)

        
        // Handle successful login (e.g., navigate to another screen)
        navigation.navigate('Home')
      } else {
        Alert.alert('Error', 'Login failed');
      } 
    } catch (error) {
      // Display error message based on the response
      if (error.response) {
        Alert.alert('Login Failed', error.response.data.message || 'An error occurred');
      } else {
        Alert.alert('Error', 'Failed to connect to the server');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
});

export default Login;
