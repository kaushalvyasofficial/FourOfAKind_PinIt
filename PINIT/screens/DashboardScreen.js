import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
} from "react-native";

import HomeLogo from "../assets/images/home";
import EventLogo from "../assets/images/Calendar";
import SearchLogo from "../assets/images/search";
import ProfileLogo from "../assets/images/profile";
import FloatingButton from "./component/FloatingButton";
import Logoutbtn from "../assets/images/log-in-outline";
import { useRoute } from "@react-navigation/native";
import { useBackHandler } from '@react-native-community/hooks'
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";



const Tab = createBottomTabNavigator();

const HomeScreen = () => {

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
    </View>
  );
};

const EventScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
    </View>
  );
};

const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Search Screen</Text>
    </View>
  );
};

const ProfileScreen = ({ navigation }) => {

  async function handleClick () {
    await AsyncStorage.clear();
    navigation.navigate("Login");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Gourav</Text>

      <View>
        <TouchableOpacity style={styles.btn} onPress={handleClick}>
          <Logoutbtn
            width={40}
            height={40}
          />
          <Text style={styles.txt}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DashboardScreen = ({ navigation }) => {

  useBackHandler(() => {
    navigation.navigate("Explore");
  })

  function onClick() {
    navigation.navigate("AddData");
  }
  //   console.log("DashboardScreen");
  return (
    <Tab.Navigator
      tabBarOprions={{
        activeTintColor: "white",
        inactiveTintColor: "black",
        showLabel: false,
      }}
    >
      <Tab.Screen
        name="Explore"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <HomeLogo color="#635bff" size="50" />
          ),
        }}
      />
      <Tab.Screen
        name="Event"
        component={EventScreen}
        options={{
          tabBarIcon: ({ color, size }) => <EventLogo color="#635bff" />,
        }}
      />

      <Tab.Screen
        name="FloatingButtonScreen"
        component={FloatingButton}
        options={{
          tabBarButton: () => (
            <View style={{ flex: 1, alignItems: "center" }}>
              <FloatingButton
                onPress={onClick}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => <SearchLogo />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <ProfileLogo />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    flexDirection: "row",
    height: "20%",
    // backgroundColor: "#000",
    top: "80%",
    left: "-80%",
  },
  h1: {
    color: "#30313D",
    fontSize: 48,
    fontWeight: "medium",
  },
  txt: {
    color: "#30313D",
    fontSize: 24,
    fontWeight: "medium",
    marginHorizontal: 10,
  },
});

export default DashboardScreen;
