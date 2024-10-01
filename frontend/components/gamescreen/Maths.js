import React from 'react';
import { Text, View, Button, TouchableOpacity } from 'react-native';

function Maths({ navigation }) {
  return (
    <View>
      {/* Navigation Button to ScreenB */}
      <Button
        title="Play with friend"
        onPress={() => navigation.navigate('Mathsplayscreen')}
      />
    </View>
  );
}

export default Maths;
