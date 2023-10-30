import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Expense = (props) => {

    return (
        <View style={styles.item}>
            <View style={styles.itemsLeft}>
                <Text style={styles.expenseText}>{props.desc}</Text>
            </View>
            <View>
                <Text style={styles.amountText}>${props.amt}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    itemsLeft: {
        maxWidth: '80%',

    },
    expenseText: {
        color: '#457B9D'
    },
    amountText: {
        color: '#E63946'
    }


});
export default Expense;