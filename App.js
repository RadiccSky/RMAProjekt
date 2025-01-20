import React from "react";
import { AuthProvider } from "./AuthContext";
import {ThemeProvider} from "./ThemeContext";
import Navigation from "./Navigation";


export default App = () => {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Navigation />
            </ThemeProvider>
        </AuthProvider>
    );
};
