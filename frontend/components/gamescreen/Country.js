import React from 'react';
import { Text, View, Button } from 'react-native';

function Country({ navigation }) {
  return (
    <View>
      <Text>Country</Text>
      {/* Navigation Button to ScreenB */}
      <Button
        title="Play with friend"
        onPress={() => navigation.navigate('playwithfriend')}
      />
    </View>
  );
}

export default Country;
