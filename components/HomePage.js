import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Games from './Games';
import MyProfile from './MyProfile';

const Drawer = createDrawerNavigator();

export default function HomePage() {
  // Funkcija za pokretanje igre (možeš je proširiti prema stvarnim funkcijama)
  const startGame = (gameName) => {
    alert(`Pokrećete igru: ${gameName}`);
  };

  return (
    <View style={styles.container}>
      {/* Drawer Navigator */}
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#FAF0E6', // Linen boja pozadine za Drawer
            width: 240,
          },
          drawerActiveTintColor: '#D65076', // Cerise za aktivne stavke
          drawerInactiveTintColor: '#8B3A62', // Plum za neaktivne stavke
          headerTitle: 'Home page',
        }}
      >
        <Drawer.Screen
          name="KorisnickiProfil"
          component={MyProfile}
          options={{ title: 'Korisnički Profil' }}
        />
        <Drawer.Screen
          name="Igrice"
          component={Games}
          options={{ title: 'Popis Igrica' }}
        />
      </Drawer.Navigator>

      {/* Sekcija za igre na homePage */}
      <View style={styles.gameContainer}>
        <Text style={styles.heading}>Igrice</Text>

        <View style={styles.gameCard}>
          <Text style={styles.gameTitle}>Igrica 1</Text>
          <Button
            title="Pokreni Igru"
            onPress={() => startGame('Igrica 1')}
            color="#D65076" // Cerise boja gumba
          />
        </View>

        <View style={styles.gameCard}>
          <Text style={styles.gameTitle}>Igrica 2</Text>
          <Button
            title="Pokreni Igru"
            onPress={() => startGame('Igrica 2')}
            color="#F6A5A5" // Coral pink boja gumba
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF0E6', // Linen boja pozadine
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B3A62', // Plum boja za naslov
    marginBottom: 20,
  },
  gameCard: {
    backgroundColor: '#F6A5A5', // Coral pink pozadina za karticu igre
    marginVertical: 10,
    padding: 20,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000', // Efekt sjene za 3D izgled
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  gameTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#D65076', // Cerise boja za naslov igre
    marginBottom: 10,
  },
});
