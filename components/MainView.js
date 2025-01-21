<<<<<<< HEAD
import React, { useContext } from "react";

import { View, Button, StyleSheet , TouchableOpacity, Text, Dimensions } from "react-native";
import HomePage from "./HomePage";
import MyProfile from "./MyProfile";
import Leaderboard from "./Leaderboard";
import { AuthContext } from "../AuthContext";
import { Routes } from "./Routes";
import { LinearGradient } from 'expo-linear-gradient'; 

const { width, height } = Dimensions.get('window'); 

export default function MainView({ navigation }) {
  return (
    <LinearGradient
      colors={['#f5e8db', '#e6c3a1', '#d1a87d']} 
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <View style={styles.circle}>
          <TouchableOpacity 
            style={[styles.section, styles.leftTop]} 
            onPress={() => navigation.navigate(Routes.MyProfile)}
          >
            <Text style={styles.sectionText}>My Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.section, styles.leftBottom]} 
            onPress={() => navigation.navigate(Routes.Leaderboard)}
          >
            <Text style={styles.sectionText}>Leaderboard</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.section, styles.rightTop]} 
            onPress={() => navigation.navigate(Routes.MemoriGame)}
          >
            <Text style={styles.sectionText}>Memory Game</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.section, styles.rightBottom]} 
            onPress={() => navigation.navigate(Routes.Igra2048)}
          >
            <Text style={styles.sectionText}>2048 Game</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
=======
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
>>>>>>> ivana
  );
}

const circleSize = Math.min(width, height) * 0.6; // 60% manje dimenzije ekrana
const sectionSize = circleSize * 0.40; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    
  },
<<<<<<< HEAD

  gradientBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  circle: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    backgroundColor: "#f5e8db",
    flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    rowGap: 3,
    columnGap: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10, 
  },

  section: {
    width: sectionSize,
    height: sectionSize,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  sectionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },

  leftTop: {
    backgroundColor: 'rgba(195, 14, 89, 0.5)',
    borderTopRightRadius: sectionSize * 0.2,
    borderTopLeftRadius: sectionSize * 1.2,
    borderBottomLeftRadius: sectionSize * 0.2,
    borderBottomRightRadius: sectionSize * 0.05,
  },

  rightTop: {
    backgroundColor: 'rgba(133, 61, 114, 0.6)',
    borderTopRightRadius: sectionSize * 1.2,
    borderTopLeftRadius: sectionSize * 0.2,
    borderBottomLeftRadius: sectionSize * 0.05,
    borderBottomRightRadius: sectionSize * 0.2,
  },

  leftBottom: {
    backgroundColor: 'rgba(244, 136, 124, 0.6)',
    borderTopRightRadius: sectionSize * 0.05,
    borderTopLeftRadius: sectionSize * 0.2,
    borderBottomLeftRadius: sectionSize * 1.2,
    borderBottomRightRadius: sectionSize * 0.2,
  },

  rightBottom: {
    backgroundColor: 'rgba(232, 37, 97, 0.5)',
    borderTopRightRadius: sectionSize * 0.2,
    borderTopLeftRadius: sectionSize * 0.05,
    borderBottomLeftRadius: sectionSize * 0.2,
    borderBottomRightRadius: sectionSize * 1.2,
  },
});
=======
});

>>>>>>> ivana
