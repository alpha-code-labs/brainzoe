import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../redux/features/userSlice';
import { Text, View, StyleSheet } from 'react-native';

const Profile = () => {
  const dispatch = useDispatch();
  
  // Access the user from the auth state
  const {user}  = useSelector((state) => state.userAuth || {}); // Ensure you access 'auth'
  
  // Log user data to check its structure
  console.log("Show me my user: ", user.userName);

  useEffect(() => {
    dispatch(fetchUserProfile()); // Fetch the user profile when the component mounts
  }, []);

  // Ensure that you handle cases where userName or coins may not exist yet
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Username: <Text style={styles.value}>{user.userName || 'Loading...'}</Text></Text>
      <Text style={styles.label}>Coins: <Text style={styles.value}>{user.coins != null ? user.coins : 'Loading...'}</Text></Text>
    </View>
  );
};

// Add some basic styles to make the profile look good
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  value: {
    fontSize: 18,
    color: '#4a90e2',
  },
});

export default Profile;
