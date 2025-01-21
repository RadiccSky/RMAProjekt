import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../SupabaseClient';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native'; 
import LoginButton from './ui/LoginButton';


const ProfilePic = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [currentProfilePic, setCurrentProfilePic] = useState(null);
    const [availablePics, setAvailablePics] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigation = useNavigation(); 
  
    useEffect(() => {
      const fetchData = async () => {
        if (!user) return;
  
        try {
          setLoading(true);
          console.log("Fetching data for user:", user.id);
  
          // Fetch current profile picture
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('avatar_url')
            .eq('user_id', user.id)
            .single();
  
          if (profileError) {
            console.error("Error fetching profile data:", profileError.message);
            throw profileError;
          }
  
          console.log("Current profile data:", profileData);
  
          const profilePic = profileData?.avatar_url || 'https://ajbjhjntennljthfdhqz.supabase.co/storage/v1/object/public/avatars/DrawKit%20Vector%20Illustration%20Animal%20&%20Pets%20(2).jpg'; 
          setCurrentProfilePic(profilePic);
  
          // Fetch available pictures from storage
          const { data: storageData, error: storageError } = await supabase.storage
            .from('avatars')
            .list();
  
          if (storageError) {
            console.error("Error fetching storage data:", storageError.message);
            throw storageError;
          }
  
          console.log("Available pictures in storage:", storageData);
  
          const formattedPics = [];
          for (const file of storageData) {
            console.log(`Attempting to generate URL for file: ${file.name}`);
  
            const { data, error: urlError } = await supabase.storage
              .from('avatars')
              .getPublicUrl(file.name); // Use the actual file name here
            
            console.log("Public URL response:", data);
  
            if (urlError) {
              console.error(`Error generating URL for file ${file.name}:`, urlError.message);
              continue; // Skip this file
            }
  
            console.log(`Generated URL for ${file.name}:`, data.publicUrl);
  
            formattedPics.push({
              name: file.name,
              url: data.publicUrl, // Use the URL for each image
            });
          }
  
          console.log("Formatted available pictures:", formattedPics);
          setAvailablePics(formattedPics);
  
        } catch (error) {
          console.error("Error fetching data:", error.message);
          Alert.alert('Error', error.message);
        } finally {
          setLoading(false);
        }
      };
  
      if (user) fetchData();
    }, [user]);
  
    const handleChangeProfilePic = async (newPic) => {
      try {
        if (!user) {
          Alert.alert('Error', 'User not logged in!');
          return;
        }
  
        console.log("Changing profile picture to:", newPic);
        setLoading(true);
  
        // Update profile picture in database
        const { error } = await supabase
          .from('users')
          .update({ avatar_url: newPic })
          .eq('user_id', user.id);
  
        if (error) {
          console.error("Error updating profile picture:", error.message);
          throw error;
        }
  
        console.log("Profile picture updated to:", newPic);
        setCurrentProfilePic(newPic);
        Alert.alert('Success', 'Profile picture updated!');
      } catch (error) {
        console.error("Error changing profile picture:", error.message);
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (authLoading || loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Odaberi sliku profila</Text>
  
        {/* Current profile picture */}
        <View style={styles.currentPicContainer}>
          {currentProfilePic ? (
            <Image source={{ uri: currentProfilePic }} style={styles.currentPic} />
          ) : (
            <Text>No profile picture</Text>
          )}
        </View>
  
        {/* Available pictures */}
        <View style={styles.availablePicsContainer}>
          {availablePics.length > 0 ? (
            availablePics.map((pic) => (
              <TouchableOpacity
                key={pic.name}
                onPress={() => handleChangeProfilePic(pic.url)}
              >
                <Image source={{ uri: pic.url }} style={styles.availablePic} />
              </TouchableOpacity>
            ))
          ) : (
            <Text>No available pictures</Text>
          )}
        </View>
        {/* Save button at the bottom */}
        <LoginButton
          style={styles.saveButton}
          title="Spremi"
          onPress={() => navigation.navigate("MyProfile")}
        />

      </View>
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f0e7',
      padding: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    currentPicContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    currentPic: {
      width: 150,
      height: 150,
      borderRadius: 75,
      borderWidth: 4,
      borderColor: '#e82561',
    },
    availablePicsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
    },
    availablePic: {
      width: 80,
      height: 80,
      borderRadius: 40,
      margin: 10,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    saveButton: {
        bottom: 20,
        alignSelf: 'center',
        width: '80%', // Širina gumba
        alignItems: 'center',
      },
  });
  
  export default ProfilePic;
  