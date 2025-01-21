import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MyProfile from "./MyProfile";
import ProfilePic from "./ProfilePic";

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyProfile" component={MyProfile}   options={{ headerShown: false }} />
      <Stack.Screen name="ProfilePic" component={ProfilePic}  options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default AppNavigator;