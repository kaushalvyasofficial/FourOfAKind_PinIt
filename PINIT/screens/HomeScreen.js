import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import Logo from "../assets/images/logo";
import OnBoardlogo from "../assets/images/onboardlogo";

const HomeScreen = ({ navigation }) => {
  setTimeout(() => {
    navigation.navigate("Login");
  }, 1500);

  return (
    <View style={styles.logo}>
      <OnBoardlogo />
    </View>
  );
};
const styles = StyleSheet.create({
  logo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default HomeScreen;
