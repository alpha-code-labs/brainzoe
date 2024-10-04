// // authUtils.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import {API_BASE_URL} from '@env'
// Function to retrieve the token from AsyncStorage
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token !== null) {
      return token;
    } else {
      console.log('No token found');
      return null;
    }
  } catch (error) {
    console.error('Failed to retrieve the token:', error);
    return null;
  }
};


// Function to send authenticated request to the backend
export const sendAuthenticatedRequest = async () => {
  const token = await getToken();

  if (token) {
    try {
      const response = await axios.get(`http://192.168.1.13:9001/user/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
        },
      });
    
      console.log('Protected Data:', response.data);
      return response.data; // Return the actual response data here
    } catch (error) {
      console.error('Failed to fetch protected data', error);
      return null; // Return null if there is an error
    }
  } else {
    Alert.alert('Error', 'Token is not available. Please log in.');
    return null; // Return null if no token is available
  }
};




