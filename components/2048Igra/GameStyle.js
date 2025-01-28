import React from 'react';
import { View, Text, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const BOARD_SIZE = 4;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const FONT_SCALE = PixelRatio.getFontScale(); // Koristi se za prilagođavanje fonta

const isMobile = SCREEN_WIDTH < 768; // Pretpostavljamo da je širina 768px ili manja mobilni uređaj

// Dinamička veličina pločica u zavisnosti od širine ekrana
const TILE_SIZE = isMobile ? SCREEN_WIDTH * 0.22 : 150; // Na mobilnom manja, na webu veća

const GameStyle = ({ board, score, handleSwipe, initializeGame }) => {
  const getTileColor = (value) => {
    switch (value) {
      case 2: return '#EEE4DA';
      case 4: return '#FFB8A9';
      case 8: return '#FF6F61';
      case 16: return '#F5D0A9';
      case 32: return '#9B1C4B';
      case 64: return '#FF3E6C';
      case 128: return '#D53F4A ';
      case 256: return '#EDCC61';
      case 512: return '#EDC850';
      case 1024: return '#EDC53F';
      case 2048: return '#EDC22E';
      default: return '#9B1C4B';
    }
  };

  const onSwipeEvent = (event) => {
    const { translationX, translationY } = event.nativeEvent;
    const dx = Math.abs(translationX);
    const dy = Math.abs(translationY);

    if (dx > dy) {
      if (translationX > 0) {
        handleSwipe('RIGHT');
      } else {
        handleSwipe('LEFT');
      }
    } else {
      if (translationY > 0) {
        handleSwipe('DOWN');
      } else {
        handleSwipe('UP');
      }
    }
  };

  const onStateChange = (event) => {
    if (event.nativeEvent.state === State.END) {
      onSwipeEvent(event);
    }
  };

  const onInitializeGame = () => {
    initializeGame();
  };

  return (
    <View style={styles.container}>
      <View style={styles.Heading}>
        <Text style={styles.title}>2048 Igrica</Text>
      </View>

      <Text style={styles.score}>Score: {score}</Text>

      <PanGestureHandler onGestureEvent={onSwipeEvent} onHandlerStateChange={onStateChange}>
        <View style={styles.board}>
          {board.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((tile, colIndex) => (
                <View
                  key={colIndex}
                  style={[styles.tile, { backgroundColor: getTileColor(tile) }]}>
                  <Text style={styles.tileText}>{tile !== 0 ? tile : ''}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </PanGestureHandler>

      <View style={styles.buttonContainer}>
        <Text onPress={onInitializeGame} style={styles.buttonText}>Započni ponovno</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    
  },
  Heading: {
    marginBottom: 5,
    marginTop: 5,
    padding: isMobile ? 10 : 20, // Dodatno povećaj razmak za web
  },
  title: {
    
    marginBottom: 10,
    color: '#F4887C',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2,
    fontSize: isMobile ? 40 * FONT_SCALE : 40 * FONT_SCALE, // Veći font za web
    fontWeight: 'bold',
    
    textAlign: 'center',
  },
  board: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.9,  
    height: SCREEN_WIDTH * 0.9, 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center', // Centriranje pločica u redu
  },
  tile: {
    left: 7,
    width: TILE_SIZE,
    height: TILE_SIZE,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    shadowColor: '#000', // Dodajte blagi sjenu
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
    
  },
  tileText: {
    fontSize: TILE_SIZE * 0.4, // Dinamičan font
    fontWeight: 'bold',
    color: '#9B1C4B',
  },
  score: {
    fontSize: 20 * FONT_SCALE,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 30,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 40,
    padding: 10,
    backgroundColor: '#9B1C4B',
    borderRadius: 5,
    width: SCREEN_WIDTH * 0.8, // Manji gumb na mobilnim uređajima
    alignItems: 'center',
  },
  buttonText: {
    fontSize: isMobile ? 20 * FONT_SCALE : 24 * FONT_SCALE, // Veći gumb na webu
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default GameStyle;
