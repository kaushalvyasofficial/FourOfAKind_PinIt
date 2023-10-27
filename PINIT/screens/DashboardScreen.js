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
  SafeAreaView,
  ScrollView,
  FlatList,
} from "react-native";
import { Linking } from "react-native";
import FloatingButton from "./component/FloatingButton";
import Logoutbtn from "../assets/images/log-in-outline";
import DownLoad from "../assets/images/download";
import MapPin from "../assets/images/map-pin";
import { useBackHandler } from "@react-native-community/hooks";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { db } from "../FirebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";

import CarouselCardsEvent from "./component/Carousel-Event";
import CarouselCardsNotice from "./component/Carousel-Notice";
const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  // Default to 'admin'
  const [backCount, setBackCount] = useState(0);
  useBackHandler(() => {
    setBackCount(backCount + 1);
    if (backCount >= 1) {
      setBackCount(0);
      Alert.alert(
        "Logout",
        "Are you sure you want to Exit?",
        [
          { text: "No", style: "cancel" },
          {
            text: "Yes",
            onPress: () => BackHandler.exitApp(),
          },
        ],
        { cancelable: true }
      );
    }
  });
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Home Screen</Text>
      <ScrollView>
        <CarouselCardsNotice />
        <CarouselCardsEvent />
      </ScrollView>
      {/* <CarouselCards /> */}
    </View>
  );
};

const EventScreen = () => {
  const [eventData, setEventData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Ongoing");

  useEffect(() => {
    // Fetch events from Firestore
    const fetchEvents = async () => {
      try {
        const q = collection(db, "Event"); // Use collection to reference the 'Event' collection
        const querySnapshot = await getDocs(q);
        const eventData = querySnapshot.docs.map((doc) => doc.data());
        setEventData(eventData);
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

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // Filter events based on the selected option (Ongoing or Upcoming)
  // Filter events based on the selected option (Ongoing or Upcoming)
  const filteredEvents = eventData.filter((item) => {
    const eventDateStr = item.eventDate; // Replace with the actual field name from your data

    if (eventDateStr) {
      const [day, month, year] = eventDateStr.split("/").map(Number);
      const eventDate = new Date(year, month - 1, day); // Parse the event date

      if (selectedOption === "Ongoing") {
        return eventDate >= new Date(); // Filter ongoing events
      } else if (selectedOption === "Upcoming") {
        return eventDate < new Date(); // Filter upcoming events
      }
    }
    return false; // Exclude events with undefined or invalid date
  });

  return (
    <View>
      <View style={styleEvent.buttonContainer}>
        <TouchableOpacity
          style={[
            styleEvent.button,
            selectedOption === "Ongoing" && styleEvent.selectedButton,
          ]}
          onPress={() => handleOptionSelect("Ongoing")}
        >
          <Text
            style={[
              styleEvent.buttonText,
              selectedOption !== "Ongoing" && styleEvent.unselectedText,
            ]}
          >
            Ongoing
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styleEvent.button,
            selectedOption === "Upcoming" && styleEvent.selectedButton,
          ]}
          onPress={() => handleOptionSelect("Upcoming")}
        >
          <Text
            style={[
              styleEvent.buttonText,
              selectedOption !== "Upcoming" && styleEvent.unselectedText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
      </View>

      <SafeAreaView style={styleEvent.container}>
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id} // Replace with the actual field name for the unique identifier
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styleEvent.card}
              onPress={() => handlePress(item)}
            >
              <View>
                {/* Render event details here */}
                <Text>{item.eventName}</Text>
                <Text>{item.eventDescription}</Text>
                {/* ... other event details */}
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </View>
  );
};

const styleEvent = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    flex: 1,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
  },
  selectedButton: {
    borderBottomWidth: 2,
    borderColor: "#635BFF",
  },
  unselectedText: {
    color: "#A3ACBA",
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "Inter300",
    color: "#000",
  },
});

const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/nexus-e61fe.appspot.com/o/notices%2F1698431643227-IMG-20231027-WA0002.jpg?alt=media&token=0a2de394-0ec4-40c1-9418-cbfd949d17d8",
        }}
        style={{ width: 200, height: 200 }}
      />
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  pinDiv: {
    flex: 1,
    justifyContent: "center",
    marginTop: "10%",
    // backgroundColor: '#000',
  },
  pinImage: {
    // padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    // flex: 1,
    justifyContent: "center",
    width: "70%",
    marginBottom: 40,
  },
  button: {
    flex: 1,
    height: 60,
    // borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#A3ACBA",
    // marginBottom: 20,
  },
  selectedButton: {
    borderBottomWidth: 2, // Add underline
    borderColor: "#635BFF", // Color of underline
  },
  unselectedText: {
    color: "#A3ACBA",
    // borderBottomWidth: 2,
    borderColor: "#000",
    // backgroundColor: '#000',
  },
  unselectedButton: {
    // backgroundColor: '#000',
    borderBottomWidth: 2, // Add underline
    borderColor: "#dddddd",
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "Inter300",
    // fontWeight: 'bold',
    color: "#000",
  },
  inputContainer: {
    flex: 3,
    width: "80%",
  },
  mailContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E4DFDF",
    borderRadius: 16,
    marginBottom: 20,
  },
  mailInput: {
    flex: 1,
    fontFamily: "Inter300",
    height: 60,
    paddingHorizontal: 10,
  },
  icon: {
    padding: 20,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E4DFDF",
    borderRadius: 16,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    height: 60,
    fontFamily: "Inter300",
    paddingHorizontal: 10,
  },
  showPasswordButton: {
    padding: 10,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  p: {
    fontFamily: "Inter300",
    color: "#120D26",
  },
  loginButton: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#635BFF",
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    fontSize: 20,
    paddingHorizontal: "30%",
    fontFamily: "Inter400",
    // fontWeight: 'bold',
    color: "#fff",
  },
  spinnerText: {
    color: "#FFF",
  },
});

export default DashboardScreen;
