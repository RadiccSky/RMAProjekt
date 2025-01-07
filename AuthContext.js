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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = {
          email: user.email,
        };
        setUser(userData);
        setIsLoggedIn(true);
      } else {
        const rememberedEmail = await AsyncStorage.getItem("rememberedEmail");
        const rememberedPassword = await AsyncStorage.getItem("rememberedPassword");

        if (rememberedEmail && rememberedPassword) {
          try {
            await signInWithEmailAndPassword(auth, rememberedEmail, rememberedPassword);
            setIsLoggedIn(true);
          } catch (error) {
            console.error("Auto-login failed: ", error.message);
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
      console.error("Login error: ", error.message);
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
      console.error("Logout error: ", error.message);
    }
  };

  if (loading) {
    return null; // Možete dodati loading indikator ovdje
  }

  return (
    <AuthContext.Provider value={{ login, logout, isLoggedIn , user }}>
      {children}
    </AuthContext.Provider>
  );
};

