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
import Icon from 'react-native-vector-icons/MaterialIcons';
import Expense from "../components/Expense";
import Modal from "react-native-modal";
import {useFocusEffect} from "@react-navigation/native";
import { FilterPopUp } from "../components/FilterPopUp";
import DropDownPicker from "react-native-dropdown-picker";
import Income from "../components/Income";

const Dashboard = ({navigation, route}) => {
    const [expenses, setExpenses] = useState([]);
    const [income, setIncome] = useState([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('All');
    const [categoryLabel, setCategoryLabel] = useState('All');
    const [items, setItems] = useState([])
    const [expensesCat, SetExpensesCat] = useState([
        {label: 'All', value: 'All'},
        {label: 'Housing', value: 'Housing'},
        {label: 'Transportation', value: 'Transportation'},
        {label: 'Food & Dining', value: 'Food%20%26%20Dining'},
        {label: 'Entertainment', value: 'Entertainment'},
        {label: 'Health', value: 'Health'},
        {label: 'Other', value: 'Other'},
    ]);
    const [incomeCat, setIncomeCat] = useState([
        {label: 'All', value: 'All'},
        {label: 'Salary', value: 'Salary'},
        {label: 'Freelance Work', value: 'Freelance Work'},
        {label: 'Investment', value: 'Investment'},
        {label: 'Other', value: 'Other'},
    ]);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [currentView, setCurrentView] = useState('My Expenses');

    // const handleModal = () => setIsModalVisible(() => !isModalVisible);
    const handleModal = () => {
        if(value === 'Food%20%26%20Dining'){
            setCategoryLabel('Food & Dining');
        }else{
            setCategoryLabel(value);
        }
        setIsModalVisible(() => !isModalVisible)
        handleViewData();
    };

    useFocusEffect(
        React.useCallback(() => {
            handleViewData();
        }, [currentView])
    );

    const addIncome = () => {
        navigation.navigate('CreateIncome', { email: route.params.email });
    }

    const addExpense = () => {
        navigation.navigate('CreateExpense', { email: route.params.email });
    }
    const handleViewData = async () => {

        if(currentView === 'My Expenses'){
            console.log("GETTING EXPENSES");
            try {
                //setExpenses([...expenses, newExpense]);
                if (value === 'All'){
                    console.log("VALUE NONE")
                    const response = await fetch(`http://192.168.2.20:3000/view_expense?email=${route.params.email}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });
                    const responseBody = await response.text();
                    const message = JSON.parse(responseBody); // Parse the JSON response
                    setExpenses(message);
                }else{
                    console.log("VALUE: " + value)
                    const response = await fetch(`http://192.168.2.20:3000/view_expense?email=${route.params.email}&category=${value}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    const responseBody = await response.text();
                    const message = JSON.parse(responseBody); // Parse the JSON response
                    setExpenses(message);
                }
            } catch (error) {
                // handle error, e.g., network error or server error
                console.error("Error adding expense:", error);
                alert(error);
            }
        }
        else {
            console.log("GETTING INCOME");
            try {
                // Logic for fetching income data
                const response = await fetch(`http://192.168.2.20:3000/incomes?email=${route.params.email}&column_name=${"None"}&category=${value}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const responseBody = await response.text();
                console.log(responseBody);
                const message = JSON.parse(responseBody); // Parse the JSON response
                setIncome(message); // Update this line to setIncome
            } catch (error) {
                // handle error
                console.error("Error fetching income:", error);
            }
        }
    };

    function renderHeader() {
        const toggleView = () => {
            setCurrentView(currentView === 'My Expenses' ? 'My Income' : 'My Expenses');
            // Reset the category filter when toggling views
            setValue('All');
            setCategoryLabel('All');
            // Update dropdown items based on current view
            setItems(currentView === 'My Expenses' ? incomeCat : expensesCat);
        };

        return (
            <View style={styles.headerContainer}>
                <View>
                    <TouchableOpacity onPress={toggleView} style={styles.toggleButton}>
                        <Text style={styles.header}>{currentView}</Text>
                        <Icon name="arrow-drop-down" size={30} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.subheader}>Summary</Text>
                    <Text style={styles.subheader2}>{categoryLabel}</Text>
                </View>

                <View>
                    <TouchableOpacity style={styles.button} onPress={currentView === 'My Expenses' ? addExpense : addIncome}>
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

    function renderData() {
        if (currentView === 'My Expenses') {
            // Render expenses if the current view is 'My Expenses'
            return (
                <ScrollView>
                    <View style={styles.expenses}>
                        {Array.isArray(expenses) && expenses.map((expense) => (
                            <Expense desc={expense.expense_name} amt={expense.amount} key={expense.expense_id}/>
                        ))}
                    </View>
                </ScrollView>
            );
        } else {
            // Render incomes if the current view is 'My Income'
            return (
                <ScrollView>
                    <View style={styles.income}>
                        {Array.isArray(income) && income.map((inc) => (
                            <Income desc={inc.income_name} amt={inc.amount} key={inc.income_id}/>
                        ))}
                    </View>
                </ScrollView>
            );
        }
    }



    return (
        <View style={styles.container}>
            {renderHeader()}
            {renderData()}
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
    subheader2: {
        color: '#457B9D',
        fontSize: 20
    },
    expenses: {
        paddingVertical: 20,
        zIndex: 0
    },
    income: {
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
    },
    toggleButton: {
        flexDirection: 'row', // Align items in a row
        alignItems: 'center', // Center items vertically
    },
});

export default Dashboard;