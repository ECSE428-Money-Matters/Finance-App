import React, { useState } from "react";
import { View, StyleSheet, TextInput, Button, Text } from "react-native";

const ResetPassword = ({ navigation }) => {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");

  const handleResetPassword = async () => {
    try {
      const url = "window.location.href";
      console.log("url:" + url);
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code,
          password: password,
        }),
      });

      const message = await response.text();

      if (message === "Password was updated") {
        alert("Pasword has been reset");
      } else {
        alert(message);
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      alert("Failed to connect to the server.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Code:</Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        placeholder="Enter your code sent to your email address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>New Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your new password"
        autoCapitalize="none"
        secureTextEntry={true}
      />

      <Button title="Reset Password" onPress={handleResetPassword} />

      <Text style={styles.linkText} onPress={() => navigation.goBack()}>
        Back to Sign In
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 15,
    borderRadius: 5,
  },
  linkText: {
    color: "blue",
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
  },
});

export default ResetPassword;
