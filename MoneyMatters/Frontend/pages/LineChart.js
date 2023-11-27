  import React, { useEffect, useState } from 'react';
  import { View, Text, StyleSheet, ScrollView } from 'react-native';
  import { LineChart as Chart } from 'react-native-chart-kit';
  import { Picker } from '@react-native-picker/picker';


  const LineChart = ({ route }) => {
    const [expenseData, setExpenseData] = useState([]);
    const [incomeData, setIncomeData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());


    const processDataForChart = (data) => {
      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      let dailyTotals = new Array(daysInMonth).fill(0);
      let cumulativeTotal = 0;
    
      data.forEach(entry => {
        const date = new Date(entry.posted_date);
        if (date.getMonth() === selectedMonth && date.getFullYear() === selectedYear) {
          const day = date.getDate() - 1; // Convert date to zero-indexed day of the month
          cumulativeTotal += parseFloat(entry.amount); // Add to cumulative total
          dailyTotals[day] = cumulativeTotal; // Assign cumulative total to the day
        }
      });
    
      // Ensure that we fill in the gaps for cumulative totals on days without expenses
      for (let i = 1; i < dailyTotals.length; i++) {
        if (dailyTotals[i] === 0) {
          dailyTotals[i] = dailyTotals[i - 1];
        }
      }
    
      return dailyTotals;
    };
    

    useEffect(() => {
      const fetchFinancialData = async () => {
        try {
          // Fetching all expenses for the user first
          const response = await fetch(`http://10.121.121.182:3000/view_expense?email=${route.params.email}`);
          
          const text = await response.text(); // Get the response text
          console.log('Response text:', text); // Log the raw text of the response
          
          // Attempt to parse it as JSON
          const allExpenses = JSON.parse(text);
          
          // Filter the expenses based on the selected month and year
          const filteredExpenses = allExpenses.filter(expense => {
            const expenseDate = new Date(expense.posted_date);
            return expenseDate.getMonth() === selectedMonth && expenseDate.getFullYear() === selectedYear;
          });
    
          setExpenseData(processDataForChart(filteredExpenses));
    
          // Similar logic for income if necessary
          // ...
    
        } catch (error) {
          console.error('Error fetching financial data:', error);
        }
      };
    
      fetchFinancialData();
    }, [route.params.email, selectedMonth, selectedYear]);

    const chartData = {
      // We filter the labels to only include the 1st, 10th, 20th, and 30th days
      labels: expenseData.map((_, index) => index + 1).filter(day => [1, 10, 20, 30].includes(day)),
      datasets: [
        {
          data: expenseData,
          color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
          strokeWidth: 2,
          label: 'Expenses',
          // Add the below property to make it a continuous line
          bezier: true,
        },
        {
          data: incomeData, // Make sure you process incomeData the same way as expenseData
          color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
          strokeWidth: 2,
          label: 'Income',
          bezier: true,
        }
      ]
    };

    const renderDatePickers = () => {
      return (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedMonth}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedMonth(itemValue)}>
            {Array.from({ length: 12 }).map((_, index) => (
              <Picker.Item key={index} label={`${index + 1}`} value={index} />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedYear}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedYear(itemValue)}>
            {/* Example year range: 2020-2023 */}
            {Array.from({ length: 4 }).map((_, index) => (
              <Picker.Item key={2023 - index} label={`${2023 - index}`} value={2023 - index} />
            ))}
          </Picker>
        </View>
      );
    };
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Financial Chart</Text>
      {renderDatePickers()}
      <ScrollView style={styles.chartContainer}>
        {(expenseData.length > 0 || incomeData.length > 0) ? (
          <Chart
            data={chartData}
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
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    alignItems: 'center',
  },
  picker: {
    flex: 1,
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
