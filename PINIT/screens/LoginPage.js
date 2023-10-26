import React from 'react';
import { View, Text, Button , StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Welcome to the Login Screen!</Text>
      <Button
        title="Login Page"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center', 
    alignContent: 'center', 
  },
});

export default HomeScreen;
