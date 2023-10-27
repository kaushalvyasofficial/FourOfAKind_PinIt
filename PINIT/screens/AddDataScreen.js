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
import { SelectList } from "react-native-dropdown-select-list";
import Addicon from "../assets/images/addEvent";
import Upload from "../assets/images/upload";

function AddDataScreen({ navigation }) {
  const [selected, setSelected] = useState("");

  useBackHandler(() => {
    navigation.navigate("Explore");
  });

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedOption, setSelectedOption] = useState("Notices"); // Default to 'Notices'

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

  const [eventData, setEventData] = useState({
    eventName: "",
    eventID: "",
    eventDate: "",
    eventLocation: "",
    eventDescription: "",
  });

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setUploadedFile(null); // Clear any uploaded file
    setShowDatePicker(false); // Close the date picker

    // Reset the form data based on the selected option
    if (option === "Notices") {
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
    } else if (option === "Event") {
      setEventData({
        eventName: "",
        eventID: "",
        eventDate: "",
        eventLocation: "",
        eventDescription: "",
      });
    }
  };

  const handleFileUpload = async () => {
    const file = await DocumentPicker.getDocumentAsync();

    if (file.assets) {
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
      if (selectedOption === "Notices") {
        setNoticeData({ ...noticeData, noticeDate: formattedDate });
      } else if (selectedOption === "Event") {
        setEventData({ ...eventData, eventDate: formattedDate });
      }
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
        ...(selectedOption === "Notices" ? noticeData : eventData),
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
      setEventData({
        eventName: "",
        eventID: "",
        eventDate: "",
        eventLocation: "",
        eventDescription: "",
      });

      setUploadedFile(null);
      setToastMessage("Notice was successfully created");
      navigation.navigate("Explore");
    } catch (error) {
      console.error("Error adding notice to Firestore:", error);
      // Handle the error as per your application's requirements
    } finally {
      setLoading(false);
      setToastMessage(toastMessage);
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

  // Rest of your code...

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              selectedOption === "Notices" && styles.selectedButton,
            ]}
            onPress={() => handleOptionSelect("Notices")}
          >
            <Text style={styles.buttonText}>Notices</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              selectedOption === "Event" && styles.selectedButton,
            ]}
            onPress={() => handleOptionSelect("Event")}
          >
            <Text style={styles.buttonText}>Event</Text>
          </TouchableOpacity>
        </View>

        {selectedOption === "Notices" && (
          <View style={styles.inputContainer}>
            {/* notice name */}
            <View style={styles.noticeContainer}>
              <TextInput
                style={styles.input}
                placeholder="Notice Name"
                placeholderTextColor="#74768890"
                value={noticeData.noticeName}
                onChangeText={(text) => setNoticeData({ ...noticeData, noticeName: text })} />
            </View>
            {/* Notice id */}
            <View style={styles.noticeContainer}>
              <TextInput
                style={styles.input}
                placeholder="Notice ID"
                placeholderTextColor="#74768890"
                value={noticeData.noticeID}
                onChangeText={(text) => setNoticeData({ ...noticeData, noticeID: text })} />
            </View>
            {/* Authorize by */}
            <SelectList
              style={styles.input}
              setSelected={(val) => setNoticeData({ ...noticeData, authorizedBy: val })}
              data={data}
              placeholder="Authorized By"
              save="value" />
            <SelectList
              style={styles.input}
              setSelected={(val) => setNoticeData({ ...noticeData, concernedFaculty: val })}
              data={data}
              placeholder="Concerned Faculty"
              save="value" />
            <View style={styles.noticeContainer}>
              <TextInput
                style={styles.input}
                placeholder="Notice Date"
                placeholderTextColor="#74768890"
                value={noticeData.noticeDate}
                onChangeText={(text) => setNoticeData({ ...noticeData, noticeData: text })}
                onFocus={showDatepicker} />
            </View>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={selectedDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={handleDateChange} />
            )}

            <SelectList
              style={styles.input}
              setSelected={(val) => setNoticeData({ ...noticeData, issuedFor: val })}
              data={data}
              placeholder="Issued For"
              save="value" />

            <SelectList
              style={styles.input}
              setSelected={(val) => setNoticeData({ ...noticeData, viewedBy: val })}
              data={data}
              placeholder="Viewed By"
              save="value" />

            {/* Rest of the input fields and components */}

            {/* Add Description */}
            <View style={styles.noticeContainerD}>
              <TextInput
                style={styles.input}
                multiline
                placeholder="Description"
                placeholderTextColor="#74768890"
                value={noticeData.description}
                onChangeText={(text) =>
                  setNoticeData({ ...noticeData, description: text })
                }
              />
            </View>
            {/* Upload Document */}
            <Text style={styles.label}>Upload Document:</Text>
            <TouchableOpacity style={styles.btns} onPress={handleFileUpload}>
              <Text style={styles.btnsText}>UPLOAD FILE</Text>
              <Upload />
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
          </View>
        )}

        {selectedOption === "Event" && (
          <View style={styles.inputContainer}>
            {/* notice name */}
            <View style={styles.noticeContainer}>
              <TextInput
                style={styles.input}
                placeholder="Event Name"
                placeholderTextColor="#74768890"
                value={noticeData.noticeName}
                onChangeText={(text) => setNoticeData({ ...noticeData, noticeName: text })} />
            </View>
            {/* Notice id */}
            <View style={styles.noticeContainer}>
              <TextInput
                style={styles.input}
                placeholder="Event ID"
                placeholderTextColor="#74768890"
                value={noticeData.noticeID}
                onChangeText={(text) => setNoticeData({ ...noticeData, noticeID: text })} />
            </View>
            {/* Authorize by */}
            <SelectList
              style={styles.input}
              setSelected={(val) => setNoticeData({ ...noticeData, authorizedBy: val })}
              data={data}
              placeholder="Authorized By"
              save="value" />
            <SelectList
              style={styles.input}
              setSelected={(val) => setNoticeData({ ...noticeData, concernedFaculty: val })}
              data={data}
              placeholder="Concerned Faculty"
              save="value" />
            <View style={styles.noticeContainer}>
              <TextInput
                style={styles.input}
                placeholder="Event Date"
                placeholderTextColor="#74768890"
                value={noticeData.noticeDate}
                onChangeText={(text) => setNoticeData({ ...noticeData, noticeData: text })}
                onFocus={showDatepicker} />
            </View>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={selectedDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={handleDateChange} />
            )}

            <SelectList
              style={styles.input}
              setSelected={(val) => setNoticeData({ ...noticeData, issuedFor: val })}
              data={data}
              placeholder="Issued For"
              save="value" />

            <SelectList
              style={styles.input}
              setSelected={(val) => setNoticeData({ ...noticeData, viewedBy: val })}
              data={data}
              placeholder="Viewed By"
              save="value" />

            {/* Rest of the input fields and components */}

            {/* Add Description */}
            <View style={styles.noticeContainerD}>
              <TextInput
                style={styles.input}
                multiline
                placeholder="Description"
                placeholderTextColor="#74768890"
                value={noticeData.description}
                onChangeText={(text) =>
                  setNoticeData({ ...noticeData, description: text })
                }
              />
            </View>
            {/* Upload Document */}
            <Text style={styles.label}>Upload Document:</Text>
            <TouchableOpacity style={styles.btns} onPress={handleFileUpload}>
              <Text style={styles.btnsText}>UPLOAD FILE</Text>
              <Upload />
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
          </View>
        )}

        {/* Add Notice Button */}
        <View style={styles.btnpd}>
          <TouchableOpacity style={styles.btn} onPress={handleAddNotice}>
            <Text style={styles.btnText}>ADD </Text>
            <Addicon />
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
    </SafeAreaView >
  );
}

