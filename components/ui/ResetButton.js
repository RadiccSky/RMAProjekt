import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Modal, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ResetButton = ({ onReset = () => {}, buttonText = 'Resetiraj bodove' }) => {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    console.log('Modal shown'); // Kada se modal prikaže
    setVisible(true);
  };

  const hideModal = () => {
    console.log('Modal hidden'); // Kada se modal zatvori
    setVisible(false);
  };

  const handlePress = () => {
    console.log('Reset button pressed'); // Kada klikneš na "Potvrdi" u modalu
    onReset(); // Poziva funkciju za resetiranje bodova
    hideModal();
  };

  return (
    <>
      <TouchableOpacity style={styles.resetButton} onPress={showModal}>
        <Ionicons name="trash-outline" size={20} color="#c60606" style={styles.resetIcon} />
        <Text style={styles.resetButtonText}>{buttonText}</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true} // To make the background semi-transparent
        animationType="fade"
        onRequestClose={hideModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Potvrda</Text>
            <Text style={styles.modalContent}>Jeste li sigurni da želite izbrisati svoje bodove?</Text>

            <View style={styles.modalActions}>
              {/* Osigurajte da su svi tekstualni čvorovi unutar Text komponenti */}
              <TouchableOpacity style={styles.cancelButton} onPress={hideModal}>
                <Text style={styles.modalButtonText}>Odustani</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handlePress}>
                <Text style={[styles.modalButtonText, { color: '#c60606' }]}>Potvrdi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbcbd4',
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    width: '90%',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 10,
  },
  resetIcon: {
    marginRight: 10,
  },
  resetButtonText: {
    color: '#c60606',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContent: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    padding: 10,
    backgroundColor: 'red', // Red for cancel button
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  confirmButton: {
    padding: 10,
    backgroundColor: 'white', // White for confirm button
    borderRadius: 5,
    width: '40%',
    borderWidth: 1,
    borderColor: '#c60606', // Optional border for confirm button
    alignItems: 'center',
  },
  modalButtonText: {
    fontWeight: 'bold',
  },
});

export default ResetButton;

