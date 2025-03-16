import React, { createContext, useState, useContext } from 'react';
interface themeContextProps {
    darkMode: boolean;
    setDarkMode: (value: boolean) => void;
    theme: any;
}

// 1. Definimos el contexto
export const ThemeContext = createContext({} as themeContextProps);

// 2. Definimos los temas
const themes = {
    light: {
        background: '#FFFFFF',
        header: '#FFFFFF',
        text: '#000000',
        inputBackground: '#E0E0E0',
        inputText: '#000000',
        borderColor: '#CCC',
        buttonBackground: '#000000',
        buttonText: '#FFFFFF',
        ImageBackground: 'black'
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

// 3. Creamos el `ThemeProvider`
export const ThemeProvider = ( { children }: any) => {
    const [darkMode, setDarkMode] = useState(true);

    return (
        <ThemeContext.Provider
        value={{ 
            darkMode, 
            setDarkMode, 
            theme: darkMode ? themes.dark : themes.light}}>
            {children}
        </ThemeContext.Provider>
    );
};

// 4. Hook personalizado para usar el tema
export const useTheme = () => useContext(ThemeContext);
