import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoggedOutView from "./components/LoggedOutView";
import LoggedInView from "./components/LoggedInView";
import RegistrationView from "./components/RegistrationView";
import HomePage from "./components/HomePage";
import { Routes } from "./components/Routes";


const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={Routes.LoggedOutView}>
        <Stack.Screen name={Routes.LoggedOutView}
        options={{ title: "Prijava" }}
        >
          {({ navigation }) => (
            <LoggedOutView
              onNavigateToRegister={() => navigation.navigate(Routes.RegistrationView)}
              onLoginSuccess={() => navigation.navigate(Routes.HomePage)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name={Routes.RegistrationView}
        options={{ title: "Registracija" }}>
          {({ navigation }) => (
            <RegistrationView
              onNavigateToLogin={() => navigation.navigate(Routes.LoggedOutView)}
              onRegistrationSuccess={() => navigation.navigate(Routes.LoggedInView)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name={Routes.LoggedInView}
        options={{ title: "Dobrodošli na sustav" }}>
          {({ navigation }) => (
            <LoggedInView onLogout={() => navigation.navigate(Routes.LoggedOutView)} />
          )}
        </Stack.Screen>
        <Stack.Screen name={Routes.HomePage}
         options={{title: "Profil"}}>
          {({navigation }) => 
            <HomePage  />
          }
</Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}






