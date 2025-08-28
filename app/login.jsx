import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Pressable, 
  Alert, 
  BackHandler ,
   Platform
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Link, useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import { usePreventScreenCapture} from "expo-screen-capture";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartContext } from '../context/CartContext';
// import JailMonkey from 'jail-monkey'



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const { clearCart } = useContext(CartContext);

  const router = useRouter();

  usePreventScreenCapture();

  // ✅ jailbreak/root detection
  const isRootedOrJailbroken = async () => {
    if (Platform.OS === "android") {
      const rootPaths = [
        "/system/app/Superuser.apk",
        "/sbin/su",
        "/system/bin/su",
        "/system/xbin/su",
        "/data/local/xbin/su",
      ];
      for (let path of rootPaths) {
        const fileInfo = await FileSystem.getInfoAsync(path);
        if (fileInfo.exists) return true;
      }
    } else if (Platform.OS === "ios") {
      const jailbreakPaths = [
        "/Applications/Cydia.app",
        "/Library/MobileSubstrate/MobileSubstrate.dylib",
        "/bin/bash",
        "/usr/sbin/sshd",
        "/etc/apt",
      ];
      for (let path of jailbreakPaths) {
        const fileInfo = await FileSystem.getInfoAsync(path);
        if (fileInfo.exists) return true;
      }
    }
    return false;
  };

  // useEffect(() => {
  //   (async () => {
  //     const rooted = await isRootedOrJailbroken();
  //     if (rooted) {
  //       Alert.alert("Security Alert", "This device is rooted/jailbroken. The app cannot run.");
  //       BackHandler.exitApp();
  //     }
  //   })();

  // }, []);

//   if (JailMonkey.AdbEnabled	()) {
//     console.log("adbenabled")
//     Alert.alert("developer options enabled")
//     // Alternative behaviour for jail-broken/rooted devices.
//   } else {
//     console.log("disabled")
//         Alert.alert("developer options disabled")
//   }

  const checkDeveloperMode = async () => {
    if (__DEV__) {
      // Alert.alert("Security Alert", "Developer mode is enabled. Closing app.");
      // BackHandler.exitApp();

    }
  };

  useEffect(() =>{ checkDeveloperMode()}, [])

  // ✅ Run security checks
  useEffect(() => {
    (async () => {
      const rooted = await isRootedOrJailbroken();
      if (rooted) {
        Alert.alert("Security Alert", "This device is rooted/jailbroken. Closing app.");
        BackHandler.exitApp();
      }
      checkDeveloperMode();
    })();
  }, []);

  useEffect(() => {
    const clearStorage = async () => {
      try {
        await AsyncStorage.clear(); // ✅ clears all keys including userId
        console.log("AsyncStorage cleared successfully");
      } catch (e) {
        console.error("Error clearing AsyncStorage:", e);
      }
    };
  
    clearStorage();
  }, []);
  

  // ✅ Handle Login with json-server

  const handleLogin = async () => {
    try {
      const response = await fetch("http://192.168.1.65:3000/users");
      const users = await response.json();
  
      const user = users.find(
        (u) => u.email === email && u.password === password
      );
      
      if (user) {

        await AsyncStorage.setItem("userId", user.id.toString()); // ✅ only save ID
        clearCart();
        setEmail("")
        setPassword("")
        router.push("/home"); 
      } else {
        setError(true);
      }
    } catch (e) {
      console.error("Login Error:", e);
      Alert.alert("Error", "Unable to connect to server");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Link href="/signUp" style={{ marginHorizontal: "auto" }} asChild>
        <Pressable style={styles.signUp}>
          <Text style={styles.buttonText}>Or Create a new Account</Text>
        </Pressable>
      </Link>

      {(
        <Link href="/forgotPassword" style={{ marginHorizontal: "auto" }} asChild>
          <Pressable>
            <Text style={styles.error}>Forgot password?</Text>
          </Pressable>
        </Link>
      )}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  signUp: {
    width: "100%",
    height: 50,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  error: {
    color: "red",
  },
});
