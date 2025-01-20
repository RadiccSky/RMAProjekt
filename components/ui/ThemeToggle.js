import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';  // Import Ionicons for the icon
import { useTheme } from '../../ThemeContext';  // Import the useTheme hook
import { StyleSheet, View } from 'react-native';

const ThemeToggle = () => {
  const { toggleTheme, theme } = useTheme();  // Using the custom hook to get the current theme and toggle function

  return (
    <View style={styles.toggleContainer}>
      <Ionicons
        name={theme === 'dark' ? 'moon' : 'sunny'}  // Dynamically change icon based on theme state
        size={30}
        onPress={toggleTheme}  // Trigger theme toggle on press
        color="black"  // Set the color of the icon
      />
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 2, // Ensure the toggle button appears above other elements
  },
});

export default ThemeToggle;
