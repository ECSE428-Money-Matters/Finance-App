import React, {useEffect, useState} from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    Button,
    Text,
    TouchableOpacity,
    Keyboard, ScrollView, Pressable, Platform
} from 'react-native';
import { NavigationContainer} from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import ExpenseScreen from "./ExpenseScreen";
import IncomeScreen from "./IncomeScreen";
import OverviewScreen from "./OverviewScreen";

// Screen names
const ExpenseScrName = 'Expense';
const IncomeScrName = 'Income';
const OverviewScrName = 'Overview';

const Tab = createBottomTabNavigator();

const Dash = ({navigation, route}) => {
    const [email, setEmail] = useState(route.params.email);

    return (
        <Tab.Navigator
            initialRouteName={ExpenseScrName}
            screenOptions={ ({route}) => ({
                tabBarIcon: ( {focused, color, size}) => {
                    let iconName;
                    let rn = route.name;

                    if (rn === ExpenseScrName) {
                        iconName = focused ? 'trending-down' : 'trending-down-outline'
                    } else if (rn === IncomeScrName) {
                        iconName = focused ? 'trending-up' : 'trending-up-outline'
                    } else if (rn === OverviewScrName) {
                        iconName = focused ? 'bar-chart' : 'bar-chart-outline'
                    }

                    return <Ionicons name={iconName} size={size} color={color} />
                },
            })}>
            <Tab.Screen name={ExpenseScrName}
                        component={ExpenseScreen}
                        initialParams={{
                email: email
            }}
                        options={{
                            headerShown : false,
                        }}
            />
            <Tab.Screen name={IncomeScrName} component={IncomeScreen} />
            <Tab.Screen name={OverviewScrName} component={OverviewScreen} initialParams={{
                email: email
            }}
                        options={{
                            headerShown : false,
                        }}/>

        </Tab.Navigator>
    );





};

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         paddingHorizontal: 15,
//         paddingVertical: 75
//     },
//     label: {
//         fontSize: 16,
//         marginBottom: 8,
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: '#ccc',
//         padding: 8,
//         marginBottom: 15,
//         borderRadius: 5,
//     },
//     linkText: {   // <-- New style for "Sign Up" link
//         color: 'blue',
//         textAlign: 'center',
//         marginTop: 10,
//         textDecorationLine: 'underline',
//     },
//     header: {
//         color: Colors.primary,
//         fontSize: 35
//     },
//     subheader: {
//         color: '#1D3557',
//         fontSize: 20
//     },
//     subheader2: {
//         color: '#457B9D',
//         fontSize: 20
//     },
//     expenses: {
//         paddingVertical: 20,
//         zIndex: 0
//     },
//     button: {
//         height: 35,
//         width: 75,
//         justifyContent: "center",
//         alignItems: "center",
//         borderRadius: 50,
//         marginTop: 10,
//         marginBottom: 15,
//         backgroundColor: "#075985"
//     },
//     buttonFilter: {
//         height: 35,
//         width: '100%',
//         justifyContent: "center",
//         alignItems: "center",
//         borderRadius: 50,
//         marginTop: 10,
//         marginBottom: 15,
//         backgroundColor: "#075985"
//     },
//     buttonText: {
//         fontSize: 15,
//         fontWeight: '500',
//         color: '#fff'
//     },
//     buttonContainer: {
//         flexDirection: 'column',
//     }, headerContainer: {
//         flexDirection: 'row',
//         justifyContent: "space-between"
//     }
// });

export default Dash;
