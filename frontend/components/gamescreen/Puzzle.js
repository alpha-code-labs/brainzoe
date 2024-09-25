import React from 'react';
import { Text, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

function Puzzle() {
  const navigation = useNavigation(); // Use the hook to access navigation

  return (
    <View>
      <Button 
        title="Play with computer" 
        onPress={() => navigation.navigate('Mazerunner')} 
      />
    </View>
  );
}

export default Puzzle;
