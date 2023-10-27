import { useState } from "react";
import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
  Alert,
  BackHandler,
} from "react-native";
import EventLogo from "../assets/images/Calendar";
import SearchLogo from "../assets/images/search";
import ProfileLogo from "../assets/images/profile";
import FloatingButton from "./component/FloatingButton";
import Logoutbtn from "../assets/images/log-in-outline";
import { useBackHandler } from "@react-native-community/hooks";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 


import CarouselCards from "./component/CarouselComponent";
const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  useBackHandler(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to Exit?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => BackHandler.exitApp(),
        },
      ],
      { cancelable: true }
    );
  })
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Home Screen</Text>
      <CarouselCards />
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
  async function handleClick() {
    await AsyncStorage.clear();
    navigation.navigate("Login");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Gourav</Text>

      <View>
        <TouchableOpacity style={styles.btn} onPress={handleClick}>
          <Logoutbtn width={30} height={30} />
          <Text style={styles.txt}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const DashboardScreen = ({ navigation }) => {
  useBackHandler(() => {
    navigation.navigate("Explore");
  });

  function onClick() {
    navigation.navigate("AddData");
  }

  const screenOptions = {
    tabBarShowLabel : false,
    // headerShown : false ,
    tabBarStyle :{
      position:'absolute',
      bottom:0,
      right:0,
      left:0,
      elevation:0,
      height: "8%",
      backgroundColor: '#fff',
    }

  }
  //   console.log("DashboardScreen");
  return (
    <Tab.Navigator
      screenOptions={screenOptions}
    >
      <Tab.Screen
        name="Explore"
        component={HomeScreen}
        options={{
          tabBarIcon:({focused})=>{
            return(
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <MaterialIcons name="explore" size={28} color={focused ? '#635bff' : '#bac3cc'} />
            </View>
            )
          }
        }}
      />
      <Tab.Screen
        name="Event"
        component={EventScreen}
        options={{
          tabBarIcon:({focused})=>{
            return(
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <AntDesign name="calendar" size={28} color={focused ? '#635bff' : '#bac3cc'} />
            </View>
            )
          }
        }}
      />

      <Tab.Screen
        name="FloatingButtonScreen"
        component={FloatingButton}
        options={{
          tabBarButton: () => (
            <View style={{ flex: 1, alignItems: "center", marginBottom:"7%"  }}>
              <FloatingButton onPress={onClick} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon:({focused})=>{
            return(
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Feather name="search" size={28} color={focused ? '#635bff' : '#bac3cc'} />
            </View>
            )
          }
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon:({focused})=>{
            return(
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Feather name="user" size={28} color={focused ? '#635bff' : '#bac3cc'} />
            </View>
            )
          }
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
    // backgroundColor: "#bac3cc",
    top: "80%",
    left: "-80%",
  },
  h1: {
    color: "#30313D",
    fontSize: 32,
    fontFamily: "Inter500",
  },
  txt: {
    color: "#30313D",
    fontSize: 18,
    fontWeight: "medium",
    marginHorizontal: 10,
  },
});

export default DashboardScreen;
