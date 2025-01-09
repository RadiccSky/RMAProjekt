import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import GameStyle from './2048Igra/GameStyle';
import GameLogic from './2048Igra/GameLogic';

const HomePage = () => {
  const [gameVisible, setGameVisible] = useState(false); // Prikaz igre

  // Funkcija za pokretanje igre
  const startGame = () => {
    setGameVisible(true);
  };

  // Funkcija za povratak na početni ekran
  const goBackToHome = () => {
    setGameVisible(false);
  };

  const { board, score, initializeGame, handleSwipe } = GameLogic();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {!gameVisible ? (
        <View>
          <Text style={styles.welcomeText}>Dobrodošli!</Text>
          <View style={styles.gameCard}>
            <Text style={styles.gameTitle}>2048</Text>
            <Button
              title="Pokreni Igru"
              onPress={startGame}
              color="#D65076"
            />
          </View>
        </View>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <GameStyle
            board={board}
            score={score}
            initializeGame={initializeGame}
            handleSwipe={handleSwipe}
          />
          <View style={{ marginTop: 20 }}>
            <Button
              title="Nazad na Početni Ekran"
              onPress={goBackToHome}
              color="#8e44ad"
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  gameCard: {
    padding: 20,
    borderWidth: 2,
    borderColor: '#D65076',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
    elevation: 5, // Za Android sjenu
    marginBottom: 20,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});

export default HomePage;
