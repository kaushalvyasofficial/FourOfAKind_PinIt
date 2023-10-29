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
  Platform,
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
import Addicon from "../assets/images/add";
import Upload from "../assets/images/upload";

function AddDataScreen({ navigation }) {
  // const [selected, setSelected] = useState("");

  useBackHandler(() => {
    navigation.navigate("Dashboard");
  });

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [selectedOption, setSelectedOption] = useState("Notices"); // Default to 'Notices'
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [noticeDatePicker, setNoticeDatePicker] = useState(new Date());
  const [showNoticeDatePicker, setShowNoticeDatePicker] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [noticeData, setNoticeData] = useState({
    noticeName: "",
    noticeID: "",
    authorizedBy: "",
    concernedFaculty: "",
    noticeDate: "",
    issuedFor: "",
    viewedBy: "",
    description: "",
    uploadedFileURI: null,
  });

  const [eventData, setEventData] = useState({
    eventName: "",
    eventDate: "",
    eventEndDate: "",
    eventTime: "",
    eventauthorizedBy: "",
    eventLocation: "",
    eventDescription: "",
    uploadedFileURI: null,
  });

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setUploadedFile(null); // Clear any uploaded file
    setShowNoticeDatePicker(false); // Close the date picker

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
        uploadedFileURI: null,
      });
    } else if (option === "Event") {
      setEventData({
        eventName: "",
        eventDate: "",
        eventEndDate: "",
        eventTime: "",
        eventauthorizedBy: "",
        eventLocation: "",
        eventDescription: "",
        uploadedFileURI: null,
      });
    }
  };

  const handleFileUpload = async () => {
    const file = await DocumentPicker.getDocumentAsync();

    if (file.assets) {
      setUploadedFile(file);
      setIsFileUploaded(true);
    } else {
      console.log("file not selected");
    }
  };

  const NoticeDatePicker = () => {
    setShowNoticeDatePicker(true);  
  };

  const showStartDatepicker = () => {
    setShowStartDatePicker(true);
  };

  const showEndDatepicker = () => {
    setShowEndDatePicker(true);
  };
  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  const handleNoticeDateChange = (notice, newDate) => {
    setShowNoticeDatePicker(Platform.OS === "ios");
    if (notice.type === "set") {
      const formattedDate = newDate.toLocaleDateString();
      setNoticeData({ ...noticeData, noticeDate: formattedDate });
      setNoticeDatePicker(newDate);
    }
  };

  const handleStartDateChange = (event, newDate) => {
    setShowStartDatePicker(Platform.OS === "ios");
    if (event.type === "set") {
      const formattedDate = newDate.toLocaleDateString();
      setEventData({ ...eventData, eventDate: formattedDate });
      setSelectedStartDate(newDate);
    }
  };

  const handleEndDateChange = (event, newDate) => {
    setShowEndDatePicker(Platform.OS === "ios");
    if (event.type === "set") {
      const formattedDate = newDate.toLocaleDateString();
      setEventData({ ...eventData, eventEndDate: formattedDate });
      setSelectedEndDate(newDate);
    }
  };

  const handleTimeChangeStart = (event, selectedStartTime) => {
    setShowTimePicker(false);
    if (selectedStartTime) {
      setSelectedTime(selectedStartTime);
      const formattedTime = selectedStartTime.toLocaleTimeString("en-GB");
      if (selectedOption === "Event") {
        setEventData({ ...eventData, eventTime: formattedTime });
      }
    }
  };

  const handleAddNotice = async () => {
    // console.log(eventData)
    try {
      setLoading(true);

      // Upload the file to Firebase Storage if an uploaded file exists
      let downloadUrl = "";
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

        // Update the uploadedFileURI in the correct object based on the selected option
        if (selectedOption === "Notices") {
          setNoticeData({
            ...noticeData,
            uploadedFileURI: await getDownloadURL(storageRef),
          });
        } else {
          setEventData({
            ...eventData,
            uploadedFileURI: await getDownloadURL(storageRef),
          });
        }
      }

      // Add notice to Firestore with the download URL (if available)
      await addDoc(collection(db, selectedOption), {
        ...(selectedOption === "Notices" ? noticeData : eventData),
        fileDownloadURL: downloadUrl,
        // selectedOption: selectedOption,
      });

      await addDoc(collection(db, "data"), {
        ...(selectedOption === "Notices" ? noticeData : eventData),
        fileDownloadURL: downloadUrl,
        // selectedOption: selectedOption,
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
        uploadedFileURI: null,
      });
      setEventData({
        eventName: "",
        eventID: "",
        eventDate: "",
        eventEndDate: "",
        eventTime: "",
        eventLocation: "",
        eventDescription: "",
        uploadedFileURI: null,
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
              selectedOption === "Event" && styles.unselectedText,
              selectedOption === "Event" && styles.unselectedButton,
            ]}
            onPress={() => handleOptionSelect("Notices")}
          >
            <Text
              style={[
                styles.buttonText,
                selectedOption === "Event" && styles.unselectedText,
              ]}
            >
              Notices
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              selectedOption === "Event" && styles.selectedButton,
              selectedOption === "Notices" && styles.unselectedButton,
            ]}
            onPress={() => handleOptionSelect("Event")}
          >
            <Text
              style={[
                styles.buttonText,
                selectedOption === "Notices" && styles.unselectedText,
              ]}
            >
              Event
            </Text>
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
                onChangeText={(text) =>
                  setNoticeData({ ...noticeData, noticeName: text })
                }
              />
            </View>
            {/* Notice id */}
            <View style={styles.noticeContainer}>
              <TextInput
                style={styles.input}
                placeholder="Notice ID"
                placeholderTextColor="#74768890"
                value={noticeData.noticeID}
                onChangeText={(text) =>
                  setNoticeData({ ...noticeData, noticeID: text })
                }
              />
            </View>
            {/* Authorize by */}
            <SelectList
              style={{
                placeholder: {
                  color: "#E4DFDF",
                },
              }}
              boxStyles={styles.inputdd}
              dropdownStyles={styles.dropdown}
              dropdownTextStyles={styles.dropdownItemText}
              itemStyles={styles.dropdownItem}
              menuStyles={styles.dropdownMenu}
              setSelected={(val) =>
                setNoticeData({ ...noticeData, authorizedBy: val })
              }
              data={data}
              placeholder="Authorized By"
              save="value"
            />
            <SelectList
              style={styles.inputdd}
              boxStyles={styles.inputdd}
              dropdownStyles={styles.dropdown}
              dropdownTextStyles={styles.dropdownItemText}
              itemStyles={styles.dropdownItem}
              menuStyles={styles.dropdownMenu}
              setSelected={(val) =>
                setNoticeData({ ...noticeData, concernedFaculty: val })
              }
              data={data}
              placeholder="Concerned Faculty"
              save="value"
            />
            <View style={styles.noticeContainer}>
              <TextInput
                style={styles.input}
                placeholder="Notice Date"
                placeholderTextColor="#74768890"
                value={noticeData.noticeDate}
                onChangeText={(text) =>
                  setNoticeData({ ...noticeData, noticeData: text })
                }
                onFocus={NoticeDatePicker}
              />
            </View>
            {showNoticeDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={noticeDatePicker}
                mode="datetime"
                is24Hour={true}
                display="default"
                onChange={handleNoticeDateChange}
              />
            )}

            <View style={styles.noticeContainer}>
              <TextInput
                style={styles.input}
                placeholder="Location"
                placeholderTextColor="#74768890"
                value={eventData.eventLocation}
                onChangeText={(text) =>
                  setEventData({ ...eventData, eventLocation: text })
                }
              />
            </View>
            <SelectList
              style={styles.inputdd}
              boxStyles={styles.inputdd}
              dropdownStyles={styles.dropdown}
              dropdownTextStyles={styles.dropdownItemText}
              itemStyles={styles.dropdownItem}
              menuStyles={styles.dropdownMenu}
              setSelected={(val) =>
                setNoticeData({ ...noticeData, issuedFor: val })
              }
              data={data}
              placeholder="Issued For"
              save="value"
            />

            <SelectList
              style={styles.inputdd}
              boxStyles={styles.inputdd}
              dropdownStyles={styles.dropdown}
              dropdownTextStyles={styles.dropdownItemText}
              itemStyles={styles.dropdownItem}
              menuStyles={styles.dropdownMenu}
              setSelected={(val) =>
                setNoticeData({ ...noticeData, viewedBy: val })
              }
              data={data}
              placeholder="Viewed By"
              save="value"
            />

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
                    {uploadedFile.assets[0].name.slice(0, 25) + "..."}
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
                value={eventData.eventName}
                onChangeText={(text) =>
                  setEventData({ ...eventData, eventName: text })
                }
              />
            </View>
            {/* Authorize by */}
            <SelectList
              style={styles.inputdd}
              boxStyles={styles.inputdd}
              dropdownStyles={styles.dropdown}
              dropdownTextStyles={styles.dropdownItemText}
              itemStyles={styles.dropdownItem}
              menuStyles={styles.dropdownMenu}
              setSelected={(val) =>
                setEventData({ ...eventData, eventauthorizedBy: val })
              }
              data={data}
              placeholder="Authorized By"
              save="value"
            />
            <View style={styles.dateRangeContainer}>
              <View style={styles.noticeContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Start Date"
                  placeholderTextColor="#74768890"
                  value={eventData.eventDate}
                  onFocus={showStartDatepicker}
                />
                {showStartDatePicker && (
                  <DateTimePicker
                    testID="startDatePicker"
                    value={selectedStartDate}
                    mode="date"
                    is24Hour={false}
                    display="default"
                    onChange={handleStartDateChange}
                  />
                )}
              </View>

              <View style={styles.noticeContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="End Date"
                  placeholderTextColor="#74768890"
                  value={eventData.eventEndDate}
                  onFocus={showEndDatepicker}
                />
                {showEndDatePicker && (
                  <DateTimePicker
                    testID="endDatePicker"
                    value={selectedEndDate}
                    mode="date"
                    is24Hour={false}
                    display="default"
                    onChange={handleEndDateChange}
                  />
                )}
              </View>
            </View>
            <View style={styles.noticeContainer}>
              <TextInput
                style={styles.input}
                placeholder="Event Time"
                placeholderTextColor="#74768890"
                value={eventData.eventTime}
                onChangeText={(text) =>
                  setEventData({ ...eventData, eventTime: text })
                }
                onFocus={showTimepicker}
              />
            </View>
            {showTimePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={selectedTime}
                mode="time"
                is24Hour={false}
                display="spinner"
                onChange={handleTimeChangeStart}
              />
            )}

            {/* Location */}
            <View style={styles.noticeContainer}>
              <TextInput
                style={styles.input}
                placeholder="Location"
                placeholderTextColor="#74768890"
                value={eventData.eventLocation}
                onChangeText={(text) =>
                  setEventData({ ...eventData, eventLocation: text })
                }
              />
            </View>

            {/* Rest of the input fields and components */}

            {/* Add Description */}
            <View style={styles.noticeContainerD}>
              <TextInput
                style={styles.input}
                multiline
                placeholder="Description"
                placeholderTextColor="#74768890"
                value={eventData.eventDescription}
                onChangeText={(text) =>
                  setEventData({ ...eventData, eventDescription: text })
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
                    {uploadedFile.assets[0].name.slice(0, 25) + "..."}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Add Notice Button */}
        <View style={styles.btnpd}>
          <TouchableOpacity
            style={styles.btn}
            onPress={handleAddNotice}
            disabled={!isFileUploaded}
          >
            <Text style={styles.btnText}>ADD </Text>
            <Addicon height={25} width={25} />
          </TouchableOpacity>
        </View>

        {/* Progress Bar for Creating Notices */}
        {/* {creatingProgress > 0 && creatingProgress < 1 && (
          <ProgressBar
            progress={creatingProgress}
            width={null} // Adjust as needed
          />
        )} */}

        <Spinner
          visible={loading}
          textContent={"Just wait *-* ...."}
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
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E4DFDF",
    borderRadius: 16,
    marginBottom: 20,
    height: 100,
    // backgroundColor: '#04500030',
  },
  input: {
    fontFamily: "Inter300",
    flex: 1,
    color: "#000",
    paddingHorizontal: 10,
    width: 100,
  },
  inputdd: {
    fontFamily: "Inter700",
    // color: "red",
    flex: 1,
    width: "100%",
    // height: 60,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E4DFDF",
    // backgroundColor: '#00000030',
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
    borderWidth: 1,
    borderColor: "#E4DFDF",
    marginTop: -10,
    marginBottom: 10,
    borderRadius: 16,
    // borderRadiusBottomLeft: 0,
  },
  dropdownItem: {
    justifyContent: "flex-start",
    // borderWidth:5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    // borderWidth:1,
  },
  dropdownItemText: {
    fontFamily: "Inter400",
    fontSize: 14,
    color: "#212121",
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
    borderRadius: 0,
  },
  uploadedFileText: {
    fontFamily: "Inter300",
    fontSize: 12,
    color: "#212121",
  },
  uploadedFileNameContainer: {
    backgroundColor: "#ffffff",
    padding: 5,
    borderRadius: 0,
  },
  uploadedFileName: {
    fontFamily: "Inter400",
    fontSize: 14,
    color: "#212121",
  },
  spinnerText: {
    fontFamily: "Inter400",
    color: "#FFF",
  },
  toastContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 0,
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
    backgroundColor: "#635BFF",
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
    fontFamily: "Inter400",
    color: "#fff",
    fontSize: 20,
    paddingHorizontal: 10,
  },
  btnsText: {
    fontFamily: "Inter400",
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
    fontFamily: "Inter400",
    fontSize: 20,
    // fontWeight: 'bold',
    color: "#30313D",
  },
  inputContainer: {
    flex: 3,
    paddingLeft: "6%",
    paddingRight: "6%",
  },
});

export default AddDataScreen;
