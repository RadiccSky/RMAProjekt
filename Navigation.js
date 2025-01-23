import React, { useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoggedOutView from "./components/LoggedOutView";
import RegistrationView from "./components/RegistrationView";
import MainView from "./components/MainView"; 
import { Routes } from "./components/Routes";
import { AuthContext } from "./AuthContext";
import MyProfile from "./components/MyProfile";
import ProfilePic from "./components/ProfilePic";
import MemoriGame from "./components/Memori/Memori";
import GameScreen from "./components/2048Igra/GameScreen";
import LeaderBoard from "./components/Leaderboard";

const Stack = createStackNavigator();

export default function Navigation() {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) {
    return null; 
  }

  return (
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
        <>
         
          <Stack.Screen name={Routes.MainView} component={MainView} />
          <Stack.Screen name={Routes.MyProfile} component={MyProfile} />
          <Stack.Screen name={Routes.ProfilePic} component={ProfilePic} />
          <Stack.Screen name={Routes.MemoriGame} component={MemoriGame} />
          <Stack.Screen name={Routes.Igra2048} component={GameScreen} />
          <Stack.Screen name={Routes.Leaderboard} component={LeaderBoard} />
        </>
      )}
    </Stack.Navigator>
  );
}