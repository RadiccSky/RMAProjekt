import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './AuthContext';
import Navigation from './Navigation';

export default function App() {
  return (
    <AuthProvider>
      
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
     
    </AuthProvider>
  );
}