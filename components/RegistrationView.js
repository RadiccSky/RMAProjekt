import React, { useState, useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { auth } from "../firebaseConfig";
import { AuthContext } from "../AuthContext";
import { createUserWithEmailAndPassword } from "firebase/auth";
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
    if (passw !== confirmPassw) {
      setErrorMsg("Lozinke se ne podudaraju!");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    if (!email || !passw) {
      setErrorMsg("Unesite sve podatke.");
      return;
    }

    if (!emailRegex.test(email)) {
      setErrorMsg("Unesite važeću email adresu.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, passw);
      login();
      onRegistrationSuccess();
    } catch (error) {
      console.error("Error during registration: ", error);
      setErrorMsg(error.message);
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


