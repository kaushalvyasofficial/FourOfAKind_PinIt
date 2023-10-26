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

import HomeLogo from "../assets/images/home";
import EventLogo from '../assets/images/Calendar'
import SearchLogo from '../assets/images/search'
import ProfileLogo from '../assets/images/profile'

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

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

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Profile Screen</Text>
    </View>
  );
};

const DashboardScreen = ({ navigation }) => {
  console.log("DashboardScreen");
  return (
    <Tab.Navigator>
      <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
                tabBarIcon: ({ color, size }) => (
                    <HomeLogo color='#635bff' size='50' />
                ),
            }} 
      />
      <Tab.Screen 
            name="Event" 
            component={EventScreen}
            options={{
                tabBarIcon: ({ color, size }) => (
                    <EventLogo color='#635bff' />
                ),
            }}
      />
      <Tab.Screen 
            name="Search" 
            component={SearchScreen}
            options={{
                tabBarIcon: ({ color, size }) => (
                    <SearchLogo />
                ),
            }}
      />
      <Tab.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{
                tabBarIcon: ({ color, size }) => (
                    <ProfileLogo />
                ),
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
});

export default DashboardScreen;
