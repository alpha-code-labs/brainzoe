import React from 'react';
import { Text, View, Button } from 'react-native';

function Wordmatch({ navigation }) {
  return (
    <View>
  
      {/* Navigation Button to ScreenB */}
      <Button
        title="Play with friend"
        onPress={() => navigation.navigate('gameplayworldmatchscreen')}
      />
    </View>
  );
}

export default Wordmatch;
