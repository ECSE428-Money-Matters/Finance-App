import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="SignUp">
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
    </Stack.Navigator>
  );
};

export default AppNavigator;
