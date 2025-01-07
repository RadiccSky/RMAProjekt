import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MyProfile() {
  const korisnik = {
    ime: 'Anđela Marinović',
    email: 'andjela.marinovic@example.com',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Korisnički Profil</Text>
      <Text style={styles.info}>Ime: {korisnik.ime}</Text>
      <Text style={styles.info}>Email: {korisnik.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
});
