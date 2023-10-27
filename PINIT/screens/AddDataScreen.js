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
  const [selectedOption, setSelectedOption] = useState("Notice"); // Default to 'admin'

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

  const handleOptionSelect = (option) => {
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
    setSelectedOption(option);
  };

  const handleFileUpload = async () => {
    const file = await DocumentPicker.getDocumentAsync();
    console.log(file);
    if (file) {
      setUploadedFile(file);
    } else {
      console.log("file not selected");
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
        const response = await fetch(uploadedFile.assets[0].uri);
        const blob = await response.blob();
        const fileName = `notices/${Date.now()}-${uploadedFile.assets[0].name}`;

        // Get a reference to the Firebase Storage location
        const storageRef = ref(storage, fileName);

        // Upload the file
        await uploadBytes(storageRef, blob);

        // Get the download URL of the uploaded file
        downloadUrl = await getDownloadURL(storageRef);
      }

      // Add notice to Firestore with the download URL (if available)
      await addDoc(collection(db, "data"), {
        ...noticeData,
        fileDownloadURL: downloadUrl,
        selectedOption: selectedOption,
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
      console.log("Notice added successfully");
      navigation.navigate("Explore");
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

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              styles.adminButton,
              selectedOption === "notices" && styles.selectedButton,
              selectedOption === "event" && styles.unselectedButton,
            ]}
            onPress={() => handleOptionSelect("notices")}
          >
            <Text
              style={[
                styles.buttonText,
                selectedOption === "event" && styles.unselectedText,
              ]}
            >
              Notices
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              styles.studentButton,
              selectedOption === "event" && styles.selectedButton,
              selectedOption === "notices" && styles.unselectedButton,
            ]}
            onPress={() => handleOptionSelect("event")}
          >
            <Text
              style={[
                styles.buttonText,
                selectedOption === "notices" && styles.unselectedText,
              ]}
            >
              Event
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
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
            setSelected={(val) =>
              setNoticeData({ ...noticeData, viewedBy: val })
            }
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
                <Text style={styles.uploadedFileName}>
                  {uploadedFile.assets[0].name}
                </Text>
              </View>
            </View>
          )}

          {/* Add Notice Button */}
          <TouchableOpacity style={styles.button} onPress={handleAddNotice}>
            <Text style={styles.buttonText}>ADD </Text>
          </TouchableOpacity>
        </View>

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
    padding: 0,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "medium",
    marginBottom: 10,
  },
  input: {
    height: 60,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 16,
  },
  dropdownContainer: {
    height: 60,
    marginBottom: 20,
    borderRadius: 16,
  },
  dropdown: {
    backgroundColor: "#fafafa",
  },
  dropdownItem: {
    justifyContent: "flex-start",
  },
  dropdownMenu: {
    backgroundColor: "#000",
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
    borderRadius: 16,
    // elevation:10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
  },
  datePickerButton: {
    backgroundColor: "#635BFF",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    marginTop: 10,
  },
  datePickerButtonText: {
    color: "#fff",
    fontSize: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    // flex: 1,
    justifyContent: "center",
    width: "100%",
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
    fontSize: 24,
    // fontWeight: 'bold',
    color: "#000",
  },
  inputContainer: {
    flex: 3, 
    paddingLeft: "5%",
    paddingRight: "5%",
  },
});

export default AddDataScreen;
