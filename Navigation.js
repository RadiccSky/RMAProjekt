import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoggedOutView from "./components/LoggedOutView";
import RegistrationView from "./components/RegistrationView";
import MainView from "./components/MainView"; // Ensure this import is correct
import { Routes } from "./components/Routes";
import { AuthContext } from "./AuthContext";

const Stack = createStackNavigator();

export default function Navigation() {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) {
    return null; // You can add a loader here
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isLoggedIn ? Routes.MainView : Routes.LoggedOutView}
        screenOptions={{ headerShown: false }}
      >
        {!isLoggedIn ? (
          <>
            <Stack.Screen name={Routes.LoggedOutView}>
              {({ navigation }) => (
                <LoggedOutView
                  onNavigateToRegister={() =>
                    navigation.navigate(Routes.RegistrationView)
                  }
                  onLoginSuccess={() => navigation.navigate(Routes.MainView)}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name={Routes.RegistrationView}>
              {({ navigation }) => (
                <RegistrationView
                  onNavigateToLogin={() =>
                    navigation.navigate(Routes.LoggedOutView)
                  }
                  onRegistrationSuccess={() =>
                    navigation.navigate(Routes.MainView)
                  }
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen name={Routes.MainView} component={MainView} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}