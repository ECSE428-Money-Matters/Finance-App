import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native"; // Added this line
import AppNavigator from "./navigation/AppNavigator";
import * as Linking from "expo-linking";
import { useEffect } from "react";

export default function App() {
  const config = {
    screens: {
      ResetPassword: "recover/setpassword/:recid",
      NotFound: "*",
    },
  };

  const linking = {
    prefixes: [Linking.createURL("/")],
    config,
  };

  const url = Linking.useURL();
  useEffect(() => {
    // Do something with url
    console.log(url);
  }, [url]);
  if (url) {
    const { hostname, path, queryParams } = Linking.parse(url);
    console.log(
      `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
        queryParams
      )}`
    );
  }
  return (
    <NavigationContainer linking={linking} fallback={<Text>Loading...</Text>}>
      <AppNavigator />
    </NavigationContainer>
  );
}
