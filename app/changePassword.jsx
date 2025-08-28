import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, NativeModules } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

const ChangePassword = () => {
  const { userId } = useLocalSearchParams(); // get userId from navigation params
  const [password, setPassword] = useState("");
  const router = useRouter();

          useEffect(() => {
            NativeModules.PreventScreenshot?.enableSecureMode();
            return () => NativeModules.PreventScreenshot?.disableSecureMode();
          }, []);

  const handleChange = async () => {
    if (!password) {
      Alert.alert("⚠️ Error", "Please enter a new password");
      return;
    }

    try {
      // Update user password in json-server
      await fetch(`http://192.168.1.65:3000/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      Alert.alert("✅ Success", "Password updated successfully");
      router.replace("/login"); // send back to login
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={handleChange}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 40 },
  input: { width: "100%", height: 50, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 10, marginBottom: 15, fontSize: 16 },
  button: { width: "100%", height: 50, backgroundColor: "#28a745", justifyContent: "center", alignItems: "center", borderRadius: 8, marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
});
