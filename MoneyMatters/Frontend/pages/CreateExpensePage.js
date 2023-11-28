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
import Category from "../components/Category";

const CreateExpense = ({navigation, route}) => {
    // const { email } = route.params;
    const [expenseDescription, setExpenseDescription] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseCategory, setExpenseCategory] = useState('');
    const [expenseDate, setExpenseDate] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleCategorySelect = (isSelected) => {
        // Update the selected category and its isSelected state in the parent component
        setSelectedCategory(isSelected);
        console.log("CAT: " + selectedCategory)
    };
    const clearText = () => {
        setExpenseAmount('');
        setExpenseDescription('');
        setExpenseDate('');
        setExpenseCategory('');
    }

    const submitButton = () => {
        handleAddExpense();
        clearText();
        Keyboard.dismiss();
    };

    const back = () => {
        navigation.navigate('Dashboard', { email: route.params.email })
    };

    const handleAddExpense = async () => {
        try {
            //setExpenses([...expenses, newExpense]);
            const response = await fetch('http://10.0.0.124:3000/add_expense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: route.params.email,
                    expense_name: expenseDescription,
                    amount: expenseAmount,
                    category: selectedCategory,
                    posted_date: expenseDate
                })
            });

            const responseBody = await response.text();
            const message = JSON.parse(responseBody); // Parse the JSON response
            if (message.message === "Expense added successfully.") {
                // handle successful login, e.g., navigate to a dashboard
                //navigation.navigate('Dashboard');
            } else {
                // handle unsuccessful login, e.g., display an error message
                alert(message.error);
            }
        } catch (error) {
            // handle error, e.g., network error or server error
            // console.error("Error adding expense:", error);
        }
    };

    function renderHeader() {
        return (
            <View>
                <View>
                    <Text style={styles.header}>Add Expense</Text>
                </View>
                <View style={styles.CategoriesContainer}>
                    <Category desc={"Housing"} onSelect={(isSelected) => handleCategorySelect(isSelected)}
                              isSelected={selectedCategory === "Housing"}/>
                    <Category desc={"Transportation"} onSelect={(isSelected) => handleCategorySelect(isSelected)}
                              isSelected={selectedCategory === "Transportation"}/>
                    <Category desc={"Food & Dining"} onSelect={(isSelected) => handleCategorySelect(isSelected)}
                              isSelected={selectedCategory === "Food & Dining"}/>
                    <Category desc={"Entertainment"} onSelect={(isSelected) => handleCategorySelect(isSelected)}
                              isSelected={selectedCategory === "Entertainment"}/>
                    <Category desc={"Health"} onSelect={(isSelected) => handleCategorySelect(isSelected)}
                              isSelected={selectedCategory === "Health"}/>
                    <Category desc={"Other"} onSelect={(isSelected) => handleCategorySelect(isSelected)}
                              isSelected={selectedCategory === "Other"}/>
                </View>
            </View>
        )
    }


    function renderExpenseUI() {
        return (
            <KeyboardAvoidingView style={styles.expenseContainer} behavior={"padding"} enabled={true}>
                <TextInput
                    style={styles.expenseDescription}
                    value={expenseDescription}
                    onChangeText={setExpenseDescription}
                    placeholder="Expense description"
                    color={'#1D3557'}
                />
            </KeyboardAvoidingView>
        )
    }

    function renderButtonUI() {
        return (
            <View>
                <TouchableOpacity style={styles.buttonContainer} onPress={submitButton}>
                    <Text style={styles.addButton}>Add</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buttonContainer2} onPress={back}>
                    <Text style={styles.backButton}>Back</Text>
                </TouchableOpacity>
            </View>
        )
    }

    function renderUI() {
        return (
            <View style={styles.DateAmountDescriptionContainer} /*behavior={"padding"} enabled={true}*/>
                <TextInput
                    style={styles.textInput}
                    value={expenseDescription}
                    onChangeText={setExpenseDescription}
                    placeholder="Expense description"
                    color={'#1D3557'}
                />

                <TextInput
                    style={styles.textInput}
                    value={expenseAmount}
                    onChangeText={setExpenseAmount}
                    placeholder="Amount"
                    keyboardType={"numeric"}
                    color={'#1D3557'}
                />

                <TextInput
                    style={styles.textInput}
                    value={expenseDate}
                    onChangeText={setExpenseDate}
                    placeholder="Date (YYYY-MM-DD)"
                    color={'#1D3557'}
                />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {renderHeader()}
            {renderUI()}
            {renderButtonUI()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 75
    },
    header: {
        color: Colors.primary,
        fontSize: 35
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#A8DADC',
        padding: 8,
        marginBottom: 10,
        borderRadius: 5,
        height: 35,
        width: 350,
        backgroundColor: '#FFF'
    },
    DateAmountDescriptionContainer: {
        paddingVertical: 15
    },
    buttonContainer: {
        height: 35,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        backgroundColor: "#075985"
    },
    CategoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    addButton: {
        fontSize: 15,
        fontWeight: '500',
        color: '#fff'
    },
    buttonContainer2: {
        height: 35,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        marginTop: 250,
        marginBottom: 15,
        backgroundColor: "#fff"
    },
    backButton: {
        fontSize: 15,
        fontWeight: '500',
        color: '#075985'
    },
});

export default CreateExpense;