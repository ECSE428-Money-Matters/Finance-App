import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const Category = (props) => {
    const [isSelected, setIsSelected] = useState(false);

    const handlePress = () => {
        // Toggle the selected state when the TouchableOpacity is pressed
        setIsSelected(!isSelected);
        props.onSelect(props.desc);
    };

    return (
        <View style={styles.item}>
            <View style={styles.itemsLeft}>
                <TouchableOpacity style={[styles.button, props.isSelected && styles.selectedButton]}
                                       onPress={handlePress}>
                    <Text style={styles.CategoryText}>{props.desc}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        borderRadius: 10,
        borderColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    itemsLeft: {
        maxWidth: '50%',

    },
    CategoryText: {
        color: '#457B9D',
    },button: {
        height: 35,
        width: 150,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 0,
        backgroundColor: "#FFF",
    }, selectedButton: {
        // Your selected button styles
        borderColor: '#A8DADC', // Example: change border color when selected
        borderWidth: 2,
    },


});
export default Category;