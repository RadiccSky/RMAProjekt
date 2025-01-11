import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig"; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("Auth state initialization started...");

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed:", user);

      if (user) {
        setIsLoggedIn(true);
        setUser({ email: user.email });
      } else {
        console.log("No user found, checking remembered credentials...");
        const rememberedEmail = await AsyncStorage.getItem("rememberedEmail");
        const rememberedPassword = await AsyncStorage.getItem("rememberedPassword");

        if (rememberedEmail && rememberedPassword) {
          try {
            await signInWithEmailAndPassword(auth, rememberedEmail, rememberedPassword);
            setIsLoggedIn(true);
          } catch (error) {
            console.error("Auto-login failed:", error.message);
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, passw, rememberMe) => {
    try {
      await signInWithEmailAndPassword(auth, email, passw);
      setIsLoggedIn(true);

      if (rememberMe) {
        await AsyncStorage.setItem("rememberedEmail", email);
        await AsyncStorage.setItem("rememberedPassword", passw);
      } else {
        await AsyncStorage.removeItem("rememberedEmail");
        await AsyncStorage.removeItem("rememberedPassword");
      }
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setUser(null); 
      await AsyncStorage.removeItem("rememberedEmail");
      await AsyncStorage.removeItem("rememberedPassword");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  if (loading) {
    console.log("Loading authentication state..."); // Debugging log
    return null; // Dodaj loader ovdje ako želiš
  }

  return (
    <AuthContext.Provider value={{ login, logout, isLoggedIn, user }}>
      {children}
    </AuthContext.Provider>
  );
};
