import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons"; // You can use FontAwesome5 for the plus icon
import AddEvent from "../../assets/images/addEvent";

const FloatingButton = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
    <AddEvent width={60} height={60} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 16,
    width: 50,
    height: 50,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
});

export default FloatingButton;
