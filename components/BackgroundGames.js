
import React from 'react';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';


const { width, height } = Dimensions.get('window');

const BackgroundGames = ({ children }) => {
  return (
    <ImageBackground
      source={require('../assets/pozadinaZaIgre4.png')} 
      style={[styles.background, { width, height }]}
      resizeMode="cover"
    >
      
      <View style={styles.overlay} />
     
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
    backgroundColor: 'rgba(232, 213, 195, 0.8)',  // Bijela boja s prozirnošću
  },
});

export default BackgroundGames;
