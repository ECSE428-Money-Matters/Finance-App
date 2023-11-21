import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Chart from 'react-native-chart-kit';

const ExpenseChart = ({ route }) => {
  const [expenseData, setExpenseData] = useState([]);

  useEffect(() => {
    // Fetch expense data from API
    const fetchExpenseData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3000/get_expenses?email=${route.params.email}`);
        const data = await response.json();
        setExpenseData(data);
      } catch (error) {
        console.error('Error fetching expense data:', error);
      }
    };

    fetchExpenseData();
  }, [route.params.email]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expense Chart</Text>
      <ScrollView style={styles.chartContainer}>
        {expenseData.length > 0 ? (
          <Chart
            data={{
              labels: expenseData.map(entry => entry.expense_name),
              datasets: [
                {
                  data: expenseData.map(entry => entry.amount),
                },
              ],
            }}
            width={350}
            height={220}
            chartConfig={{
              backgroundColor: '#1D3557',
              backgroundGradientFrom: '#1D3557',
              backgroundGradientTo: '#075985',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        ) : (
          <Text>No expense data available.</Text>
        )}
      </ScrollView>
    </View>
  );
};
/** 
const IncomeChart = ({ route }) => {
  const [incomeData, setIncomeData] = useState([]);

  useEffect(() => {
    // Fetch expense data from API
    const fetchIncomeData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:3000/get_income?email=${route.params.email}`);
        const data = await response.json();
        setIncomeData(data);
      } catch (error) {
        console.error('Error fetching income data:', error);
      }
    };

    fetchIncomeData();
  }, [route.params.email]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Income Chart</Text>
      <ScrollView style={styles.chartContainer}>
        {incomeData.length > 0 ? (
          <Chart
            data={{
              labels: incomeData.map(entry => entry.income_name),
              datasets: [
                {
                  data: incomeData.map(entry => entry.amount),
                },
              ],
            }}
            width={350}
            height={220}
            chartConfig={{
              backgroundColor: '#1D3557',
              backgroundGradientFrom: '#1D3557',
              backgroundGradientTo: '#075985',
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        ) : (
          <Text>No income data available.</Text>
        )}
      </ScrollView>
    </View>
  );
};
*/


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 75,
  },
  header: {
    color: '#075985',
    fontSize: 35,
    marginBottom: 20,
  },
  chartContainer: {
    marginBottom: 20,
  },
});

export { ExpenseChart,
  // IncomeChart 
};
