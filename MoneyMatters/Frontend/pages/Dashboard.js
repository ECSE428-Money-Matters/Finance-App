import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    TextInput,
    Button,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard, ScrollView
} from 'react-native';
import {Colors} from "react-native/Libraries/NewAppScreen";
import Expense from "../components/Expense";

const Dashboard = ({navigation}) => {
    const [expenseDescription, setExpenseDescription] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');

    const clearText = () => {
        setExpenseAmount('');
        setExpenseDescription('');
    }

    const submitButton = () => {
        handleAddExpense();
        clearText();
        Keyboard.dismiss();
    }

    const handleAddExpense = async () => {
        try {
            console.log("Added expense");
            console.log("Description: " + expenseDescription);
            console.log("Amount: " + expenseAmount);
            // const response = await fetch('http://127.0.0.1:3000/login', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //
            //     })
            // });

            // const responseBody = await response.text();
            // const message = JSON.parse(responseBody); // Parse the JSON response
            //
            // if (message === "Login successful") {
            //     // handle successful login, e.g., navigate to a dashboard
            //     navigation.navigate('Dashboard');
            // } else {
            //     // handle unsuccessful login, e.g., display an error message
            //     alert(message);
            // }
        } catch (error) {
            // handle error, e.g., network error or server error
            // console.error("Error adding expense:", error);
        }
    };

    function renderHeader() {
        return (
            <View>
                <View>
                    <Text style={styles.header} >My Expenses</Text>
                    <Text style={styles.subheader}>Summary</Text>
                </View>
            </View>
        )
    }
    function renderExpenses() {
        return (
            <ScrollView>
                <View style={styles.expenses}>
                    <Expense desc={'Ex1'} amt={25}/>
                    <Expense desc={'Ex2'} amt={25}/>
                </View>
            </ScrollView>
        )
    }

    function renderBottomUI() {
        return (
            <KeyboardAvoidingView style={styles.bottomContainer} behavior={"padding"} enabled={true}>
                <TextInput
                    style={styles.expenseDescription}
                    value={expenseDescription}
                    onChangeText={setExpenseDescription}
                    placeholder="Enter your expense desccription"
                />
                <TextInput
                    style={styles.expenseAmount}
                    value={expenseAmount}
                    onChangeText={setExpenseAmount}
                    placeholder="Amount"
                    keyboardType={"numeric"}
                />

                <TouchableOpacity onPress={submitButton}>
                    <Text style={styles.addButton}>+</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        )
    }

    return (
        <View style={styles.container}>
            {renderHeader()}
            {renderBottomUI()}
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
    expenseDescription: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 15,
        borderRadius: 5,
        height: 35,
        width: 250
    },
    expenseAmount: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 15,
        borderRadius: 5,
        height: 35,
        width: 70
    },
    addButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 15,
        borderRadius: 5,
        height: 35,
        width: 25
    },
    bottomContainer: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 75,
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center'
    }, expenses: {
        paddingVertical: 20
    },
});

export default Dashboard;
