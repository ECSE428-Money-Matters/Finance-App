import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Chart from 'react-native-chart-kit';

// before testing this, need to merge income.js in backend
const LineChart = ({ route }) => {
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);

  useEffect(() => {
    // Fetch expense and income data from API
    const fetchFinancialData = async () => {
      try {
        const expenseResponse = await fetch(`http://127.0.0.1:3000/get_expenses?email=${route.params.email}`);
        const expenseData = await expenseResponse.json();
        setExpenseData(expenseData);

        const incomeResponse = await fetch(`http://127.0.0.1:3000/get_income?email=${route.params.email}`);
        const incomeData = await incomeResponse.json();
        setIncomeData(incomeData);
        
      } catch (error) {
        console.error('Error fetching financial data:', error);
      }
    };

    fetchFinancialData();
  }, [route.params.email]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Financial Chart</Text>
      <ScrollView style={styles.chartContainer}>
        {(expenseData.length > 0 || incomeData.length > 0) ? (
          <Chart
            data={{
              labels: expenseData.map(entry => entry.posted_date), 
              datasets: [
                {
                  data: expenseData.map(entry => entry.amount),
                  color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Red for expenses
                  strokeWidth: 2,
                  label: 'Expenses',
                },
                {
                  data: incomeData.map(entry => entry.amount),
                  color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`, // Green for income
                  strokeWidth: 2,
                  label: 'Income',
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
          <Text>No financial data available.</Text>
        )}
      </ScrollView>
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
    color: '#075985',
    fontSize: 35,
    marginBottom: 20,
  },
  chartContainer: {
    marginBottom: 20,
  },
});

export default LineChart;
