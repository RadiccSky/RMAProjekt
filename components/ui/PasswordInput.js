import React, { useState } from "react";
import LoginInput from "./LoginInput";  // Importiramo LoginInput
import { TouchableOpacity, StyleSheet, View, TextInput } from "react-native";
import { Ionicons } from '@expo/vector-icons';  // Za ikonu oka

export default function PasswordInput({ placeholder, value, onChangeText }) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Funkcija za prebacivanje vidljivosti lozinke
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <LoginInput
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={!isPasswordVisible}  
                />
                <TouchableOpacity
                    onPress={togglePasswordVisibility}
                    style={styles.iconContainer}
                >
                    <Ionicons
                        name={isPasswordVisible ? "eye" : "eye-off"} // Ikona oka za prikazivanje lozinke
                        size={24}
                        color="gray"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%", 
        alignItems: "center", 

    },
    inputContainer: {
        flexDirection: "row",  // Postavljanje inputa i ikone u red
        alignItems: "center", 
        justifyContent: "center", // Vertikalno centriranje unutar reda
        position: "relative",
        width: "100%",
    },
    iconContainer: {
        marginLeft: -30,  // Pomicanje ikone unutar inputa
        paddingRight: 10, 
        transform: [{ translateY: -5 }], 
    }
});
