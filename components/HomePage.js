import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';


export default function HomePage() {
  
  const startGame = (gameName) => {
    alert(`Pokrećete igru: ${gameName}`);
  };

  return (
      
    <View style={styles.container}>
      {/* Sekcija za igre na homePage */}
      <View style={styles.gameContainer}>
        <Text style={styles.heading}>Igrice</Text>

        <View style={styles.gameCard}>
          <Text style={styles.gameTitle}>Igrica 1</Text>
          <Button
            title="Pokreni Igru"
            onPress={() => startGame('Igrica 1')}
            color="#D65076" 
          />
        </View>

        <View style={styles.gameCard}>
          <Text style={styles.gameTitle}>Igrica 2</Text>
          <Button
            title="Pokreni Igru"
            onPress={() => startGame('Igrica 2')}
            color="#F6A5A5" 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF0E6', 
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
    color: '#8B3A62', 
    marginBottom: 20,
  },
  gameCard: {
    backgroundColor: '#F6A5A5', 
    marginVertical: 10,
    padding: 20,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  gameTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#D65076', 
    marginBottom: 10,
  },
});
