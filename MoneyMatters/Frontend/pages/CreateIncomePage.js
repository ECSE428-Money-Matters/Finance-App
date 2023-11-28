import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Income from "../components/Income";
import DateTimePicker from "@react-native-community/datetimepicker";
import Category from "../components/Category";

const CreateIncomePage = ({ navigation, route }) => {
  // const { email } = route.params;
  const [incomeDescription, setIncomeDescription] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [incomeCategory, setIncomeCategory] = useState("");
  const [incomeDate, setIncomeDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategorySelect = (isSelected) => {
    // Update the selected category and its isSelected state in the parent component
    setSelectedCategory(isSelected);
    console.log("CAT: " + selectedCategory);
  };
  const clearText = () => {
    setIncomeAmount("");
    setIncomeDescription("");
    setIncomeDate("");
    setIncomeCategory("");
  };

  const submitButton = () => {
    handleAddIncome();
    clearText();
    Keyboard.dismiss();
  };

  const back = () => {
    navigation.navigate("Dashboard", { email: route.params.email });
  };

  const handleAddIncome = async () => {
    try {
      //setIncomes([...Incomes, newIncome]);
      const response = await fetch("http://10.0.0.124:3000/incomes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: route.params.email,
          income_name: incomeDescription,
          amount: incomeAmount,
          category: selectedCategory,
          posted_date: incomeDate,
          income_period: 1,
        }),
      });

      const responseBody = await response.text();
      console.log("Server response:", responseBody);
      const message = JSON.parse(responseBody); // Parse the JSON response
      if (message.message !== "Income added successfully.") {
        // handle unsuccessful login, e.g., display an error message
        alert(message.error);
      }
    } catch (error) {
      // handle error, e.g., network error or server error
      console.log(error);
      alert(error);
    }
  };

  function renderHeader() {
    return (
      <View>
        <View>
          <Text style={styles.header}>Add Income</Text>
        </View>
        <View style={styles.CategoriesContainer}>
          <Category
            desc={"Salary"}
            onSelect={(isSelected) => handleCategorySelect(isSelected)}
            isSelected={selectedCategory === "Salary"}
          />
          <Category
            desc={"Freelance Work"}
            onSelect={(isSelected) => handleCategorySelect(isSelected)}
            isSelected={selectedCategory === "Freelance Work"}
          />
          <Category
            desc={"Investment"}
            onSelect={(isSelected) => handleCategorySelect(isSelected)}
            isSelected={selectedCategory === "Investment"}
          />
          <Category
            desc={"Other"}
            onSelect={(isSelected) => handleCategorySelect(isSelected)}
            isSelected={selectedCategory === "Other"}
          />
        </View>
      </View>
    );
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
    );
  }

  function renderUI() {
    return (
      <View
        style={
          styles.DateAmountDescriptionContainer
        } /*behavior={"padding"} enabled={true}*/
      >
        <TextInput
          style={styles.textInput}
          value={incomeDescription}
          onChangeText={setIncomeDescription}
          placeholder="Income description"
          color={"#1D3557"}
        />

        <TextInput
          style={styles.textInput}
          value={incomeAmount}
          onChangeText={setIncomeAmount}
          placeholder="Amount"
          keyboardType={"numeric"}
          color={"#1D3557"}
        />

        <TextInput
          style={styles.textInput}
          value={incomeDate}
          onChangeText={setIncomeDate}
          placeholder="Date (YYYY-MM-DD)"
          color={"#1D3557"}
        />
      </View>
    );
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
    paddingVertical: 75,
  },
  header: {
    color: Colors.primary,
    fontSize: 35,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#A8DADC",
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
    height: 35,
    width: 350,
    backgroundColor: "#FFF",
  },
  DateAmountDescriptionContainer: {
    paddingVertical: 15,
  },
  buttonContainer: {
    height: 35,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    backgroundColor: "#075985",
  },
  CategoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  addButton: {
    fontSize: 15,
    fontWeight: "500",
    color: "#fff",
  },
  buttonContainer2: {
    height: 35,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 250,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  backButton: {
    fontSize: 15,
    fontWeight: "500",
    color: "#075985",
  },
  // TODO: STYLE CONTAINERS?
  incomeContainer: undefined,
  incomeDescription: undefined,
});

export default CreateIncomePage;
