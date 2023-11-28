  import React, { useEffect, useState } from 'react';
  import { View, Text, StyleSheet, ScrollView } from 'react-native';
  import { LineChart as Chart } from 'react-native-chart-kit';
  import { Picker } from '@react-native-picker/picker';
  import { useNavigation } from '@react-navigation/native';
  import { Button } from 'react-native';


  const LineChart = ({ route }) => {
    const navigation = useNavigation();

    const [expenseData, setExpenseData] = useState([]);
    const [incomeData, setIncomeData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());


    const processDataForChart = (data) => {
      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      let dailyTotals = new Array(daysInMonth).fill(0);
    
      data.forEach(entry => {
        const date = new Date(entry.posted_date);
        if (date.getMonth() === selectedMonth && date.getFullYear() === selectedYear) {
          const day = date.getDate() - 1;
          const amount = parseFloat(entry.amount);
          if (isFinite(amount)) { // Check if amount is a finite number
            for (let i = day; i < dailyTotals.length; i++) {
              dailyTotals[i] += amount;
            }
          }
        }
      });
    
      return dailyTotals;
    };
       

    useEffect(() => {
      const fetchFinancialData = async () => {
        try {
          // Fetch expenses
          const expenseResponse = await fetch(`http://127.0.0.1:3000/view_expense?email=${route.params.email}`);
          const expenses = await expenseResponse.json();
          const filteredExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.posted_date);
            return expenseDate.getMonth() === selectedMonth && expenseDate.getFullYear() === selectedYear;
          });
          setExpenseData(processDataForChart(filteredExpenses));
    
          // Fetch incomes
          const incomeResponse = await fetch(`http://127.0.0.1:3000/incomes?email=${route.params.email}&column_name=${"None"}&category=${"All"}`);
          const incomes = await incomeResponse.json();
          const filteredIncomes = incomes.filter(income => {
            const incomeDate = new Date(income.posted_date);
            return incomeDate.getMonth() === selectedMonth && incomeDate.getFullYear() === selectedYear;
          });
          setIncomeData(processDataForChart(filteredIncomes));
    
        } catch (error) {
          console.error('Error fetching financial data:', error);
        }
      };
    
      fetchFinancialData();
    }, [route.params.email, selectedMonth, selectedYear]);

    const chartData = {
      labels: Array.from({ length: 30 }, (_, i) => i + 1)
      .filter(label => label === 1 || label % 5 === 0), // Only include days 1, 5, 10, ... 
      datasets: [
        {
          data: expenseData.slice(0, 30), 
          color: () => `rgba(255, 0, 0, 1)`, 
          strokeWidth: 7,
          fillShadowGradient: 'rgba(255, 0, 0, 0.5)', 
          fillShadowGradientOpacity: 1,
        },
        {
          data: incomeData.slice(0, 30), 
          color: () => `rgba(0, 255, 0, 1)`, 
          strokeWidth: 7, 
          fillShadowGradient: 'rgba(0, 255, 0, 0.5)', 
          fillShadowGradientOpacity: 1,
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
            {Array.from({ length: 6 }).map((_, index) => (
              <Picker.Item key={2023 - index} label={`${2023 - index}`} value={2023 - index} />
            ))}
          </Picker>
        </View>
      );
    };
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Monthly Summary</Text>
      {renderDatePickers()}
      <ScrollView style={[styles.chartContainer]}>
        {(expenseData.length > 0 || incomeData.length > 0) ? (
          <Chart
            data={chartData}
            width={350}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, 
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, 
              style: {
                borderRadius: 16,
                marginVertical: 8,
              },
              formatXLabel: (label, index) => {
                return (index === 0 || (index + 1) % 5 === 0) ? label : '';
              },
              propsForDots: {
                r: '0', 
              },
              withInnerLines: false, 
              withOuterLines: false, 
              withDots: false, 
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
      <Button
      title="Back to Dashboard"
      onPress={() => navigation.navigate('Dashboard', { email: route.params.email }) }
      color="#075985"
      style={styles.backButton}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'center',
    backgroundColor: '#075985',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30, // This creates an oval shape
    marginVertical: 20,
  },
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
    marginBottom: 0
    ,
  },
});

  export default LineChart;
