import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";

export const SLIDER_WIDTH = Dimensions.get('window').width + 80;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

export default function CarouselCardItem({ item, index }) {
  return (
    <View style={styles.container} key={index}>
      <TouchableOpacity onPress={() => { console.log("Pressed") }}>
        <Image
          source={{ uri: item.imgUrl }}
          style={styles.image}
        />
        <Text style={styles.header}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightblue',
    borderRadius: 8,
    width: ITEM_WIDTH,
    margin: "2%",
    padding: "3%",
    paddingRight: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: ITEM_WIDTH,
    height: 200,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  header: {
    color: "#222",
    fontSize: 28,
    fontWeight: "bold",
    paddingLeft: 20,
    paddingTop: 20,
  },
  body: {
    color: "#222",
    fontSize: 18,
    paddingLeft: 20,
    paddingRight: 20, // Changed from paddingLeft to paddingRight
  },
});
