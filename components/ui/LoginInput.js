import React, { useState } from "react";
import { TextInput, StyleSheet, Platform } from "react-native";

export default function LoginInput({ placeholder, value, onChangeText }) {
  const [isFocused, setIsFocused] = useState(false);

  // Combine base styles with platform-specific styles
  const inputStyle = [
    styles.input,
    isFocused && styles.inputFocused,
    Platform.OS === "web" && styles.webInput,
    isFocused && Platform.OS === "web" && styles.webInputFocused,
  ];

  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={inputStyle}
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
    justifyContent: "center",
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
});


