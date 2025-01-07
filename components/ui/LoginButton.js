import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function LoginButton({ title, onPress }) {
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
    // iOS shadow properties
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Horizontal and vertical offset
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 6, // Shadow blur radius
    // Android shadow property
    elevation: 5, // Elevation creates a shadow effect on Android
  },
  buttonText: {
    color: 'white', 
    fontSize: 16,
    textAlign: "center",
  },
});
