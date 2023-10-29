import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Linking
} from "react-native";

import DownLoad from "../../assets/images/download";
import MapPin from "../../assets/images/map-pin";

export const SLIDER_WIDTH = Dimensions.get("window").width + 80;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

export default function CarouselCardItem({ item, index }) {
  return (
    <View style={styles.container} key={index}>
      <TouchableOpacity
        onPress={() => {
          console.log("Pressed");
        }}
      >
        <Image source={{ uri: item.imgUrl }} style={styles.image} />
        <Text style={styles.header}>{item.title}</Text>
        <Text style={styles.body}>{item.body}</Text>
        <View style={styles.flex}>
          <View style={styles.dwn}>
            <MapPin width={20} height={20} />
            <Text style={styles.eventLocation}> {item.eventLocation} </Text>
          </View>
          <Text style={styles.eventTime}>{item.eventDate}</Text>
        </View>
        <View style={styles.flex}>
          <View style={styles.dwn}>
            <DownLoad width={20} height={20} />
            {item.fileDownloadURL && (
              <TouchableOpacity
                onPress={() => Linking.openURL(item.fileDownloadURL)}
              >
                <Text style={styles.fileLink}>Download File</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.eventTime}>{item.eventTime}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fafafa",
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
    marginBottom: "20%",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  image: {
    width: ITEM_WIDTH,
    height: 200,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  header: {
    fontSize: 20,
    fontFamily: "Inter500",
    color: "#30313D",
  },
  body: {
    fontSize: 14,
    fontFamily: "Inter300",
    color: "#606060",
    marginBottom: 10,
    height: 42,
  },
  eventLocation: {
    fontSize: 14,
    fontFamily: "Inter300",
    color: "#716E90",
  },
  fileLink: {
    fontSize: 12,
    fontFamily: "Inter500",
    paddingHorizontal: 5,
    color: "#716E90",
    textDecorationLine: "underline",
  },
  eventTime: {
    fontSize: 12,
    fontFamily: "Inter400",
    color: "#716E90",
  },
  dwn: {
    display: "flex",
    flexDirection: "row",
  },
});
