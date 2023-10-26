import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
} from "react-native";

const DashboardScreen = ({ navigation }) => {   

  return (
    <View style={styles.container}>
      <Text>hello , Welcome to Dashboard</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  }
});

export default DashboardScreen;
