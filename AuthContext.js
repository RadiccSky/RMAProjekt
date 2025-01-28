import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./SupabaseClient"; // Importiraj Supabase klijent

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        console.log("Provjera trenutne sesije...");
        const { data: session, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Greška prilikom dohvaćanja sesije:", error.message);
          setIsLoggedIn(false);
          return;
        }

        console.log("Dohvaćena sesija:", session);

        if (session?.user) {
          console.log("Sesija pronađena, postavljanje korisnika.");
          setIsLoggedIn(true);
          setUser(session.user);
          await setCurrentUserId(session.user.id);
        } else {
          console.log("Sesija nije pronađena, provjera AsyncStorage...");
          const rememberedEmail = await AsyncStorage.getItem("rememberedEmail");
          const rememberedPassword = await AsyncStorage.getItem("rememberedPassword");

          if (rememberedEmail && rememberedPassword) {
            console.log("Pokušaj automatske prijave s pohranjenim vjerodajnicama...");
            const { data, error } = await supabase.auth.signInWithPassword({
              email: rememberedEmail,
              password: rememberedPassword,
            });

            if (error) {
              console.error("Auto-login greška:", error.message);
              setIsLoggedIn(false);
              return;
            }

            console.log("Automatska prijava uspješna:", data.user);
            setIsLoggedIn(true);
            setUser(data.user);
            await setCurrentUserId(data.user.id); 
          } else {
            console.log("Nema pohranjenih vjerodajnica.");
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error("Greška prilikom provjere sesije:", error.message);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  const setCurrentUserId = async (userId) => {
    try {
      // Postavi korisnički ID u sesiji
      const { error } = await supabase.rpc('set_current_user_id', { user_id: userId });
      if (error) {
        console.error("Greška prilikom postavljanja korisničkog ID-a:", error.message);
      }
    } catch (error) {
      console.error("Greška prilikom dohvaćanja korisničkog ID-a:", error.message);
    }
  };

  const login = async (email, passw, rememberMe) => {
    try {
      console.log("Pokušaj prijave s e-mailom:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: passw,
      });

      if (error) {
        console.error("Greška prilikom prijave:", error.message);
        throw error;
      }

      if (!data?.user) {
        console.error("Prijava neuspješna: Korisnik nije vraćen.");
        throw new Error("Prijava neuspješna: Korisnik nije vraćen.");
      }

      console.log("Prijava uspješna:", data.user);
      setIsLoggedIn(true);
      setUser(data.user);
      await setCurrentUserId(data.user.id); 

      if (rememberMe) {
        console.log("Pohranjivanje vjerodajnica u AsyncStorage.");
        await AsyncStorage.setItem("rememberedEmail", email);
        await AsyncStorage.setItem("rememberedPassword", passw);
      } else {
        console.log("Brisanje pohranjenih vjerodajnica iz AsyncStorage.");
        await AsyncStorage.removeItem("rememberedEmail");
        await AsyncStorage.removeItem("rememberedPassword");
      }
    } catch (error) {
      console.error("Greška prilikom prijave:", error.message);
    }
  };

  const logout = async () => {
    try {
      console.log("Pokušaj odjave...");
      await supabase.auth.signOut();
      console.log("Odjava uspješna.");
      setIsLoggedIn(false);
      setUser(null);

      console.log("Brisanje pohranjenih vjerodajnica iz AsyncStorage.");
      await AsyncStorage.removeItem("rememberedEmail");
      await AsyncStorage.removeItem("rememberedPassword");
    } catch (error) {
      console.error("Greška prilikom odjave:", error.message);
    }
  };

  if (loading) return null; // Prikaz loadera dok se provjerava sesija

  return (
    <AuthContext.Provider value={{ login, logout, isLoggedIn, user }}>
      {children}
    </AuthContext.Provider>
  );
};
