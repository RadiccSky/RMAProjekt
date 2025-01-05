import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function LoginButton ({title, onPress}) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 10,
        backgroundColor: "#F4887C",
        borderColor: "#F4887C",
        borderWidth: 1,
        borderRadius: 10,
        width: "80%",
        marginBottom: 10,
    },
    buttonText: {
        color: 'white', 
        fontSize: 16,
        textAlign: "center"
    },
});