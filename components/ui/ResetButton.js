import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Modal, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ResetButton = ({ onReset = () => {}, buttonText = 'Resetiraj bodove' }) => {
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const handlePress = () => {
    // Call the onReset function and hide the modal
    onReset();
    hideModal();
  };

  return (
    <>
      <TouchableOpacity style={styles.resetButton} onPress={showModal}>
        <Ionicons name="trash-outline" size={20} color="red" style={styles.resetIcon} />
        <Text style={styles.resetButtonText}>{buttonText}</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true} // To make the background semi-transparent
        animationType="fade"
        onRequestClose={hideModal} // Optionally handle back button press
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Potvrda</Text>
            <Text style={styles.modalContent}>Jeste li sigurni da želite izbrisati svoje bodove?</Text>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButton} onPress={hideModal}>
                <Text style={styles.modalButtonText}>Odustani</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handlePress}>
                <Text style={styles.modalButtonText}>Potvrdi</Text>
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
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'red',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    width: '90%',
    justifyContent: 'center',
    marginTop: 10,
  },
  resetIcon: {
    marginRight: 10,
  },
  resetButtonText: {
    color: 'red',
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
  modalButton: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ResetButton;
