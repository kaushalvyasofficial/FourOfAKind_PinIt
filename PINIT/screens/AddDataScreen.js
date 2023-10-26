import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const AddDataScreen = ({ navigation }) => {
  return (
    <View style={styles.logo}>
      <Text>hello this is me </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  logo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default AddDataScreen;
