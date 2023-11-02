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
import { collection, getDocs, query, where } from "firebase/firestore";
import Icon from "react-native-vector-icons/FontAwesome";

import CarouselCardsEvent from "./component/Carousel-Event";
import CarouselCardsNotice from "./component/Carousel-Notice";
const Tab = createBottomTabNavigator();

const HomeScreen = ({ navigation }) => {
  // Default to 'admin'
  const [backCount, setBackCount] = useState(0);
  // const navigation = useNavigation();

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

  function handleClick() {
    // console.log("See more clicked");
    navigation.navigate("Event");
  }
  function handleClickNotice() {
    // console.log("See more clicked");
    navigation.navigate("Notice");
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={stylesHome.divCarousel}>
          <Text style={stylesHome.h1}>Recent Notices</Text>
          <TouchableOpacity
            style={stylesHome.seeMoreContainer}
            onPress={handleClickNotice}
          >
            <Text style={stylesHome.seeMoreText}>See more</Text>
            <Icon name="chevron-right" style={stylesHome.seeMoreIcon} />
          </TouchableOpacity>
        </View>
        <CarouselCardsNotice />
        <View style={stylesHome.divCarousel}>
          <Text style={stylesHome.h1}>Recent Events</Text>
          <TouchableOpacity
            style={stylesHome.seeMoreContainer}
            onPress={handleClick}
          >
            <Text style={stylesHome.seeMoreText}>See more</Text>
            <Icon name="chevron-right" style={stylesHome.seeMoreIcon} />
          </TouchableOpacity>
        </View>
        <CarouselCardsEvent />
      </ScrollView>
    </View>
  );
};

const stylesHome = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  h1: {
    fontSize: 24,
    fontFamily: "Inter500",
    paddingHorizontal: 12,
  },
  seeMoreContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  seeMoreText: {
    fontFamily: "Inter400",
    paddingRight: 8,
    fontSize: 15,
    color: "#212121",
  },
  seeMoreIcon: {
    fontSize: 15,
    color: "#212121", // You can choose your preferred color
  },
  divCarousel: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    // marginBottom: 10,
  },
});

