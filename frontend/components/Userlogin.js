import React, { useState } from 'react';
import { SafeAreaView, TextInput, Button, StyleSheet, Text, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';

const Userlogin = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      console.log('Token stored successfully');
    } catch (error) {
      console.error('Failed to store the token', error);
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }

    try {
      // Make a login request to your server
      const response = await axios.post(`http://192.168.1.13:9001/auth/login`, {
        userName: username,
        password: password,
      });

      console.log('API Response:', response.data);

      if (response.status === 200) {
        const token = response.data.jwt;
        console.log('Token:', token);
        
        // Store the token in AsyncStorage after successful login
        await storeToken(token);

        Alert.alert('Success', 'Login Successful');
        
        // Navigate to home screen or any other screen after successful login
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Login failed');
      } 
    } catch (error) {
      if (error.response) {
        console.error('Error Response:', error.response);
        Alert.alert('Login Failed', error.response.data.message || 'An error occurred');
      } else if (error.request) {
        console.error('No Response:', error.request);
        Alert.alert('Error', 'No response received from the server');
      } else {
        console.error('Error Message:', error.message);
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

      {/* Add Registration Navigation Link */}
      <TouchableOpacity onPress={() => navigation.navigate('login')}>
        <Text style={styles.registerLink}>Don't have an account? Register here</Text>
      </TouchableOpacity>
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
  registerLink: {
    marginTop: 20,
    fontSize: 16,
    color: '#1E90FF',
    textAlign: 'center',
  },
});

export default Userlogin;
