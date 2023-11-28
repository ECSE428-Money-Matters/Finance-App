import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    ScrollView
} from 'react-native';
import {Colors} from "react-native/Libraries/NewAppScreen";
import Income from "../components/Income"; // Make sure you have a similar component for Income
import Modal from "react-native-modal";
import {useFocusEffect} from "@react-navigation/native";
import { FilterPopUp } from "../components/FilterPopUp";
import DropDownPicker from "react-native-dropdown-picker";

const IncomeScreen = ({navigation, route}) => {
    const [income, setIncome] = useState([]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('All');
    const [categoryLabel, setCategoryLabel] = useState('All');
    const [items, setItems] = useState([
        {label: 'All', value: 'All'},
        {label: 'Salary', value: 'Salary'},
        {label: 'Freelance Work', value: 'Freelance Work'},
        {label: 'Investment', value: 'Investment'},
        {label: 'Other', value: 'Other'},
    ]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleModal = () => {
        setCategoryLabel(value);
        setIsModalVisible(!isModalVisible);
        handleViewIncome();
    };

    useFocusEffect(
        React.useCallback(() => {
            handleViewIncome();
        }, [])
    );

    const addIncome = () => {
        navigation.navigate('CreateIncome', { email: route.params.email });
    };

    const handleViewIncome = async () => {
        try {
            // Adjust the API endpoint and parameters as necessary
            const response = await fetch(`http://127.0.0.1:3000/incomes?email=${route.params.email}&column_name=${"None"}&category=${value}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            const responseBody = await response.text();
            const message = JSON.parse(responseBody);
            setIncome(message);
            console.log('Income data:', message);
        } catch (error) {
            console.error("Error fetching income:", error);
        }
    };

    function renderHeader() {
        return (
            <View style={styles.headerContainer}>
                <View>
                    <Text style={styles.header}>My Income</Text>
                    <Text style={styles.subheader}>Summary</Text>
                    <Text style={styles.subheader2}>{categoryLabel}</Text>
                </View>

                <View>
                    <TouchableOpacity style={styles.button} onPress={addIncome}>
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
        );
    }

    function renderIncome() {
        console.log('Income data in renderIncome:', income);
        return (
            <ScrollView>
                <View style={styles.income}>
                    {income.map((inc) => (
                        <Income desc={inc.income_name} amt={inc.amount} key={inc.income_id} />
                    ))}
                </View>
            </ScrollView>
        );
    }

    return (

        <View style={styles.container}>
            {renderHeader()}
            {renderIncome()}
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
    }
});

export default IncomeScreen;