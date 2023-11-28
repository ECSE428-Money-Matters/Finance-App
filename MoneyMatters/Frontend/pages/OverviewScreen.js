import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Text,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Expense from "../components/Expense";
import Modal from "react-native-modal";
import { useFocusEffect } from "@react-navigation/native";
import { FilterPopUp } from "../components/FilterPopUp";
import DropDownPicker from "react-native-dropdown-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BarChart, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const OverviewScreen = ({ navigation, route }) => {
  const [expenses, setExpenses] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("Expenses");
  const [filterLabel, setFilterLabel] = useState("Expenses");
  const [iconName, setIconName] = useState("pie-chart-outline");
  const [filterItems, setFilterItems] = useState([
    { label: "Expenses", value: "Expenses" },
    { label: "Income", value: "Income" },
  ]);
  const [expenseCategories, setExpenseCategories] = useState([
    { label: "Housing", value: "Housing" },
    { label: "Transportation", value: "Transportation" },
    { label: "Food & Dining", value: "Food%20%26%20Dining" },
    { label: "Entertainment", value: "Entertainment" },
    { label: "Health", value: "Health" },
    { label: "Other", value: "Other" },
  ]);
  const [incomeCategories, setIncomeCategories] = useState([
    { label: "Salary", value: "Salary" },
    { label: "Freelance Work", value: "Freelance Work" },
    { label: "Investment", value: "Investment" },
    { label: "Other", value: "Other" },
  ]);
  const [graphData, setGraphData] = useState({
    labels: [
      "All",
      "Housing",
      "Transportation",
      "Food & Dining",
      "Entertainment",
      "Health",
      "Other",
    ],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 100],
      },
    ],
  });

  const navigateToLineChart = () => {
    navigation.navigate("LineChart", { email: route.params.email });
  };

  // Additional state for Pie Chart data
  const [pieChartData, setPieChartData] = useState([]);
  const [showAbsoluteValues, setShowAbsoluteValues] = useState(false);
  const [showGraphValues, setShowGraphValues] = useState(false);

  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const chartConfig = {
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: () => `#1D3557`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForBackgroundLines: {
      strokeWidth: 0,
    },
    decimalPlaces: 0,
    propsForVerticalLabels: {
      fill: "#457B9D",
      rotation: -40,
      fontSize: 10,
    },
    propsForHorizontalLabels: {
      fill: "#457B9D",
    },
  };
  const pieChartConfig = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 2,
    formatYLabel: formatYLabel,
  };
  const screenWidth = Dimensions.get("window").width;
  const formatYLabel = (y) => {
    return showAbsoluteValues ? `${y}$` : y;
  };
  const handleModal = () => {
    if (value === "Expenses") {
      setFilterLabel("Expenses");
    } else {
      setFilterLabel(value);
    }
    setIsModalVisible(() => !isModalVisible);
    handleViewExpense();
  };

  const handleChartChange = () => {
    if (iconName === "pie-chart-outline") {
      setIconName("stats-chart-outline");
    } else {
      setIconName("pie-chart-outline");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // This will run when the component gains focus
      handleViewExpense();
    }, [])
  );

  const addExpense = () => {
    navigation.navigate("CreateExpense", { email: route.params.email });
  };
  const handleViewExpense = async () => {
    try {
      const labels = [];
      const dataset = [];
      const pieData = [];
      const categories =
        value === "Expenses" ? expenseCategories : incomeCategories;
      const endpoint = value === "Expenses" ? "/view_expense" : "/incomes";
      const baseUrl = `http://192.168.0.104:3000`;

      for (const category of categories) {
        const url =
          value === "Expenses"
            ? `${baseUrl}${endpoint}?email=${route.params.email}&category=${category.value}`
            : `${baseUrl}${endpoint}?email=${
                route.params.email
              }&column_name=${"None"}&category=${category.value}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const responseBody = await response.text();
        const message = JSON.parse(responseBody);
        const totalAmount = message.reduce(
          (total, item) => total + parseFloat(item.amount),
          0
        );

        // Update data for Bar Chart
        labels.push(category.label);
        dataset.push(totalAmount);

        const color = categoryColors[category.label] || "#999999";

        // Update data for Pie Chart
        pieData.push({
          name: category.label,
          amount: totalAmount,
          value: `${totalAmount}$`,
          color: color,
          legendFontColor: "#606060",
          legendFontSize: 12,
        });
      }

      // Set data for Bar Chart
      setGraphData({
        labels: labels,
        datasets: [{ data: dataset }],
      });

      // Set data for Pie Chart
      setPieChartData(pieData);
    } catch (error) {
      console.error("Error fetching data:", error);
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
            <Ionicons name={iconName} color={"#FFF"} size={25} />
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
                <TouchableOpacity
                  style={styles.buttonFilter}
                  onPress={handleModal}
                >
                  <Text style={styles.buttonText}>OK</Text>
                </TouchableOpacity>
              </FilterPopUp.Footer>
            </FilterPopUp.Container>
          </FilterPopUp>
        </View>
        <TouchableOpacity style={styles.button} onPress={navigateToLineChart}>
          <Text style={styles.largeButtonText}>Line Plot</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderExpenses() {
    const isBarChart = iconName === "pie-chart-outline";

    return (
      <ScrollView>
        {isBarChart ? (
          <TouchableOpacity
            onPress={() => setShowGraphValues(!showGraphValues)}
          >
            <BarChart
              style={styles.graphStyle}
              data={graphData}
              width={screenWidth}
              height={250}
              chartConfig={chartConfig}
              verticalLabelRotation={90}
              withVerticalLabels={true}
              fromZero={true}
              showValuesOnTopOfBars={showGraphValues}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.pieChart}
            onPress={() => setShowAbsoluteValues(!showAbsoluteValues)}
          >
            <PieChart
              data={pieChartData}
              width={screenWidth - 10}
              height={200}
              chartConfig={{
                ...pieChartConfig,
                formatYLabel: formatYLabel,
              }}
              accessor={"amount"}
              backgroundColor={"transparent"}
              paddingLeft={"-20"}
              center={[15, 5]}
              absolute={showAbsoluteValues}
            />
          </TouchableOpacity>
        )}
      </ScrollView>
    );
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
    paddingBottom: 50,
  },
  largeButton: {
    zIndex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "#075985",
    paddingHorizontal: 30,
    alignSelf: "center",
    position: "absolute", // Position button absolutely
    top: 615, // Distance from bottom
    left: "10%", // Left position
    right: "10%", // Right position, ensures the button is centered
    width: "80%", // Button width
    width: "80%", // Button width
  },
  largeButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#fff",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 15,
    borderRadius: 5,
  },
  linkText: {
    // <-- New style for "Sign Up" link
    color: "blue",
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
  },
  header: {
    color: Colors.primary,
    fontSize: 35,
  },
  subheader: {
    color: "#1D3557",
    fontSize: 20,
  },
  subheader2: {
    color: "#457B9D",
    fontSize: 20,
  },
  expenses: {
    paddingVertical: 20,
    zIndex: 0,
  },
  button: {
    height: 35,
    width: 75,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: "#075985",
  },
  buttonFilter: {
    height: 35,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: "#075985",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "column",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  graphStyle: {
    marginLeft: -15,
    marginTop: 20,
  },
  pieChart: {
    borderRadius: 30,
    borderColor: "#7F7F7F",
    backgroundColor: "#ffffff",
    elevation: 0,
    marginBottom: 5,
    marginTop: 5,
    borderWidth: 1,
  },
});

const categoryColors = {
  Housing: "#FF6384",
  Transportation: "#36A2EB",
  "Food & Dining": "#FFCE56",
  Entertainment: "#4BC0C0",
  Health: "#9966FF",
  Other: "#b85d00",
  Salary: "#00a615",
  "Freelance Work": "#001e98",
  Investment: "#b40000",
};

export default OverviewScreen;
