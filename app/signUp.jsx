import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, NativeModules, useEffect } from "react-native";
import { useRouter } from "expo-router";
import { usePreventScreenCapture} from "expo-screen-capture";


const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

    useEffect(() => {
      NativeModules.PreventScreenshot?.enableSecureMode();
      return () => NativeModules.PreventScreenshot?.disableSecureMode();
    }, []);

  usePreventScreenCapture();

  const handleSignUp = async () => {
    try {
      // check if user already exists
      const res = await fetch(`http://192.168.1.65:3000/users?email=${email}`);
      const existing = await res.json();
      if (existing.length > 0) {
        setError("User already exists");
        return;
      }
  
      // default items for new user
      const defaultItems = [
        { id: 1, checked: false, item: "Bread" },
        { id: 2, checked: false, item: "Cheese" }
      ];
  
      // create new user
      const response = await fetch("http://192.168.1.65:3000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username, 
          email, 
          password,
          items: defaultItems // ✅ add default items
        }),
      });
  
      if (response.ok) {
        setUsername("");
        setEmail("");
        setPassword("");
        router.push("/login"); // redirect to login after signup
      } else {
        setError("Signup failed");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    height: 50,
    backgroundColor: "#007bff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  error: { color: "red", marginBottom: 10, textAlign: "center" },
});
