import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, ImageBackground } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Routes } from "./Routes";

const { width, height } = Dimensions.get('window'); 

export default function MainView({ navigation }) {
  return (
    <ImageBackground 
      source={{uri: 'https://img.freepik.com/free-vector/beautiful-autumn-illustration-landscape_23-2149075029.jpg'}}
      style={styles.backgroundImage}
      resizeMode="cover" 
    >
      
      <View style={styles.overlay} />
      
      
      <LinearGradient
        colors={['#f5e8db', '#e6c3a1', '#d1a87d']}
        style={styles.gradientBackground}
      >



       
        <View style={styles.circle}>
          <TouchableOpacity 
            style={[styles.section, styles.leftTop]} 
            onPress={() => navigation.navigate(Routes.Igra2048)}
          >
            <Text style={styles.sectionText}>2048 Game</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.section, styles.leftBottom]} 
            onPress={() => navigation.navigate(Routes.Leaderboard)}
          >
            <Text style={styles.sectionText}>Leaderboard</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.section, styles.rightTop]} 
            onPress={() => navigation.navigate(Routes.MemoriGame)}
          >
            <Text style={styles.sectionText}>Memory Game</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.section, styles.rightBottom]} 
            onPress={() => navigation.navigate(Routes.MyProfile)}
          >
            <Text style={styles.sectionText}>My Profile</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const circleSize = Math.min(width, height) * 0.85; 
const sectionSize = circleSize * 0.42; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    justifyContent: 'center',
    opacity: 2.0,
  },

  
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', 
  },

 
  gradientBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    
  },

  
  circle: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    backgroundColor: "#f5e8db",
    flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    rowGap: 4,
    columnGap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10, 
  },

  section: {
    width: sectionSize,
    height: sectionSize,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },

  
  sectionText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },

  leftTop: {
    backgroundColor: 'rgba(195, 14, 89, 0.5)',
    borderTopRightRadius: sectionSize * 0.2,
    borderTopLeftRadius: sectionSize * 1.2,
    borderBottomLeftRadius: sectionSize * 0.2,
    borderBottomRightRadius: sectionSize * 0.05,
  },

  rightTop: {
    backgroundColor: 'rgba(133, 61, 114, 0.6)',
    borderTopRightRadius: sectionSize * 1.2,
    borderTopLeftRadius: sectionSize * 0.2,
    borderBottomLeftRadius: sectionSize * 0.05,
    borderBottomRightRadius: sectionSize * 0.2,
  },

  leftBottom: {
    backgroundColor: 'rgba(244, 136, 124, 0.6)',
    borderTopRightRadius: sectionSize * 0.05,
    borderTopLeftRadius: sectionSize * 0.2,
    borderBottomLeftRadius: sectionSize * 1.2,
    borderBottomRightRadius: sectionSize * 0.2,
  },

  rightBottom: {
    backgroundColor: 'rgba(232, 37, 97, 0.4)',
    borderTopRightRadius: sectionSize * 0.2,
    borderTopLeftRadius: sectionSize * 0.05,
    borderBottomLeftRadius: sectionSize * 0.2,
    borderBottomRightRadius: sectionSize * 1.2,
  },
});
