import { useState, useEffect } from "react";
import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StyleSheet,
  FlatList,
} from "react-native";
import { Linking } from "react-native";
import { db } from "../FirebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";



function NoticeScreenPage() {
  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    // Fetch events from Firestore
    const fetchEvents = async () => {
      try {
        const q = collection(db, "Notices"); // Use collection to reference the 'Event' collection
        const querySnapshot = await getDocs(q);
        const Data = querySnapshot.docs.map((doc) => doc.data());
        setEventData(Data);
        
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
  function handlePress(item) {
    console.log(item.id);
  }
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={eventData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={(item) => handlePress(item)}
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
              <Text style={styles.eventName}>{item.noticeName}</Text>
              <Text style={styles.eventDescription}>
                {item.noticeDate}
              </Text>
              
              
              <Text style={styles.eventDescription}>
                {item.noticeDescription}
              </Text>
              {item.fileDownloadURL && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(item.fileDownloadURL)}
                >
                  <Text style={styles.fileLink}>Download File</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 16,
    fontFamily: "Inter300",
    color: "#30313D",
    marginBottom: 10,
  },
  fileLink: {
    fontSize: 12,
    fontFamily: "Inter500",
    paddingHorizontal: 5,
    color: "#30313D",
    textDecorationLine: "underline",
  },
  dwn: {
    display: "flex",
    flexDirection: "row",
  },
});


export default NoticeScreenPage;
