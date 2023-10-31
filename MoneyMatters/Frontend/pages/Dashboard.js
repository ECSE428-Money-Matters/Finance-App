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

const Dashboard = ({navigation, route}) => {
    // const { email } = route.params;
    const [expenseDescription, setExpenseDescription] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [expenseCategory, setExpenseCategory] = useState('');
    const [expenseDate, setExpenseDate] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [expenses, setExpenses] = useState([]);
    //const email = 'kjkanafani@gmail.com'
    const clearText = () => {
        setExpenseAmount('');
        setExpenseDescription('');
        setExpenseDate('');
        setExpenseCategory('');
    }

    const toggleDatePicker = () => {
        setShowDatePicker(!showDatePicker);
    }

    const confirmIOSDate = () => {
        setExpenseDate(formatDate(selectedDate));
        toggleDatePicker();
    }

    const formatDate = (rawDate) => {
        let date = new Date(rawDate);

        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        return `${year}-${month}-${day}`;
    }

    const onChange = ({type}, selectedD) => {
        if (type == "set") {
            const currentDate = selectedD;
            setSelectedDate(currentDate);

            if (Platform.OS === "android") {
                toggleDatePicker();
                setExpenseDate(formatDate(currentDate));
            }
        } else {
            toggleDatePicker();
        }
    };

    const submitButton = () => {
        handleAddExpense();
        clearText();
        Keyboard.dismiss();
    };

    useEffect(() => {
        handleViewExpense();
    }, []);

    const handleViewExpense = async () => {
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

    const handleAddExpense = async () => {
        try {
            //setExpenses([...expenses, newExpense]);
            const response = await fetch('http://127.0.0.1:3000/add_expense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: route.params.email,
                    expense_name: expenseDescription,
                    amount: expenseAmount,
                    category: expenseCategory,
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

            handleViewExpense();
        } catch (error) {
            // handle error, e.g., network error or server error
            // console.error("Error adding expense:", error);
        }
    };

    function renderHeader() {
        return (
            <View>
                <View>
                    <Text style={styles.header}>My Expenses</Text>
                    <Text style={styles.subheader}>Summary</Text>
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

    function renderBottomUI() {
        return (
            <KeyboardAvoidingView style={styles.bottomContainer} behavior={"padding"} enabled={true}>
                <TextInput
                    style={styles.expenseDescription}
                    value={expenseDescription}
                    onChangeText={setExpenseDescription}
                    placeholder="Enter your expense description"
                    color={'#1D3557'}
                />
                <TextInput
                    style={styles.expenseAmount}
                    value={expenseAmount}
                    onChangeText={setExpenseAmount}
                    placeholder="Amount"
                    keyboardType={"numeric"}
                    color={'#1D3557'}
                />

                <TouchableOpacity onPress={submitButton}>
                    <Text style={styles.addButton} color={'#1D3557'}>+</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        )
    }

    function renderCategory() {
        return (

            <KeyboardAvoidingView style={styles.CatContainer} behavior={"padding"} enabled={true}
                                  keyboardVerticalOffset={50}>
                <TextInput
                    style={styles.expenseCategory}
                    value={expenseCategory}
                    onChangeText={setExpenseCategory}
                    placeholder="Category"
                    color={'#1D3557'}
                />
            </KeyboardAvoidingView>
        )
    }

    function renderDateUI() {
        return (
            <KeyboardAvoidingView style={styles.DateContainer} behavior={"padding"} enabled={true}
                                  keyboardVerticalOffset={150}>

                {!showDatePicker && (
                    <Pressable
                        onPress={toggleDatePicker}
                    >
                        <TextInput
                            style={styles.expenseDate}
                            placeholder={"Date"}
                            value={expenseDate}
                            onChangeText={setExpenseDate}
                            editable={false}
                            onPressIn={toggleDatePicker}
                        />
                    </Pressable>
                )}

                {showDatePicker && (
                    <DateTimePicker
                        mode="date"
                        display={"spinner"}
                        value={selectedDate}
                        onChange={onChange}
                        style={styles.datePicker}
                    />
                )}

                {showDatePicker && Platform.OS === "ios" && (
                    <View
                        style={{flexDirection: "row", justifyContent: "space-around"}}
                    >

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={[
                                styles.button,
                                styles.pickerButton,
                                {backgroundColor: "#11182711"},
                            ]}
                                              onPress={toggleDatePicker}
                            >
                                <Text style={[
                                    styles.buttonText,
                                    {color: "#075985"}
                                ]}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[
                                styles.button,
                                styles.pickerButton,
                            ]}
                                              onPress={confirmIOSDate}
                            >
                                <Text style={[
                                    styles.buttonText,
                                ]}>Confirm</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                )}

            </KeyboardAvoidingView>
        )
    }

    return (
        <View style={styles.container}>
            {renderHeader()}
            {renderBottomUI()}
            {renderExpenses()}
            {renderDateUI()}
            {renderCategory()}
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
        width: 250,
        backgroundColor: '#A8DADC'
    },
    expenseCategory: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 15,
        borderRadius: 5,
        height: 35,
        width: 120,
        backgroundColor: '#A8DADC'
    },
    expenseAmount: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 15,
        borderRadius: 5,
        height: 35,
        width: 70,
        backgroundColor: '#A8DADC'
    },
    expenseDate: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 15,
        borderRadius: 5,
        height: 35,
        width: 137,
        backgroundColor: '#A8DADC'
    },
    addButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 15,
        borderRadius: 5,
        height: 35,
        width: 25,
        backgroundColor: '#A8DADC'
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
        alignItems: 'center',
        zIndex: 1
    }, expenses: {
        paddingVertical: 20,
        zIndex: 0
    },
    DateContainer: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 75,
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 130,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1
    },
    CatContainer: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 75,
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 75,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1
    },
    datePicker: {
        height: 120,
        marginTop: -10,
        maxWidth: 275
    },
    pickerButton: {
        paddingHorizontal: 20,
    },
    buttonText: {
        fontSize: 8,
        fontWeight: '500',
        color: '#fff'
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
    buttonContainer: {
        flexDirection: 'column',
    }
});

export default Dashboard;
