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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
    BarChart,
    PieChart,
} from "react-native-chart-kit";
import { Dimensions } from "react-native";



const ExpenseScreen = ({navigation, route}) => {
    const [expenses, setExpenses] = useState([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('Expenses');
    const [filterLabel, setFilterLabel] = useState('Expenses');
    const [iconName, setIconName] = useState('pie-chart-outline');
    const [filterItems, setFilterItems] = useState([
        {label: 'Expenses', value: 'Expenses'},
        {label: 'Income', value: 'Income'},
    ]);
    const [expenseCategories, setExpenseCategories] = useState([
        {label: 'Housing', value: 'Housing'},
        {label: 'Transportation', value: 'Transportation'},
        {label: 'Food & Dining', value: 'Food%20%26%20Dining'},
        {label: 'Entertainment', value: 'Entertainment'},
        {label: 'Health', value: 'Health'},
        {label: 'Other', value: 'Other'},
    ]);
    const [graphData, setGraphData] = useState({
        labels: ["All", "Housing", "Transportation", "Food & Dining" , "Entertainment", "Health", "Other"],
        datasets: [{
            data: [20, 45, 28, 80, 99, 43, 100]
        }]
    });
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const chartConfig = {
        backgroundGradientFromOpacity: 0,
        backgroundGradientToOpacity: 0,
        color: () => `#1D3557`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
        propsForBackgroundLines: {
            strokeWidth: 0
        },
        decimalPlaces: 0,
        propsForVerticalLabels: {
            fill: '#457B9D',
            rotation: -40,
            fontSize: 10
        },
        propsForHorizontalLabels: {
            fill: '#457B9D'
        }

    };
    const screenWidth = Dimensions.get("window").width;
    // const handleModal = () => setIsModalVisible(() => !isModalVisible);
    const handleModal = () => {
        if(value === 'Expenses'){
            setFilterLabel('Expenses');
        }else{
            setFilterLabel(value);
        }
        setIsModalVisible(() => !isModalVisible)
        handleViewExpense();
    };

    const handleChartChange = () => {
        if (iconName === 'pie-chart-outline') {
            setIconName('stats-chart-outline');
        } else {
            setIconName('pie-chart-outline');
        }
    }

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
            if (value === 'Expenses'){
                const labels = [];
                const dataset = [];

                for (const category of expenseCategories) {
                    const response = await fetch(`http://127.0.0.1:3000/view_expense?email=${route.params.email}&category=${category.value}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });
                    const responseBody = await response.text();
                    const message = JSON.parse(responseBody);

                    const totalAmount = message.reduce((total, item) => total + parseFloat(item.amount), 0);

                    labels.push(category.label);
                    dataset.push(totalAmount);
                }
                setGraphData({
                    labels: labels,
                    datasets: [{
                        data: dataset
                    }]
                });
                // setExpenses(message);
            }else{
                console.log("VALUE: " + value)
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
                    <Text style={styles.header}>My Overview</Text>
                    <Text style={styles.subheader}>Summary</Text>
                    <Text style={styles.subheader2}>{filterLabel}</Text>
                </View>

                <View>
                    <TouchableOpacity style={styles.button} onPress={handleChartChange}>
                        <Ionicons name={iconName} color={'#FFF'} size={25} />
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
                                    items={filterItems}
                                    setOpen={setOpen}
                                    setValue={setValue}
                                    setItems={setFilterItems}
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
                <BarChart
                    style={styles.graphStyle}
                    data={graphData}
                    width={screenWidth}
                    height={250}
                    chartConfig={chartConfig}
                    veticalLabelRotation={90} />
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
        paddingBottom: 25,
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
    }, graphStyle: {
        marginLeft: -15,
        marginTop: 20
    }
});

export default ExpenseScreen;
