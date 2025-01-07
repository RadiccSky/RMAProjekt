import React, { useState } from "react";
import { TextInput, StyleSheet, Platform } from "react-native";

export default function LoginInput({ placeholder, value, onChangeText, secureTextEntry }) {
  const [isFocused, setIsFocused] = useState(false);

  // Combine base styles with platform-specific styles
  const inputStyle = [
    styles.input,
    isFocused && styles.inputFocused,
    Platform.OS === "web" && styles.webInput,
    isFocused && Platform.OS === "web" && styles.webInputFocused,
    isFocused && styles.inputShadow,
  ];

  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={inputStyle}
      secureTextEntry={secureTextEntry}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
}


const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderRadius: 10,
    marginBottom: 12,
    paddingLeft: 8,
    width: "80%",
    backgroundColor: "white",
    alignItems: "center",
  },
  inputFocused: {
    borderColor: "#853D72",
    backgroundColor: "#F5F5DB",
    borderWidth: 2,
  },
  webInput: {
    appearance: "none", // Removes default browser styles
    outline: "none", // Removes the blue outline on focus
    boxShadow: "0 0 0 1px #bfbfbf", // Default border-like effect for web
  },
  webInputFocused: {
    boxShadow: "0 0 0 2px #853D72", // Enhanced border effect for web
    backgroundColor: "#F5F5DB", // Match mobile behavior
  },
  inputShadow: {
    // Add shadow on focus for mobile
    ...Platform.select({
      ios: {
        shadowColor: "#853D72",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 8, // Increased elevation for more visible shadow
      },
      web: {
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Web shadow effect
      },
    }),
  },
});
