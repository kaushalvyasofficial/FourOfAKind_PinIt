import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import Logo from "../assets/images/logo";

const HomeScreen = ({ navigation }) => {


  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("Login");
    }, 1500);
  });

  return (
    <View style={styles.container}>
      <Logo />
      <Text>Pin It</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignContent: "center",
  },
});

export default HomeScreen;
