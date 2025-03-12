
import { auth, db } from "@/utils/FirebaseConfig";
import { router } from "expo-router";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { createContext, useState } from "react";
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextProps {
    handleSignUp: ( email: string, password: string, confirmPassword: string) => void;
    handleLogin: ( email: string, password: string) => void;
    signUp: () => void;
    login: () => void;
}

// Creat
export const AuthContext = createContext({} as AuthContextProps);

// Create a component for all app
export const AuthProvider = ({ children }: any) => {

    const handleSignUp = async ( email: string, password: string, confirmPassword: string) => {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Usuario autenticado:", userCredential);
            console.log("Login con", email, password);
           const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
              email: user.email,
              createdAt: new Date().toISOString(),
                });
                router.push({
                  pathname: '/dashboard',
                  params: { userId: userCredential.user.email }
              });
              console.log("Usuario autenticado:", user)
        
    };
    const handleLogin = ( email: string, password: string) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("Usuario autenticado:", user);
                router.push({
                  pathname: '/dashboard',
                  params: { userId: userCredential.user.email }
              });
              console.log("Usuario autenticado login:", user)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error("Error al autenticar:", errorCode, errorMessage);
            });
        
        
      };
      const signUp = () => {
        router.push('/signUp');
      };
      const login = () => {
        router.push('/login');
    }; 

    return <AuthContext.Provider
        value={{
            handleLogin,
            signUp,
            handleSignUp,
            login  
        }}
    >
        {children}
    </AuthContext.Provider>
}