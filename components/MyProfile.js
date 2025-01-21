import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { supabase } from '../SupabaseClient';
import { AuthContext } from "../AuthContext";
import { useNavigation } from '@react-navigation/native'; 
import Ionicons from 'react-native-vector-icons/Ionicons';
import ResetButton from './ui/ResetButton';
import ThemeToggle from './ui/ThemeToggle';
import NameWithEdit from './ui/NameWithEdit';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function MyProfile() {
  const [highestScore, setHighestScore] = useState(null); 
  const [memoriTimeScore, setMemoriTimeScore] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [imageUrl, setImageUrl] = useState(null); 
  const [name, setName] = useState('');

  const { logout } = useContext(AuthContext);
  const navigation = useNavigation(); 

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
  
      const { data, error: userError } = await supabase.auth.getUser();
      const user = data?.user;
  
      console.log('User data:', user);
      if (userError || !user || !user.id) {
        console.error('User not logged in or error fetching user');
        setLoading(false);
        return;
      }
  
      try {
        const { data: scoreData, error: scoreError } = await supabase
          .from('game_scores')
          .select('score_2048, score_memori')
          .eq('user_id', user.id);
  
        if (scoreError) {
          console.error('Error fetching scores:', scoreError.message);
          setLoading(false);
          return;
        }
  
        if (!scoreData || scoreData.length === 0) {
          setHighestScore(0);
          setMemoriTimeScore(0);
        } else {
          setHighestScore(scoreData[0].score_2048 || 0);
          setMemoriTimeScore(scoreData[0].score_memori || 0);
        }
  
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('avatar_url, name')
          .eq('user_id', user.id)
          .single(); // Prikazuje samo jedan red
  
        if (profileError) {
          console.error('Error fetching profile image:', profileError.message);
        } else {
          console.log('Profile data:', profileData);
          // Provjeri je li avatar_url prazan, ako jest, postavi zadanu sliku
          const defaultAvatarUrl = 'https://ajbjhjntennljthfdhqz.supabase.co/storage/v1/object/public/avatars/DrawKit%20Vector%20Illustration%20Animal%20&%20Pets%20(2).jpg'; // zamijeni s URL-om tvoje zadane slike
          setImageUrl(profileData?.avatar_url || defaultAvatarUrl); 
          setName(profileData?.name || 'No name available');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  
  const resetScores = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (user) {
        await supabase
          .from('game_scores')
          .update({ score_2048: 0, score_memori: 0 })
          .eq('user_id', user.id);
        setHighestScore(0);
        setMemoriTimeScore(0);
        console.log('Scores reset!');
      }
    } catch (error) {
      console.error('Error resetting scores:', error.message);
    }
  };

  const handleNameUpdate = async (updatedName) => {
    try {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      console.log('User object:', user);  // Dodajemo logiranje korisnika
      console.log('Auth UID:', user?.id);
      
      if (user) {
        await supabase
          .from('users')
          .update({ name: updatedName })
          .eq('user_id', user.id);
        console.log('Update successful:', data);
        setName(updatedName); 
        console.log('Name updated!');
      }
    } catch (error) {
      console.error('Error updating name:', error.message);
    }
  };

  const handleEditAvatar = () => {
    navigation.navigate("ProfilePic");
  };

  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <Text style={styles.heading}>Korisnički Profil</Text>
        <ThemeToggle />  
      

      <View style={styles.lowerContainer}>
        <View style={styles.profileCircle}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.profileImage} />
          ) : (
            <MaterialIcons name="photo" size={50} color="white" />
          )}

          <TouchableOpacity
            style={styles.iconContainer}
            onPress={handleEditAvatar}
          >
            <MaterialIcons name="photo-camera" size={30} color="grey"  />
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text>Učitavanje...</Text> 
        ) : (
          
            <NameWithEdit
              initialName={name || 'No name available'}
              onNameUpdate={handleNameUpdate}
            />
          
        )}

        <View style={styles.gameInfoContainer}>
          <View style={styles.gameRow}>
            <Text style={styles.gameItem}>2048</Text>
            <Text style={[styles.gameItem, styles.withBorder]}>
              {highestScore !== null ? `Highscore: ${highestScore}` : 'Nema postavljenih bodova.'}
            </Text>
            <Text style={styles.gameItem}>Leaderboard</Text>
          </View>
          <ResetButton onReset={resetScores} />
        </View>

        <View style={styles.gameInfoContainer}>
          <View style={styles.gameRow}>
            <Text style={styles.gameItem}>Memori</Text>
            <Text style={[styles.gameItem, styles.withBorder]}>
              {memoriTimeScore !== null ? `Vrijeme: ${memoriTimeScore}s` : 'Nema postavljenih vremena.'}
            </Text>
            <Text style={styles.gameItem}>Leaderboard</Text>
          </View>
          <ResetButton onReset={resetScores} />
        </View>

        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color="#c60606" style={styles.icon} />
            <Text style={styles.logoutButtonText}>Odjava</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  upperContainer: {
    paddingTop: 50,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f7aaa1',
    padding: 10,
    position: 'relative',
    zIndex: 1,
  },
  lowerContainer: {
    height: '80%',
    width: '100%',
    backgroundColor: '#f8f0e7',
    padding: 20,
    justifyContent: 'flex-start',
    zIndex: 2,
    position: 'relative',
    alignItems: 'center',
    borderRadius: 20,
    bottom: 0,
  },
  profileCircle: {
    position: 'absolute',
    top: -60,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'red',
    zIndex: 2,
    borderWidth: 7,
    borderColor: 'white',
    marginBottom: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  iconContainer: {
    position: 'absolute',
    bottom: -10,
    left: -10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    elevation: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  gameInfoContainer: {
    backgroundColor: "#c30e59",
    width: '100%',
    margin: 10,
    borderRadius: 20,
    flexDirection: 'column',
    height: "15%",
    alignItems: 'center',
  },
  gameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  gameItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
    textAlign: 'center',
    color: 'white',
  },
  withBorder: {
    borderRightWidth: 2,
    borderRightColor: 'white', // Boja linije
    borderLeftWidth: 2,
    borderLeftColor: 'white',
  },
  logoutContainer: {
    marginTop: 10,
    alignItems: 'center',
    width: '100%',
    height: "20%",
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f0e7',
    borderWidth: 1,
    borderColor: '#c60606',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '90%',
    justifyContent: 'center',
    elevation:10,
  },
  logoutButtonText: {
    color: '#c60606',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
});