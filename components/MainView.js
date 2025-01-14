import React, { useContext } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Button, StyleSheet } from "react-native";
import HomePage from "./HomePage";
import MyProfile from "./MyProfile";
import Games from "./Games";
import { AuthContext } from "../AuthContext"; // Import AuthContext

const Drawer = createDrawerNavigator();

const LogoutButton = () => {
  const { logout } = useContext(AuthContext); // Access logout function

  return (
    <View style={styles.buttonContainer}>
      <Button title="Logout" onPress={logout} color="#D65076" />
    </View>
  );
};

export default function MainView() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#FAF0E6",
          width: 240,
        },
        drawerActiveTintColor: "#D65076",
        drawerInactiveTintColor: "#8B3A62",
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomePage}
        options={{ title: "Home Page" }}
      />
      <Drawer.Screen
        name="Profile"
        component={MyProfile}
        options={{ title: "My Profile" }}
      />
      <Drawer.Screen
        name="Games"
        component={Games}
        options={{ title: "Games" }}
      />
      <Drawer.Screen
        name="Logout"
        component={LogoutButton}
        options={{ title: "Logout" }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});