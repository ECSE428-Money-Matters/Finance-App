import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import PasswordRecovery from "../pages/PasswordRecovery";
import ResetPassword from "../pages/ResetPassword";
import * as Linking from "expo-linking";

const Stack = createStackNavigator();

const linking = {
  prefixes: ["financeapp://"],
  config: {
    screens: {
      ResetPassword: "recover/setpassword/:token",
    },
  },
};

const AppNavigator = () => {
  const url = Linking.useURL();
  if (url) {
    const { hostname, path, queryParams } = Linking.parse(url);
    console.log(
      `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
        queryParams
      )}`
    );
  }
  return (
    <Stack.Navigator initialRouteName="SignUp" linking={linking}>
      <Stack.Screen
        name="SignIn"
        component={SignInPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PasswordRecovery"
        component={PasswordRecovery}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
