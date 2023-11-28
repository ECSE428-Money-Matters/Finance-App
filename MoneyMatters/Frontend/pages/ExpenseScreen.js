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
import {Colors} from "react-native/Libraries/NewAppScreen";
import Expense from "../components/Expense";
import Modal from "react-native-modal";
import {useFocusEffect} from "@react-navigation/native";
import { FilterPopUp } from "../components/FilterPopUp";
import DropDownPicker from "react-native-dropdown-picker";


const ExpenseScreen = ({navigation, route}) => {
    const [expenses, setExpenses] = useState([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('All');
    const [categoryLabel, setCategoryLabel] = useState('All');
    const [items, setItems] = useState([
        {label: 'All', value: 'All'},
        {label: 'Housing', value: 'Housing'},
        {label: 'Transportation', value: 'Transportation'},
        {label: 'Food & Dining', value: 'Food%20%26%20Dining'},
        {label: 'Entertainment', value: 'Entertainment'},
        {label: 'Health', value: 'Health'},
        {label: 'Other', value: 'Other'},
    ]);
    const [isModalVisible, setIsModalVisible] = React.useState(false);

    // const handleModal = () => setIsModalVisible(() => !isModalVisible);
    const handleModal = () => {
        if(value === 'Food%20%26%20Dining'){
            setCategoryLabel('Food & Dining');
        }else{
            setCategoryLabel(value);
        }
        setIsModalVisible(() => !isModalVisible)
        handleViewExpense();
    };

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
        try {
            //setExpenses([...expenses, newExpense]);
            if (value === 'All'){
                const response = await fetch(`http://127.0.0.1:3000/view_expense?email=${route.params.email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                const responseBody = await response.text();
                const message = JSON.parse(responseBody); // Parse the JSON response
                setExpenses(message);
            }else{
                const response = await fetch(`http://127.0.0.1:3000/view_expense?email=${route.params.email}&category=${value}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                const responseBody = await response.text();
                const message = JSON.parse(responseBody); // Parse the JSON response
                setExpenses(message);
            }
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
                    <Text style={styles.subheader2}>{categoryLabel}</Text>
                </View>

                <View>
                    <TouchableOpacity style={styles.button} onPress={addExpense}>
                        <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleModal}>
                        <Text style={styles.buttonText}>Filter</Text>
                    </TouchableOpacity>
                    <FilterPopUp isVisible={isModalVisible}>
                        <FilterPopUp.Container>
                            <FilterPopUp.Header title="Filter Category" />
                            <FilterPopUp.Body>
                                <DropDownPicker
                                    open={open}
                                    value={value}
                                    items={items}
                                    setOpen={setOpen}
                                    setValue={setValue}
                                    setItems={setItems}
                                    placeholder="Filter"
                                    theme="DARK"
                                />
                            </FilterPopUp.Body>
                            <FilterPopUp.Footer>
                                <TouchableOpacity style={styles.buttonFilter} onPress={handleModal}>
                                    <Text style={styles.buttonText}>OK</Text>
                                </TouchableOpacity>
                            </FilterPopUp.Footer>
                        </FilterPopUp.Container>
                    </FilterPopUp>
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
        // paddingVertical: 75,
        paddingTop: 75,
        paddingBottom: 25
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
    subheader2: {
        color: '#457B9D',
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
    buttonFilter: {
        height: 35,
        width: '100%',
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

export default ExpenseScreen;