const EventScreen = () => {
  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    // Fetch events from Firestore
    const fetchEvents = async () => {
      try {
        const q = collection(db, "Event"); // Use collection to reference the 'Event' collection
        const querySnapshot = await getDocs(q);
        const Data = querySnapshot.docs.map((doc) => doc.data());
        setEventData(Data);

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

  function handlePress(item) {
    console.log(item.eventName);
  }
  return (
    <SafeAreaView style={stylesEvent.container}>
      <FlatList
        data={eventData}
        keyExtractor={(item , id)=>{
          return item.id
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={stylesEvent.card}
            onPress={() => {
              handlePress(item);
            }}
          >
            <View>
              <Image
                source={null || { uri: item.fileDownloadURL }}
                style={{
                  width: "100%",
                  height: 200,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  resizeMode: "cover",
                }}
              />
              <Text style={stylesEvent.eventName}>{item.eventName}</Text>
              <Text style={stylesEvent.eventDescription}>
                {item.eventDescription}
              </Text>

              <View style={stylesEvent.flex}>
                <View style={stylesEvent.dwn}>
                  <MapPin width={20} height={20} />
                  <Text style={stylesEvent.eventLocation}>
                    {" "}
                    {item.eventLocation}{" "}
                  </Text>
                </View>
                <Text style={stylesEvent.eventTime}>{item.eventDate}</Text>
              </View>
              <View style={stylesEvent.flex}>
                <View style={stylesEvent.dwn}>
                  <DownLoad width={20} height={20} />
                  {item.fileDownloadURL && (
                    <TouchableOpacity
                      onPress={() => Linking.openURL(item.fileDownloadURL)}
                    >
                      <Text style={stylesEvent.fileLink}>Download File</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Text style={stylesEvent.eventTime}>{item.eventTime}</Text>
              </View>
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
    marginBottom: "11%",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 6,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "black",
    shadowOpacity: 0.3,
    marginVertical: 10,
    margin: "2%",
    padding: "3%",
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
    fontFamily: "Inter500",
    color: "#30313D",
  },
  eventDescription: {
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
    color: "#30313D",
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

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [selectedTag, setSelectedTag] = useState("data");

  // Function to fetch data from Firestore based on search query and selected tag
  const fetchData = async () => {
    const dataRef = collection(db, selectedTag);

    let baseQuery = query(dataRef);

    if (searchQuery) {
      baseQuery = query(dataRef, where(selectedTag, ">=", searchQuery));
    }

    const querySnapshot = await getDocs(baseQuery);
    const data = querySnapshot.docs.map((doc) => doc.data());
    setFilteredData(data);
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery, selectedTag]);

  return (
    <View style={stylesSearch.container}>
      <TextInput
        style={stylesSearch.searchInput}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <View style={stylesSearch.tagsContainer}>
        <TouchableOpacity
          style={stylesSearch.btn}
          onPress={() => setSelectedTag("data")}
        >
          <Text style={stylesSearch.eventbtn}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={stylesSearch.btn}
          onPress={() => setSelectedTag("Notices")}
        >
          <Text style={stylesSearch.eventbtn}>Notices</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={stylesSearch.btn}
          onPress={() => setSelectedTag("Event")}
        >
          <Text style={stylesSearch.eventbtn}>Events</Text>
        </TouchableOpacity>
      </View>
      <Text style={stylesSearch.sectionTitle}>Filtered Data:</Text>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.noticeID || item.eventName}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={stylesSearch.card}
            onPress={() => handlePress(item)}
          >
            <View style={stylesSearch.cardContent}>
              <Image
                source={{ uri: item.uploadedFileURI }}
                style={stylesSearch.cardImage}
              />
              <View style={stylesSearch.cardText}>
                <Text style={stylesEvent.eventName}>
                  {item.eventName || item.noticeName}
                </Text>
                <Text style={stylesEvent.eventDescription}>
                  {item.eventDescription || item.description}
                </Text>
                <View style={stylesEvent.flex}>
                  <View style={stylesEvent.dwn}>
                    <MapPin width={20} height={20} />
                    <Text style={stylesEvent.eventLocation}>
                      {" "}
                      {item.eventLocation}{" "}
                    </Text>
                  </View>
                  <Text style={stylesEvent.eventTime}>{item.eventDate}</Text>
                </View>
                <View style={stylesEvent.flex}>
                  <View style={stylesEvent.dwn}>
                    <DownLoad width={20} height={20} />
                    {item.fileDownloadURL && (
                      <TouchableOpacity
                        onPress={() => Linking.openURL(item.fileDownloadURL)}
                      >
                        <Text style={stylesEvent.fileLink}>Download File</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text style={stylesEvent.eventTime}>{item.eventTime}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const stylesSearch = StyleSheet.create({
  searchInput: {
    height: 60,
    borderWidth: 1,
    borderColor: "#60606060",
    borderRadius: 16,
    paddingHorizontal: 10,
    marginBottom: 10,
    fontFamily: "Inter300",
  },
  tagsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    marginBottom: 10,
  },
  container: {
    flex: 1,
    padding: 16,
    marginBottom: "11%",
  },
  btn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#635BFF",
    borderRadius: 99,
    paddingHorizontal: "5%",
    margin: 10,
    height: 40,
    width: 100,
  },
  eventbtn: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter400",
  },
  flex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 6,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "black",
    shadowOpacity: 0.3,
    marginVertical: 10,
    margin: "2%",
    padding: "3%",
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
    fontFamily: "Inter500",
    color: "#30313D",
  },
  eventDescription: {
    fontSize: 14,
    fontFamily: "Inter300",
    color: "#606060",
    marginBottom: 10,
    height: 42,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter400",
    color: "#606060",
    margin: 10,
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
        headerShown={false}
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
    fontFamily: "Inter400",
    color: "#FFF",
  },
});

export default DashboardScreen;
