

import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import axios from 'axios';
import {API_BASE_URL} from '@env'

const Register = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }
 
    
    try {
      // Send a registration request to your server
      const response = await axios.post('http://192.168.1.14:9001/auth/register', {
        userName: username,
        password: password,
      });

   
      if (response.status === 201) {
        Alert.alert('Success', 'Registration Successful');
        // After successful registration, navigate to the login screen
        navigation.navigate('Userlogin');
      } else {
        Alert.alert('Error', 'Registration failed');
      } 
    } catch (error) {
      // Display error message based on the response
      if (error.response) {
        Alert.alert('Registration Failed', error.response.data.message || 'An error occurred');
      } else {
        Alert.alert('Error', 'Failed to connect to the server');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Register</Text>

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

      <Button title="Register" onPress={handleRegister} />
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

export default Register;
