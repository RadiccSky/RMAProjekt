import React from "react";
import {Text, View, StyleSheet} from "react-native";
import { Ionicons } from "react-native-vector-icons"; 

export default function ErrorMessage ({error}) {
    if (!error) return null;
    return (
        <View style={styles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={20} color="red" style={styles.icon} />
            <Text style={styles.errorText}>
                {error}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    errorContainer: {
        backgroundColor: "#ffcccc",
        borderColor: "#ffcccc",
        borderWidth: 2,
        borderRadius: 0,
        padding: 10,
        alignItems: "center",
        marginVertical: 8,
        width: "80%",
        flexDirection: "row",
    },
    errorText: {
        color: "#595959",
        fontSize: 14,
        textAlign: "center"
    },
    icon: {
        marginRight: 8, // Space between icon and text
      },
});