// Styles...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    backgroundColor: "#fff",
  },
  inputContainer: {
    flex: 3,
    width: "80%",
  },
  noticeContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E4DFDF",
    borderRadius: 16,
    marginBottom: 10,
    height: 60,
    // backgroundColor: '#04500030',
  },
  noticeContainerD: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E4DFDF',
    borderRadius: 16,
    marginBottom: 20,
    height: 100,
    // backgroundColor: '#04500030',
  },
  input: {
    flex: 1,
    // height: 60,
    paddingHorizontal: 10,
    // backgroundColor: '#00000030',
  },
  inputdd: {
    flex: 1,
    width: 100,
    paddingHorizontal: 40,
    // height: 60,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
    borderColor: "#fff",
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
    color: "#635BFF",
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
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    padding: 10,
    borderRadius: 5,
  },
  uploadedFileText: {
    fontSize: 12,
    fontWeight: "medium",
    color: "#212121",
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
  btnpd: {
    padding: 20,
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    height: 60,
    backgroundColor: '#635BFF',
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 16,
    // elevation:10,
  },
  btns: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    height: 50,
    // backgroundColor: '#635BFF',
    borderBottomColor: "#635BFF",
    borderBottomWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    // borderRadius: 16,
  },
  btnText: {
    color: "#fff",
    fontSize: 20,
  },
  btnsText: {
    color: "#747688",
    fontSize: 16,
    paddingHorizontal: 10,
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
    marginBottom: "8%",
    marginTop: "10%",
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
    paddingLeft: "6%",
    paddingRight: "6%",
  },
});

export default AddDataScreen;
