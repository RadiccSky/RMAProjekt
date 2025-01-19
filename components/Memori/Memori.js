import React, { useState, useEffect } from 'react';
import {
  View, Text, Button, StyleSheet,
  TouchableOpacity, Animated, Easing
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { doc, setDoc } from "firebase/firestore";
import { firestore, auth } from '../../firebaseConfig'; // Ensure firebaseConfig is correctly set up

const randomArrFunction = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const gameCardsFunction = () => {
  const icons = [
    'paw', 'paw', 'heart', 'heart', 'tree', 'tree',
    'star', 'star', 'bell', 'bell', 'gift', 'gift'
  ];
  return randomArrFunction(icons).map((icon, index) => ({
    id: index,
    symbol: icon,
    isFlipped: false,
  }));
};

const Memori = () => {
  const [cards, setCards] = useState(gameCardsFunction());
  const [selectedCards, setSelectedCards] = useState([]);
  const [matches, setMatches] = useState(0);
  const [winMessage, setWinMessage] = useState(new Animated.Value(0));
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(0);  
  const [intervalId, setIntervalId] = useState(null); 

  const cardClickFunction = (card) => {
    if (!gameWon && selectedCards.length < 2 && !card.isFlipped) {
      const updatedSelectedCards = [...selectedCards, card];
      const updatedCards = cards.map((c) =>
        c.id === card.id ? { ...c, isFlipped: true } : c
      );
      setSelectedCards(updatedSelectedCards);
      setCards(updatedCards);
      if (updatedSelectedCards.length === 2) {
        if (updatedSelectedCards[0].symbol === updatedSelectedCards[1].symbol) {
          setMatches(matches + 1);
          setSelectedCards([]);
          if (matches + 1 === cards.length / 2) {
            geekWinGameFunction();
            setGameWon(true);
            clearInterval(intervalId); 
            saveTimeScore(timer); 
          }
        } else {
          setTimeout(() => {
            const flippedCards = updatedCards.map((c) =>
              updatedSelectedCards.some((s) => s.id === c.id) ? { ...c, isFlipped: false } : c
            );
            setSelectedCards([]);
            setCards(flippedCards);
          }, 1000);
        }
      }
    }
  };

  const geekWinGameFunction = () => {
    Animated.timing(winMessage, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  };

  const saveTimeScore = async (timeScore) => {
    try {
      const userId = auth.currentUser.uid; 
      const docRef = doc(firestore, "users", userId); 

    
      await setDoc(docRef, { memoriTimeScore: timeScore }, { merge: true });
      console.log("Time score saved to Firestore.");
    } catch (error) {
      console.error("Error saving time score: ", error);
    }
  };

  useEffect(() => {
    if (matches === cards.length / 2) {
      geekWinGameFunction();
      setGameWon(true);
      clearInterval(intervalId); 
    }
  }, [matches]);

  useEffect(() => {
    if (!gameWon) {
      const id = setInterval(() => {
        setTimer(prevTime => prevTime + 1); 
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id); 
    }
  }, [gameWon]);

  const msg = `Matches: ${matches} / ${cards.length / 2}`;
  const formattedTime = `${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' + timer % 60 : timer % 60}`;

  return (
    <View style={styles.container}>
      <Text style={styles.header1}>Memori</Text>
      
      {/* Display these only if the game is not won */}
      {!gameWon && (
        <>
          <Text style={styles.matchText}>{msg}</Text>
          <Text style={styles.timerText}>Time: {formattedTime}</Text>
        </>
      )}

      {gameWon ? (
        <View style={styles.winMessage}>
          <View style={styles.winMessageContent}>
            <Text style={styles.winText}>Bravo!</Text>
            <Text style={styles.winText}>Potrebno Vrijeme: {formattedTime}</Text>
          </View>
          <Button
            title="Restart"
            onPress={() => {
              setCards(gameCardsFunction());
              setSelectedCards([]);
              setMatches(0);
              setWinMessage(new Animated.Value(0));
              setGameWon(false);
              setTimer(0); // Reset timer
            }}
          />
        </View>
      ) : (
        <View style={styles.grid}>
          {cards.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.card, card.isFlipped && styles.cardFlipped]}
              onPress={() => cardClickFunction(card)}
            >
              {card.isFlipped ? (
                <Icon name={card.symbol} size={40} style={styles.cardIcon} />
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  header1: {
    fontSize: 36,
    marginBottom: 10,
    color: 'green',
  },
  matchText: {
    fontSize: 18,
    color: 'black',
  },
  timerText: {
    fontSize: 18,
    marginTop: 10,
    color: 'black',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: 80,
    height: 80,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  cardFlipped: {
    backgroundColor: 'white',
  },
  cardIcon: {
    color: 'blue',
  },
  winMessage: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  winMessageContent: {
    backgroundColor: 'rgba(255, 215, 0, 0.7)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  winText: {
    fontSize: 36,
    color: 'white',
  },
});

export default Memori;