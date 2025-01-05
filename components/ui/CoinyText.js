import React from "react";
import {Text, View, StyleSheet} from "react-native";
import { Coiny_400Regular } from '@expo-google-fonts/coiny';
import { useFonts } from 'expo-font';

export default function CoinyText({children, style}) {
      let [fontsLoaded] = useFonts({
        Coiny_400Regular, // Register the font variant
      });
        if (!fontsLoaded) {
            return null;
        }
        return (
            <Text style={[styles.text, style]}>
                {children}
            </Text>
        );
};

const styles = StyleSheet.create({
    text: {
        fontFamily: "Coiny_400Regular",
    }
});