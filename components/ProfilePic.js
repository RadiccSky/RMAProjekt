import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../SupabaseClient';
import { AuthContext } from '../AuthContext';
import { useNavigation } from '@react-navigation/native'; 
import LoginButton from './ui/LoginButton';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';

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
  
        const profilePic = profileData?.avatar_url;
        console.log("Current profile picture URL:", profilePic);
        setCurrentProfilePic(profilePic);
  
        // Fetch files from the `default_pics` folder
        const { data: storageData, error: storageError } = await supabase.storage
          .from('avatars')
          .list('default_pics');
  
        if (storageError) {
          console.error("Error fetching storage data:", storageError.message);
          throw storageError;
        }
  
        console.log("Storage data fetched:", storageData);  // Log fetched storage data
  
        // Filter out folders (if any)
        const filteredPics = storageData.filter((item) => 
          !item.name.endsWith('/') && !item.name.startsWith('.emptyFolderPlaceholder') && (item.name.endsWith('.jpg') || item.name.endsWith('.png'))
        );
        
        console.log("Filtered images (no folders):", filteredPics);  // Log filtered images
  
        // Generate public URLs for each file
        const formattedPics = [];
        for (const file of filteredPics) {
          console.log(`Generating URL for file: ${file.name}`);
          const { data, error: urlError } = await supabase.storage
            .from('avatars')
            .getPublicUrl(`default_pics/${file.name}`);
  
          if (urlError) {
            console.error(`Error generating URL for file ${file.name}:`, urlError.message);
            continue;
          }
  
          console.log(`Generated URL for ${file.name}:`, data.publicUrl);
          formattedPics.push({
            name: file.name,
            url: data.publicUrl,
          });
        }
  
        console.log("Formatted pictures URLs:", formattedPics);  // Log formatted pictures URLs
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

      setLoading(true);
      const { error } = await supabase
        .from('users')
        .update({ avatar_url: newPic })
        .eq('user_id', user.id);

      if (error) {
        console.error("Error updating profile picture:", error.message);
        throw error;
      }

      setCurrentProfilePic(newPic);
      Alert.alert('Success', 'Profile picture updated!');
    } catch (error) {
      console.error("Error changing profile picture:", error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadAndSetProfilePic = async (uri) => {
    try {
      const base64Data = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileName = `public/${Date.now()}-profile-pic.png`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, decode(base64Data), {
          contentType: 'image/png',
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError.message);
        Alert.alert('Error', 'Failed to upload image.');
        return null;
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const newProfilePicUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: newProfilePicUrl })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating user avatar_url:', updateError.message);
        Alert.alert('Error', 'Failed to update profile picture.');
        return null;
      }

      return newProfilePicUrl;
    } catch (error) {
      console.error('Error in uploadAndSetProfilePic:', error.message);
      Alert.alert('Error', 'An unexpected error occurred.');
      return null;
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const newProfilePicUrl = await uploadAndSetProfilePic(result.assets[0].uri);
        if (newProfilePicUrl) {
          setCurrentProfilePic(newProfilePicUrl);
          Alert.alert('Success', 'Profile picture updated!');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error.message);
      Alert.alert('Error', 'An unexpected error occurred while picking the image.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const newProfilePicUrl = await uploadAndSetProfilePic(result.assets[0].uri);
        if (newProfilePicUrl) {
          setCurrentProfilePic(newProfilePicUrl);
          Alert.alert('Success', 'Profile picture updated!');
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error.message);
      Alert.alert('Error', 'An unexpected error occurred while taking the photo.');
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

      <View style={styles.currentPicContainer}>
        {currentProfilePic ? (
          <Image source={{ uri: currentProfilePic }} style={styles.currentPic} />
        ) : (
          <Text>No profile picture</Text>
        )}
      </View>

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

      <View style={styles.buttonContainer}>
        {/* Dodajte ikonu za galeriju */}
        <TouchableOpacity onPress={handlePickImage} style={styles.button}>
          <Ionicons name="image" size={20} color="white" />
          <Text style={styles.buttonText}>Odaberi iz galerije</Text>
        </TouchableOpacity>

        {/* Dodajte ikonu za fotoaparat */}
        <TouchableOpacity onPress={handleTakePhoto} style={styles.button}>
          <Ionicons name="camera" size={20} color="white" />
          <Text style={styles.buttonText}>Uslikaj</Text>
        </TouchableOpacity>
      </View>

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
    paddingTop: 50,
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
    width: '80%',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e82561',
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    marginLeft: 8, // Razmak između ikone i teksta
    color: 'white',
    fontSize: 16,
  },
});

export default ProfilePic;