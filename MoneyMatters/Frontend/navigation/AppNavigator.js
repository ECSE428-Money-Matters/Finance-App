import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignInPage from "../pages/SignInPage";
import SignUpPage from "../pages/SignUpPage";
import PasswordRecovery from "../pages/PasswordRecovery";
import VerificationCode from "../pages/VerificationCode";
import Dashboard from "../pages/Dashboard";
import createExpensePage from "../pages/CreateExpensePage";
import CreateIncomePage from "../pages/CreateIncomePage";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="SignIn">
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
        options={{headerShown: false }}
        />
        <Stack.Screen
            name="VerificationCode"
            component={VerificationCode}
            options={{headerShown: false }}
        />
        <Stack.Screen
            name="Dashboard"
            component={Dashboard}
            options={{headerShown: false }}
        />
        <Stack.Screen
            name="CreateExpense"
            component={createExpensePage}
            options={{headerShown: false }}
        />
        <Stack.Screen
            name="CreateIncome"
            component={CreateIncomePage}
            options={{headerShown: false }}
        />
    </Stack.Navigator>
  );
};

export default AppNavigator;