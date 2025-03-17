    import React, { createContext, useState, useContext } from 'react';

    interface themeContextProps {
        darkMode: boolean; // Boolean to track if dark mode is enabled
        setDarkMode: (value: boolean) => void; // Function to toggle dark mode
        theme: any; // Object containing theme styles (light or dark)
    }

    // 1. Define the theme context
    export const ThemeContext = createContext({} as themeContextProps);

    // 2. Define the theme styles for light and dark modes
    const themes = {
        light: {
            background: '#FFFFFF', // Background color
            header: '#FFFFFF', // Header background color
            text: '#000000', // Main text color
            inputBackground: '#E0E0E0', // Input field background color
            inputText: '#000000', // Input field text color
            borderColor: '#CCC', // Borders and separators color
            buttonBackground: '#000000', // Button background color
            buttonText: '#FFFFFF', // Button text color
            ImageBackground: 'black' // Image tint color
        },
        dark: {
            background: '#2A2B30', 
            header: '#2A2B30',
            text: '#FFFFFF',
            inputBackground: '#444',
            inputText: '#FFFFFF',
            borderColor: '#444',
            buttonBackground: '#FFFFFF',
            buttonText: '#000000',
            ImageBackground: 'white'
        }
    };

    // 3. Create the `ThemeProvider`
    export const ThemeProvider = ({ children }: any) => {
        const [darkMode, setDarkMode] = useState(true); // Default mode is dark

        return (
            <ThemeContext.Provider
                value={{ 
                    darkMode, 
                    setDarkMode, 
                    theme: darkMode ? themes.dark : themes.light // Choose the correct theme
                }}
            >
                {children}
            </ThemeContext.Provider>
        );
    };

    // 4. Custom hook to access the theme context easily
    export const useTheme = () => useContext(ThemeContext);
