import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const igrice = [
  { id: '1', naziv: 'Igrica 1' },
  { id: '2', naziv: 'Igrica 2' },
  { id: '3', naziv: 'Igrica 3' },
];

export default function Games() {
  return (
    <View style={styles.container}>
      <FlatList
        data={igrice}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>{item.naziv}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  item: {
    fontSize: 18,
    marginVertical: 8,
  },
});
