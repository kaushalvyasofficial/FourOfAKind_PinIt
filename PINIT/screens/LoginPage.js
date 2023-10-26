import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Welcome to the Login Screen!</Text>
      <Button
        title="Login Page"
      />
    </View>
  );
};

export default HomeScreen;
