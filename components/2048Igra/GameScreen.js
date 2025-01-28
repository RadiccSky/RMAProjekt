import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import GameLogic from './GameLogic'; // Import GameLogic
import GameStyle from './GameStyle'; // Import GameStyle
import BackgroundGames from '../BackgroundGames';


const GameScreen = () => {
  const { board, score, initializeGame, handleSwipe } = GameLogic(); // Ekstraktiraj funkcionalnosti iz GameLogic

  return (

    <BackgroundGames>
    <SafeAreaView style={styles.container}>
      <GameStyle
        board={board}
        score={score}
        handleSwipe={handleSwipe}
        initializeGame={initializeGame}
      />
    </SafeAreaView>
    </BackgroundGames>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GameScreen;