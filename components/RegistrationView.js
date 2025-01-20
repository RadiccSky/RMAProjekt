import React, { useState, useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { supabase } from "../SupabaseClient";
import { AuthContext } from "../AuthContext";
import LoginInput from "./ui/LoginInput";
import LoginButton from "./ui/LoginButton";
import ErrorMessage from "./ui/ErrorMessage";
import CoinyText from "./ui/CoinyText";

export default function RegistrationView({ onNavigateToLogin, onRegistrationSuccess }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [passw, setPassw] = useState("");
  const [confirmPassw, setConfirmPassw] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegistration = async () => {
    if (passw !== confirmPassw) {
      setErrorMsg("Lozinke se ne podudaraju!");
      return;
    }
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    if (!email || !passw || !name) {
      setErrorMsg("Unesite sve podatke.");
      return;
    }
  
    if (!emailRegex.test(email)) {
      setErrorMsg("Unesite važeću email adresu.");
      return;
    }
  
    try {
      // Kreiranje korisnika
      const { data: user, error } = await supabase.auth.signUp({
        email: email,
        password: passw,
      });
  
      if (error) throw error;
  
      if (!user) {
        throw new Error("Neuspješna registracija, korisnik nije vraćen.");
      }
  
      // Dodavanje korisničkih podataka u "users" tabelu
      const { error: dbError } = await supabase
        .from("users")
        .insert([
          {
            email: email,
            name: name,
            user_id: user.user.id, // Korisnički ID iz Supabase-a
          },
        ]);
  
      if (dbError) throw dbError;
  
      // Automatska prijava korisnika nakon registracije
      await login(email, passw, false);
      onRegistrationSuccess();
  
    } catch (error) {
      console.error("Greška pri registraciji:", error.message);
  
      // Obrada grešaka
      if (error.message.includes("duplicate key value violates unique constraint")) {
        setErrorMsg("Email je već registriran.");
      } else if (error.message.includes("invalid email")) {
        setErrorMsg("Unesite važeću email adresu.");
      } else if (error.message.includes("password is too weak")) {
        setErrorMsg("Lozinka je preslaba, odaberite jaču lozinku.");
      } else {
        setErrorMsg("Došlo je do pogreške, pokušajte ponovno.");
      }
    }
  };
  

  return (
    <View style={styles.container}>
      <CoinyText style={{ fontSize: 40, color: "#E82561", marginBottom: 20 }}>
        Registracija
      </CoinyText>

      <LoginInput
        placeholder="Unesite ime"
        value={name}
        onChangeText={setName}
      />

      <LoginInput placeholder="Unesite email" value={email} onChangeText={setEmail} />

      <LoginInput
        placeholder="Unesite lozinku"
        value={passw}
        onChangeText={setPassw}
        secureTextEntry
      />

      <LoginInput
        placeholder="Potvrdite lozinku"
        value={confirmPassw}
        onChangeText={setConfirmPassw}
        secureTextEntry
      />

      <ErrorMessage error={errorMsg} />

      <LoginButton title="Registriraj se" onPress={handleRegistration} />

      <Text style={styles.link} onPress={onNavigateToLogin}>
        Već imate račun? Prijavite se!
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
