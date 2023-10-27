import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { collection, addDoc } from "firebase/firestore";
import { useBackHandler } from "@react-native-community/hooks";
import { db, storage } from "../FirebaseConfig";
import Spinner from "react-native-loading-spinner-overlay";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { get } from "react-native/Libraries/Utilities/PixelRatio";
import { SelectList } from "react-native-dropdown-select-list";

function AddDataScreen({ navigation }) {
  const [selected, setSelected] = useState("");

  useBackHandler(() => {
    navigation.navigate("Explore");
  });
  // const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDataType , setselectedDataType] = useState("notices");

  const [noticeData, setNoticeData] = useState({
    noticeName: "",
    noticeID: "",
    authorizedBy: "",
    concernedFaculty: "",
    noticeDate: "",
    issuedFor: "",
    viewedBy: "",
    description: "",
  });

  const handleFileUpload = async () => {
    const file = await DocumentPicker.getDocumentAsync();
    if (file.type === "success") {
      setUploadedFile(file);
    }
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      const formattedDate = selectedDate.toLocaleDateString("en-GB");
      setNoticeData({ ...noticeData, noticeDate: formattedDate });
    }
  };

  const handleAddNotice = async () => {
    try {
      setLoading(true);

      // Upload the file to Firebase Storage if an uploaded file exists
      let downloadUrl = null;
      if (uploadedFile) {
        const response = await fetch(uploadedFile.uri);
        const blob = await response.blob();
        const fileName = `notices/${Date.now()}-${uploadedFile.name}`;

        // Get a reference to the Firebase Storage location
        const storageRef = ref(storage, fileName);

        // Upload the file
        await uploadBytes(storageRef, blob);

        // Get the download URL of the uploaded file
        downloadUrl = await getDownloadURL(storageRef);
      }

      // Add notice to Firestore with the download URL (if available)
      await addDoc(collection(db,"notices"), {
        ...noticeData,
        fileDownloadURL: downloadUrl,
      });

      // Reset notice data and other fields
      setNoticeData({
        noticeName: "",
        noticeID: "",
        authorizedBy: "",
        concernedFaculty: "",
        noticeDate: "",
        issuedFor: "",
        viewedBy: "",
        description: "",
      });

      setUploadedFile(null);
      setToastMessage("Notice was successfully created");
      console.log("Notice added successfully");
    } catch (error) {
      console.error("Error adding notice to Firestore:", error);
      // Handle the error as per your application's requirements
    } finally {
      setLoading(false);
      showToastMessage(toastMessage);
      // navigation.navigate("ViewNotice");
    }
  };

  const data = [
    { key: "1", value: "JD" },
    { key: "2", value: "Diro" },
    { key: "3", value: "HOD" },
    { key: "4", value: "Sec1" },
    { key: "5", value: "Sec2" },
    { key: "6", value: "Sec3" },
    { key: "7", value: "Admin" },
  ];

  const DataForSelectedType = [
    { key: "1", value: "Notices" },
    { key: "2", value: "Classes" },
    { key: "3", value: "Events" },
  ];
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  console.log(selectedDate);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
         <SelectList
          style={styles.input}
          setSelected={(val) =>
            setselectedDataType(val)
          }
          data={DataForSelectedType}
          placeholder="Select Data Type"
          save="value"
        />

        <TextInput
          style={styles.input}
          placeholder="     Notice Name"
          value={noticeData.noticeName}
          onChangeText={(text) =>
            setNoticeData({ ...noticeData, noticeName: text })
          }
        />

        <TextInput
          style={styles.input}
          placeholder="     Notice ID"
          value={noticeData.noticeID}
          onChangeText={(text) =>
            setNoticeData({ ...noticeData, noticeID: text })
          }
        />
        <SelectList
          style={styles.input}
          setSelected={(val) =>
            setNoticeData({ ...noticeData, authorizedBy: val })
          }
          data={data}
          placeholder="Authorized By"
          save="value"
        />
        <SelectList
          style={styles.input}
          setSelected={(val) =>
            setNoticeData({ ...noticeData, concernedFaculty: val })
          }
          data={data}
          placeholder="Concerned Faculty"
          save="value"
        />

        <TextInput
          style={styles.input}
          placeholder="Notice Date"
          value={noticeData.noticeDate}
          onChangeText={(text) =>
            setNoticeData({ ...noticeData, noticeData: text })
          }
          onFocus={showDatepicker}
        />

        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={selectedDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={handleDateChange}
          />
        )}

        <SelectList
          style={styles.input}
          setSelected={(val) =>
            setNoticeData({ ...noticeData, issuedFor: val })
          }
          data={data}
          placeholder="Issued For"
          save="value"
        />

        <SelectList
          style={styles.input}
          setSelected={(val) => setNoticeData({ ...noticeData, viewedBy: val })}
          data={data}
          placeholder="Viewed By"
          save="value"
        />

        {/* Rest of the input fields and components */}

        {/* Add Description */}
        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={styles.input}
          multiline
          value={noticeData.description}
          onChangeText={(text) =>
            setNoticeData({ ...noticeData, description: text })
          }
        />

        {/* Upload Document */}
        <Text style={styles.label}>Upload Document:</Text>
        <TouchableOpacity style={styles.button} onPress={handleFileUpload}>
          <Text style={styles.buttonText}>UPLOAD FILE</Text>
        </TouchableOpacity>

        {/* Uploaded File Display */}
        {uploadedFile && (
          <View style={styles.uploadedFileContainer}>
            <Text style={styles.uploadedFileText}>Uploaded File:</Text>
            <View style={styles.uploadedFileNameContainer}>
              <Text style={styles.uploadedFileName}>{uploadedFile.name}</Text>
            </View>
          </View>
        )}

        {/* Add Notice Button */}
        <TouchableOpacity style={styles.button} onPress={handleAddNotice}>
          <Text style={styles.buttonText}>ADD </Text>
        </TouchableOpacity>

        <Spinner
          visible={loading}
          textContent={"Creating Notice..."}
          textStyle={styles.spinnerText}
        />

        <Toast
          visible={showToast}
          position="bottom"
          autoHide={true}
          autoHideDuration={3000}
          onHidden={() => setShowToast(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 10,
    height: 50,
  },
  dropdownContainer: {
    height: 40,
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: "#fafafa",
  },
  dropdownItem: {
    justifyContent: "flex-start",
  },
  dropdownMenu: {
    backgroundColor: "#fafafa",
    zIndex: 5000,
  },
  uploadedFileContainer: {
    marginTop: 20,
    backgroundColor: "#635BFF",
    padding: 10,
    borderRadius: 5,
  },
  uploadedFileText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#ffffff",
  },
  uploadedFileNameContainer: {
    backgroundColor: "#ffffff",
    padding: 5,
    borderRadius: 5,
  },
  uploadedFileName: {
    fontSize: 14,
    color: "#000000",
  },
  spinnerText: {
    color: "#FFF",
  },
  toastContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#000000",
  },
  toastText: {
    color: "#fff",
    textAlign: "center",
  },
  button: {
    width: "100%",
    height: 60,
    backgroundColor: "#635BFF",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 10,
    // elevation:10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
  },
  datePickerButton: {
    backgroundColor: "#635BFF",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
  },
  datePickerButtonText: {
    color: "#fff",
    fontSize: 15,
  },
});

export default AddDataScreen;
