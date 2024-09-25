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
      const response = await axios.get(`http://${API_BASE_URL}:9001/user/profile`, {
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


// authUtils.js
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Alert } from 'react-native';
// import { API_BASE_URL } from '@env';

// // Function to store token and expiration in AsyncStorage
// const storeTokenWithExpiration = async (token, expiresIn) => {
//   try {
//     const expirationTime = Date.now() + expiresIn * 1000; // Convert 'expiresIn' from seconds to milliseconds
//     await AsyncStorage.setItem('token', token);
//     await AsyncStorage.setItem('tokenExpiration', expirationTime.toString()); // Store expiration as string
//   } catch (error) {
//     console.error('Failed to store token and expiration:', error);
//   }
// };

// // Function to retrieve the token from AsyncStorage
// const getToken = async () => {
//   try {
//     const token = await AsyncStorage.getItem('token');
//     const tokenExpiration = await AsyncStorage.getItem('tokenExpiration');
    
//     if (token && tokenExpiration) {
//       const currentTime = Date.now();
      
//       if (currentTime < parseInt(tokenExpiration, 10)) {
//         return token; // Return token if it hasn't expired
//       } else {
//         console.log('Token has expired');
//         await AsyncStorage.removeItem('token'); // Clear expired token
//         await AsyncStorage.removeItem('tokenExpiration');
//         return null;
//       }
//     } else {
//       console.log('No token found or no expiration set');
//       return null;
//     }
//   } catch (error) {
//     console.error('Failed to retrieve the token:', error);
//     return null;
//   }
// };

// // Function to send authenticated request to the backend
// export const sendAuthenticatedRequest = async () => {
//   const token = await getToken();

//   if (token) {
//     try {
//       const response = await axios.get(`http://${API_BASE_URL}:9001/user/profile`, {
//         headers: {
//           'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
//         },
//       });
    
//       console.log('Protected Data:', response.data);
//       return response.data; // Return the actual response data here
//     } catch (error) {
//       console.error('Failed to fetch protected data:', error);
//       return null; // Return null if there is an error
//     }
//   } else {
//     Alert.alert('Error', 'Token is not available or has expired. Please log in.');
//     return null; // Return null if no token is available
//   }
// };

// // Example usage: Store token with expiration time (48 hours in seconds = 172800)
// storeTokenWithExpiration('jwt', 172800); // Call this after successful login
