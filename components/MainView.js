import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StyleSheet } from "react-native";
import HomePage from "./HomePage";
import Games from "./Games";
import AppNavigator from "./AppNavigator";

const Drawer = createDrawerNavigator();


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
        component={AppNavigator} // Use AppNavigator to handle MyProfile and ProfilePic
        options={{ title: "My Profile" }}
      />
      <Drawer.Screen
        name="Games"
        component={Games}
        options={{ title: "Games" }}
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

