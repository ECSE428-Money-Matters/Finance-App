import React, { useState } from "react";
import { View, StyleSheet, TextInput, Button, Text } from "react-native";

const NotFound = ({ navigation }) => {
  const handleRedirectToHomePage = async () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Oops, seems like you have been lost in the application. Please press the
        button below to return to the Home page:
      </Text>

      <Button
        title="Return to the Home page"
        onPress={handleRedirectToHomePage}
      />
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

export default NotFound;
