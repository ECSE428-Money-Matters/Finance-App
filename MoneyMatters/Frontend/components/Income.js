import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Income = (props) => {

    return (
        <View style={styles.item}>
            <View style={styles.itemsLeft}>
                <Text style={styles.incomeText}>{props.desc}</Text>
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
    incomeText: {
        color: '#457B9D'
    },
    amountText: {
        color: '#0c7f00'
    }


});
export default Income;