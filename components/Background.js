
import React from 'react';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';

// Dohvati dimenzije ekrana
const { width, height } = Dimensions.get('window');

const Background = ({ children }) => {
  return (
    <ImageBackground
      source={require('../assets/pozadinaRoza.png')} // Tvoja slika pozadine
      style={[styles.background, { width, height }]}
      resizeMode="cover"
    >
      {/* Prekrivač za prozirnost */}
      <View style={styles.overlay} />
      {/* Ovo omogućava da se dodaju djeca unutar komponente */}
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent:"center",
  alignItems:"center",
   
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Puni ekran
    backgroundColor: 'rgba(245, 245, 220, 0.7)',  // Bijela boja s prozirnošću
  },
});

export default Background;
