import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Switch,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Spinner from "react-native-loading-spinner-overlay";
import LoginLogo from "../assets/images/loginlogo";
import { useBackHandler } from "@react-native-community/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const LoginPage = ({ navigation }) => {
  useBackHandler(() => {
    return true;
  });

  // const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState("admin"); // Default to 'admin'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // New state for "Remember Me"
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load "Remember Me" settings from AsyncStorage on component mount
    loadRememberMeSettings();
  }, []);

  const loadRememberMeSettings = async () => {
    try {
      const rememberMeValue = await AsyncStorage.getItem("rememberMe");
      if (rememberMeValue !== null) {
        // Set the "Remember Me" state based on the value from AsyncStorage
        setRememberMe(rememberMeValue === "true");
        console.log('Loaded "Remember Me" settings from AsyncStorage');
      }
    } catch (error) {
      console.error('Error loading "Remember Me" settings:', error);
    }
  };

  const saveRememberMeSettings = async () => {
    try {
      await AsyncStorage.setItem("rememberMe", rememberMe.toString());
    } catch (error) {
      console.error('Error saving "Remember Me" settings:', error);
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setRememberMe(false);
  };

  const handleSignIn = () => {
    setIsLoading(true);

    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((response) => {
        setIsLoading(false);
        if (selectedOption === "admin") {
          navigation.navigate("Dashboard");
        } else if (selectedOption === "student") {
          navigation.navigate("Dashboard");
        }
        setEmail("");
        setPassword("");

        // Save "Remember Me" settings when the user successfully logs in
        if (rememberMe) {
          saveRememberMeSettings();
        }

        console.log(`${selectedOption} successfully logged in`);
      })
      .catch((error) => {
        setIsLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.pinDiv}>
        <LoginLogo />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.adminButton,
            selectedOption === "admin" && styles.selectedButton,
            selectedOption === "student" && styles.unselectedButton,
          ]}
          onPress={() => handleOptionSelect("admin")}
        >
          <Text
            style={[
              styles.buttonText,
              selectedOption === "student" && styles.unselectedText,
            ]}
          >
            Admin
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            styles.studentButton,
            selectedOption === "student" && styles.selectedButton,
            selectedOption === "admin" && styles.unselectedButton,
          ]}
          onPress={() => handleOptionSelect("student")}
        >
          <Text
            style={[
              styles.buttonText,
              selectedOption === "admin" && styles.unselectedText,
            ]}
          >
            Student
          </Text>
        </TouchableOpacity>
      </View>

      {selectedOption && (
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <FontAwesome
              name="envelope"
              size={24}
              color="#807A7A99"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="email@gmail.com"
              placeholderTextColor="#74768890"
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
          </View>
          <View style={styles.passwordContainer}>
            <FontAwesome
              name="lock"
              size={28}
              color="#807A7A99"
              style={styles.icon}
            />
            <TextInput
              style={styles.passwordInput}
              placeholder="password"
              placeholderTextColor="#74768890"
              secureTextEntry={!showPassword}
              onChangeText={(text) => setPassword(text)}
              value={password}
            />
            <TouchableOpacity
              style={styles.showPasswordButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <FontAwesome
                name={showPassword ? "eye-slash" : "eye"}
                size={24}
                color="#807A7A99"
                paddingHorizontal={10}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.rememberMeContainer}>
            <Text>Remember Me</Text>
            <Switch
              trackColor={{ false: "#C0C8D2", true: "#635BFF" }}
              thumbColor={rememberMe ? "#fff" : "#fff"}
              value={rememberMe}
              onValueChange={(value) => setRememberMe(value)}
            />
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
            <Text style={styles.loginButtonText}>SIGN IN</Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading && (
        <Spinner
          visible={isLoading}
          textContent={"Signing In..."}
          textStyle={styles.spinnerText}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  pinDiv: {
    flex: 1,
    justifyContent: "center",
    marginTop: "30%",
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
    fontSize: 24,
    // fontWeight: 'bold',
    color: "#000",
  },
  inputContainer: {
    flex: 3,
    width: "80%",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E4DFDF",
    borderRadius: 16,
    marginBottom: 20,
  },
  input: {
    flex: 1,
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
    paddingHorizontal: 10,
  },
  showPasswordButton: {
    padding: 10,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#635BFF",
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    fontSize: 24,
    // fontWeight: 'bold',
    color: "#fff",
  },
  spinnerText: {
    color: "#FFF",
  },
});

export default LoginPage;
