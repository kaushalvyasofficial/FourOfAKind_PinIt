import React, { useState, useEffect } from "react";
import { View , Linking } from "react-native";
import Carousel from "react-native-snap-carousel";
import CarouselCardItem, { SLIDER_WIDTH, ITEM_WIDTH } from "./carousel";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import { TouchableOpacity } from "react-native";

export default function CarouselCardsNotice(uid) {
  const isCarousel = React.useRef(null);
  const [eventData, setEventData] = useState([]);
  const [title, setTitle] = useState("");
  if (uid.uid == 0) {
    setTitle("Notice");
  } else if (uid.uid == 1) {
    setTitle("Events");
  }
  useEffect(() => {
    // Fetch events from Firestore
    const fetchEvents = async () => {
      try {
        const q = collection(db, "Notices"); // Use collection to reference the 'Event' collection
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => doc.data());
        const newArray = data.map((obj) => ({
          title: obj.noticeName,
          body: obj.noticeDescription,
          imgUrl: obj.fileDownloadURL,
          fileDownloadURL: obj.fileDownloadURL,
          eventTime:obj.noticeDate,
          eventLocation:obj.noticeLocation,
        }));

        setEventData(newArray.slice(0, 5));
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

  return (
    <View>
      {/*  */}
      <Carousel
        layout="default"
        layoutCardOffset={8}
        ref={isCarousel}
        data={eventData}
        renderItem={CarouselCardItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        inactiveSlideShift={1}
        useScrollView={true}
      />
      {/* </TouchableOpacity> */}
    </View>
  );
}
