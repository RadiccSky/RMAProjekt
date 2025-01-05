import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RememberMe({ isChecked, setIsChecked }) {

    // Use useEffect to load the saved state from AsyncStorage
    useEffect(() => {
        const loadRememberMe = async () => {
            const value = await AsyncStorage.getItem('rememberMe');
            if (value !== null) {
                setIsChecked(JSON.parse(value));
            }
        };

        loadRememberMe();
    }, []);

    // Save the checkbox state to AsyncStorage
    const handleCheckboxChange = async () => {
        const newState = !isChecked;
        setIsChecked(newState);
        await AsyncStorage.setItem('rememberMe', JSON.stringify(newState));
    };

    return (
        <View style={styles.rememberMeContainer}>
            <TouchableOpacity
                style={[
                    styles.checkbox,
                    isChecked ? styles.checked : styles.unchecked,
                ]}
                onPress={handleCheckboxChange}
            >
                {isChecked && <Text style={styles.checkmark}>✔</Text>}
            </TouchableOpacity>
            <Text style={styles.rememberMeText}>Zapamti me</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    rememberMeContainer: {
        flexDirection: "row", // Align checkbox and text horizontally
        alignItems: "center", // Center the checkbox and text vertically
        marginBottom: 12,
        justifyContent: "flex-start", // Align everything to the left
        width: "80%", // Ensure the container takes the full width
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: "#C30E59",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
    },
    checked: {
        backgroundColor: "#C30E59",
    },
    unchecked: {
        backgroundColor: "white",
    },
    checkmark: {
        color: "white",
        fontSize: 16,
    },
    rememberMeText: {
        fontSize: 15,
        color: "#C30E59", // Add some space between the checkbox and text
    },
});




