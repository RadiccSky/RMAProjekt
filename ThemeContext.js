import React, { createContext, useState, useContext } from 'react';

// Kreiraj ThemeContext
const ThemeContext = createContext();

// ThemeProvider komponenta koja upravlja temom
export const ThemeProvider = ({ children }) => {
  // Drži trenutno stanje teme, početna tema je 'light'
  const [theme, setTheme] = useState('light');

  // Funkcija za promjenu teme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook za korištenje teme
export const useTheme = () => useContext(ThemeContext);