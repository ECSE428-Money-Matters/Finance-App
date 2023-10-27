import React, { useState } from "react";
import { View, StyleSheet, TextInput, Button, Text } from "react-native";

const PasswordRecovery = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const handlePasswordRecovery = async () => {
    try {
      const url = "http://" + "192.168.0.104" + ":3000" + "/recover";
      console.log(url);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const resBody = await response.text();
      const message = JSON.parse(resBody);
      console.log(message);

      if (message == "Password recovery successfully requested") {
        alert("Check your email for password recovery instructions!");
        navigation.navigate("SignIn");
      } else {
        alert(message);
      }
    } catch (error) {
      console.error("Error during password recovery:", error);
      alert("Failed to connect to the server.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email linked to your account"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button title="Recover Password" onPress={handlePasswordRecovery} />

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

export default PasswordRecovery;
