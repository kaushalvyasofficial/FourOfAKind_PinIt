import { useState, useEffect } from "react";
import * as React from "react";
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
  SafeAreaView,ScrollView,
  FlatList
} from "react-native";
import { Linking } from 'react-native';
import FloatingButton from "./component/FloatingButton";
import Logoutbtn from "../assets/images/log-in-outline";
import { useBackHandler } from "@react-native-community/hooks";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { db } from "../FirebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";

import CarouselCards from "./component/CarouselComponent";
const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const [backCount, setBackCount] = useState(0);
  useBackHandler(() => {
    setBackCount(backCount + 1);  
    if(backCount >= 1){
      setBackCount(0);
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
  }})
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Home Screen</Text>
      <ScrollView>
        <CarouselCards />
      </ScrollView>
      {/* <CarouselCards /> */}
    </View>
  );
};

const EventScreen = () => {
  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    // Fetch events from Firestore
    const fetchEvents = async () => {
      try {
        const q = collection(db, "Event"); // Use collection to reference the 'Event' collection
        const querySnapshot = await getDocs(q);
        const eventData = querySnapshot.docs.map((doc) => doc.data());
        setEventData(eventData);
        // console.log('Events from Firestore:', eventData);
      } catch (error) {
        console.error("Error fetching events from Firestore:", error);
        // Handle the error as per your application's requirements
      }
    };

    fetchEvents();

    const interval = setInterval(() => {
      fetchEvents();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // console.log("File Download Link : ", eventData.fileDownloadURL);
  function handlePress (item){
      console.log(item.id);
  }
  return (
    <SafeAreaView style={stylesEvent.container}>

      <FlatList 
        data={eventData}
        keyExtractor={(item) => item.id}
        renderItem={({item}) =>(
          <TouchableOpacity style={stylesEvent.card} onPress={(item) =>handlePress(item)}>
            <View>
              

              <Text style={stylesEvent.eventName}>{item.eventName}</Text>
              <Text style={stylesEvent.eventDescription}>{item.eventStartDate} to {item.eventEndDate}</Text>
              <Text style={stylesEvent.eventDescription}>from {item.eventStartTime} to {item.eventEndTime}</Text>
              <Text style={stylesEvent.eventDescription}>At {item.eventLocation}</Text>
              <Text style={stylesEvent.eventDescription}>
                {item.eventDescription} 
              </Text>
              {item.fileDownloadURL && (
                <TouchableOpacity onPress={() => Linking.openURL(item.fileDownloadURL)}>
                  <Text style={styles.fileLink}>Download File</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
      </SafeAreaView>
  );
};
const stylesEvent = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "black",
    shadowOpacity: 0.3,
    marginVertical: 10,
  },
  image: {
    // width: "100%",
    // height: 200,
    // borderTopLeftRadius: 8,
    // borderTopRightRadius: 8,
    resizeMode: "cover",
  },
  eventName: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 16,
  },
  eventDescription: {
    fontSize: 16,
    margin: 16,
    marginBottom: 20,
  },
});

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
  // useBackHandler(() => {
  //   navigation.navigate("Explore");
  // });

  function onClick() {
    navigation.navigate("AddData");
  }

  const screenOptions = {
    tabBarShowLabel: false,
    // headerShown : false ,
    tabBarStyle: {
      position: "absolute",
      bottom: 0,
      right: 0,
      left: 0,
      elevation: 0,
      height: "7%",
      backgroundColor: "#fff",
    },
  };
  //   console.log("DashboardScreen");
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Explore"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <MaterialIcons
                  name="explore"
                  size={28}
                  color={focused ? "#635bff" : "#bac3cc"}
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Event"
        component={EventScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <AntDesign
                  name="calendar"
                  size={28}
                  color={focused ? "#635bff" : "#bac3cc"}
                />
              </View>
            );
          },
        }}
      />

      <Tab.Screen
        name="FloatingButtonScreen"
        component={FloatingButton}
        options={{
          tabBarButton: () => (
            <View style={{ flex: 1, alignItems: "center", marginBottom: "6%" }}>
              <FloatingButton onPress={onClick} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Feather
                  name="search"
                  size={28}
                  color={focused ? "#635bff" : "#bac3cc"}
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Feather
                  name="user"
                  size={28}
                  color={focused ? "#635bff" : "#bac3cc"}
                />
              </View>
            );
          },
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
