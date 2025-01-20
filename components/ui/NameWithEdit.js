import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const NameWithEdit = ({ initialName = '', onNameUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);

  const handleSave = () => {
    setIsEditing(false); // Exit editing mode
    if (onNameUpdate) onNameUpdate(name); // Call the callback function if provided
  };

  return (
    <View style={styles.container}>
      {isEditing ? (
        <TextInput
          style={styles.nameInput}
          value={name}
          onChangeText={setName} // Update email state as the user types
          placeholder="Uredite ime"
          autoFocus
        />
      ) : (
        <Text style={styles.nameText}>{name}</Text>
      )}
      <TouchableOpacity
        onPress={isEditing ? handleSave : () => setIsEditing(true)} // Toggle between editing and saving
        style={styles.editButton}
      >
        <MaterialIcons
          name={isEditing ? 'check' : 'edit'} // Show 'check' icon while editing, 'edit' icon otherwise
          size={24}
          color="grey"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    height: '15%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'lightgray',
    borderRadius: 10,
    marginTop: 50,
  },
  nameText: {
    fontSize: 16,
    color: 'black',
    flex: 1,
  },
  nameInput: {
    fontSize: 16,
    color: 'black',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingVertical: 5,
  },
  editButton: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NameWithEdit;

