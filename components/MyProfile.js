import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { auth, firestore } from '../firebaseConfig'; 
import { doc, onSnapshot } from 'firebase/firestore';

export default function MyProfile() {
  const [highestScore, setHighestScore] = useState(null); 
  const [memoriTimeScore, setMemoriTimeScore] = useState(null); 
  const [loading, setLoading] = useState(true); 

 
  useEffect(() => {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid; 
      const docRef = doc(firestore, 'users', userId); 

  
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data(); 
          setHighestScore(userData.highestScore || 0);
          setMemoriTimeScore(userData.memoriTimeScore || 0); 
        } else {
          console.log('User profile not found.');
        }
        setLoading(false); 
      }, (error) => {
        console.error('Error fetching scores: ', error);
        setLoading(false); 
      });

      
      return () => unsubscribe();
    } else {
      setLoading(false); 
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Korisnički Profil</Text>
      {loading ? (
        <Text>Učitavanje...</Text> 
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