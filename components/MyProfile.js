import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth, firestore } from '../firebaseConfig'; // Ensure firebaseConfig is correctly set up
import { doc, onSnapshot } from 'firebase/firestore'; // Import necessary Firestore functions

export default function MyProfile() {
  const [highestScore, setHighestScore] = useState(null); // State to store highest score
  const [memoriTimeScore, setMemoriTimeScore] = useState(null); // State to store Memori time score
  const [loading, setLoading] = useState(true); // State to show loading indicator

  // Function to fetch scores from Firestore
  useEffect(() => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid; // Get the current user's ID
      const docRef = doc(firestore, 'users', userId); // Reference to the user's document

      // Listen for real-time updates
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data(); // Get the user's data
          setHighestScore(userData.highestScore || 0); // Save the highest score
          setMemoriTimeScore(userData.memoriTimeScore || 0); // Save the Memori time score
        } else {
          console.log('User profile not found.');
        }
        setLoading(false); // Loading finished
      }, (error) => {
        console.error('Error fetching scores: ', error);
        setLoading(false); // Loading finished
      });

      // Cleanup the listener on unmount
      return () => unsubscribe();
    } else {
      setLoading(false); // If the user is not logged in, finish loading
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Korisnički Profil</Text>
      {loading ? (
        <Text>Učitavanje...</Text> // Show loading indicator while fetching scores
      ) : (
        <>
          <Text style={styles.info}>Email: {auth.currentUser?.email}</Text>
          <Text style={styles.heading}>2048:</Text>
          <Text style={styles.info}>
            {highestScore !== null ? `Bodovi: ${highestScore}` : 'Nema postavljenih bodova.'}
          </Text>
          <Text style={styles.heading}>Memori Vrijeme:</Text>
          <Text style={styles.info}>
            {memoriTimeScore !== null ? `Vrijeme: ${memoriTimeScore} sekundi` : 'Nema postavljenih vremena.'}
          </Text>
        </>
      )}
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