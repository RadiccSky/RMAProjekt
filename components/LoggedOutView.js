import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoginInput from "./ui/LoginInput";
import LoginButton from "./ui/LoginButton";
import { AuthContext } from "../AuthContext";
import {supabase} from '../SupabaseClient';
import CoinyText from "./ui/CoinyText";
import PasswordInput from "./ui/PasswordInput";
import RememberMe from "./ui/RememberMe";
import ErrorMessage from "./ui/ErrorMessage";

export default function LoggedOutView({ onNavigateToRegister, onLoginSuccess }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [passw, setPassw] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  // Load remembered data if exists in AsyncStorage (but do not log in automatically)
  useEffect(() => {
    const loadRememberedData = async () => {
      const rememberedEmail = await AsyncStorage.getItem("rememberedEmail");
      const rememberedPassword = await AsyncStorage.getItem("rememberedPassword");
      const rememberedChecked = await AsyncStorage.getItem("rememberMe");

      // Only prefill credentials, but do not automatically login
      if (rememberedEmail && rememberedPassword && rememberedChecked === "true") {
        setEmail(rememberedEmail);
        setPassw(rememberedPassword);
        setIsChecked(true);
      }
    };

    loadRememberedData();
  }, []);

  // Handle user login
  const handleLogin = async () => {
    if (!email || !passw) {
      setErrorMsg("Molimo unesite email i lozinku");
      return;
    }

    try {
      
      const { user, error } = await supabase.auth.signInWithPassword({ email, password: passw });
      
      if (error) throw error;


      // Save credentials if "Remember Me" is checked
      if (isChecked) {
        await AsyncStorage.setItem("rememberedEmail", email);
        await AsyncStorage.setItem("rememberedPassword", passw);
        await AsyncStorage.setItem("rememberMe", "true");
      } else {
        await AsyncStorage.removeItem("rememberedEmail");
        await AsyncStorage.removeItem("rememberedPassword");
        await AsyncStorage.setItem("rememberMe", "false");
      }

      // Login successful, trigger context login function and navigation
      login(email,passw, isChecked);  // Calls the login function in AuthContext
      onLoginSuccess();  // Prop callback to inform successful login
    } catch (error) {
      console.error("Login error:", error.message);
      setErrorMsg("Neispravan email ili lozinka.");
    }
  };

  return (
    <View style={styles.container}>
      <CoinyText style={{ fontSize: 40, color: "#E82561", marginBottom: 20 }}>Prijava</CoinyText>
      
      <LoginInput
        placeholder="Unesite Vašu email adresu"
        value={email}
        secureTextEntry={false}
        onChangeText={(text) => setEmail(text)}  
      />
      
      <PasswordInput
        placeholder="Unesite vašu lozinku"
        value={passw}
        onChangeText={(text) => setPassw(text)}  
      />

      <RememberMe isChecked={isChecked} setIsChecked={setIsChecked} />
      
      <ErrorMessage error={errorMsg} />

      <LoginButton title="Prijava" onPress={handleLogin} />
      
      <Text style={styles.link} onPress={onNavigateToRegister}>
        Nemate račun? Registrirajte se!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  link: {
    marginTop: 20,
    color: "#C30E59",
  },
});


