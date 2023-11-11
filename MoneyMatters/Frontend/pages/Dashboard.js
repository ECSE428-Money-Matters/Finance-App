import React, {useEffect, useState} from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    Button,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard, ScrollView, Pressable, Platform
} from 'react-native';
import {Colors} from "react-native/Libraries/NewAppScreen";
import Expense from "../components/Expense";
import DateTimePicker from "@react-native-community/datetimepicker";
import {useFocusEffect} from "@react-navigation/native";

const Dashboard = ({navigation, route}) => {
    // const { email } = route.params;
    // const [expenseDescription, setExpenseDescription] = useState('');
    // const [expenseAmount, setExpenseAmount] = useState('');
    // const [expenseCategory, setExpenseCategory] = useState('');
    // const [expenseDate, setExpenseDate] = useState('');
    // const [selectedDate, setSelectedDate] = useState(new Date());
    // const [showDatePicker, setShowDatePicker] = useState(false);
    const [expenses, setExpenses] = useState([]);


    useFocusEffect(
        React.useCallback(() => {
            // This will run when the component gains focus
            handleViewExpense();
        }, [])
    );


    const addExpense = () => {
        navigation.navigate('CreateExpense', { email: route.params.email });
    }
    const handleViewExpense = async () => {
        console.log("GETTING EXPENSES");
        try {
            //setExpenses([...expenses, newExpense]);
            const response = await fetch(`http://127.0.0.1:3000/view_expense?email=${route.params.email}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const responseBody = await response.text();
            const message = JSON.parse(responseBody); // Parse the JSON response
            setExpenses(message);
        } catch (error) {
            // handle error, e.g., network error or server error
            // console.error("Error adding expense:", error);
        }
    };

    function renderHeader() {
        return (
            <View style={styles.headerContainer}>
                <View>
                    <Text style={styles.header}>My Expenses</Text>
                    <Text style={styles.subheader}>Summary</Text>
                </View>

                <View>
                    <TouchableOpacity style={styles.button} onPress={addExpense}>
                        <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    function renderExpenses() {
        return (
            <ScrollView>
                <View style={styles.expenses}>
                    {expenses.map((expense) => (
                        <Expense desc={expense.expense_name} amt={expense.amount} key={expense.expense_id}/>
                    ))}
                </View>
            </ScrollView>
        )
    }

    return (
        <View style={styles.container}>
            {renderHeader()}
            {renderExpenses()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 75
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 15,
        borderRadius: 5,
    },
    linkText: {   // <-- New style for "Sign Up" link
        color: 'blue',
        textAlign: 'center',
        marginTop: 10,
        textDecorationLine: 'underline',
    },
    header: {
        color: Colors.primary,
        fontSize: 35
    },
    subheader: {
        color: '#1D3557',
        fontSize: 20
    },
    expenses: {
        paddingVertical: 20,
        zIndex: 0
    },
    button: {
        height: 35,
        width: 75,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        marginTop: 10,
        marginBottom: 15,
        backgroundColor: "#075985"
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#fff'
    },
    buttonContainer: {
        flexDirection: 'column',
    }, headerContainer: {
        flexDirection: 'row',
        justifyContent: "space-between"
    }
});

export default Dashboard;
