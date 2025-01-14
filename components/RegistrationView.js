import React, { useState, useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { auth, firestore } from "../firebaseConfig";
import { AuthContext } from "../AuthContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import LoginInput from "./ui/LoginInput";
import LoginButton from "./ui/LoginButton";
import ErrorMessage from "./ui/ErrorMessage";
import CoinyText from "./ui/CoinyText";

export default function RegistrationView({ onNavigateToLogin, onRegistrationSuccess }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [passw, setPassw] = useState("");
  const [confirmPassw, setConfirmPassw] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegistration = async () => {
    // Provjera da li se lozinke podudaraju
    if (passw !== confirmPassw) {
      setErrorMsg("Lozinke se ne podudaraju!");
      return;
    }
    
    // Regex za provjeru ispravnog email formata
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    // Provjera da li su svi podaci uneseni
    if (!email || !passw) {
      setErrorMsg("Unesite sve podatke.");
      return;
    }

    // Provjera da li je email u ispravnom formatu
    if (!emailRegex.test(email)) {
      setErrorMsg("Unesite važeću email adresu.");
      return;
    }

    try {
      // Kreiranje korisničkog računa s emailom i lozinkom
      const userCredential = await createUserWithEmailAndPassword(auth, email, passw);
      const user = userCredential.user;

      // Create a user document in Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        email: user.email,
        scores: [],
      });

      login();  // Ažuriranje prijavljenog korisnika u kontekstu
      onRegistrationSuccess();  // Pozivanje funkcije za uspješnu registraciju
    } catch (error) {
      // Obrada grešaka koje dolaze iz Firebase-a
      console.error("Greška pri registraciji: ", error);
      if (error.code === 'auth/email-already-in-use') {
        setErrorMsg("Email je već registriran.");
      } else if (error.code === 'auth/invalid-email') {
        setErrorMsg("Unesite valjan email.");
      } else if (error.code === 'auth/weak-password') {
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