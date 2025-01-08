import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Games from "./Games";
import MyProfile from "./MyProfile";

const Drawer = createDrawerNavigator();

export default function DrawerComponent() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#FAF0E6', 
          width: 240,
        },
        drawerActiveTintColor: '#D65076', 
        drawerInactiveTintColor: '#8B3A62', 
        headerTitle: 'Dobrodošli',
      }}
    >
      <Drawer.Screen
        name="KorisnickiProfil"
        component={MyProfile}
        options={{ title: 'Korisnički Profil' }}
      />
      <Drawer.Screen
        name="Igrice"
        component={Games}
        options={{ title: 'Popis Igrica' }}
      />
    </Drawer.Navigator>
  );
}
