import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, NativeModules } from "react-native";
import React, { useState } from "react";
import { usePreventScreenCapture } from "expo-screen-capture";
import { useRouter } from "expo-router";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  usePreventScreenCapture();

        useEffect(() => {
          NativeModules.PreventScreenshot?.enableSecureMode();
          return () => NativeModules.PreventScreenshot?.disableSecureMode();
        }, []);

  const handleReset = async () => {
    if (!email) {
      Alert.alert("⚠️ Error", "Please enter your email");
      return;
    }

    try {
      // Fetch user by email from your json-server
      const res = await fetch(`http://192.168.1.65:3000/users?email=${email}`);
      const data = await res.json();

      if (data.length === 0) {
        Alert.alert("❌ Error", "No user found with this email");
        return;
      }

      const user = data[0]; // first matching user
      // Navigate to ChangePassword with userId
      router.push({
        pathname: "/changePassword",
        params: { userId: user.id }
      });
    } catch (error) {
      Alert.alert("Error", "Something went wrong, please try again");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 40 },
  input: { width: "100%", height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 10, marginBottom: 15, fontSize: 16 },
  button: { width: "100%", height: 50, backgroundColor: "#007bff", justifyContent: "center", alignItems: "center", borderRadius: 8, marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
