import { createContext, useContext, useState } from "react";
import { auth, db } from "@/utils/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface ValidationContextProps {
    validateEmail: (email: string) => boolean;
    validatePassword: (password: string) => boolean;
    validateLogin: (email: string, password: string) => Promise<boolean>;
    errorMessage: string | null;
    setErrorMessage: (message: string | null) => void;
}

export const ValidationContext = createContext({} as ValidationContextProps);

export const ValidationProvider = ({ children }: any) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // 🔹 Validar Formato de Correo
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setErrorMessage("Correo inválido. Usa un formato válido.");
            return false;
        }
        return true;
    };

    // 🔹 Validar Contraseña (mínimo 8 caracteres)
    const validatePassword = (password: string): boolean => {
        if (password.length < 8) {
            setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
            return false;
        }
        return true;
    };

    // 🔹 Validar si el usuario existe en Firebase antes de hacer login
    const validateLogin = async (email: string, password: string): Promise<boolean> => {
        setErrorMessage(null); // 🔄 Reiniciar mensaje de error antes de validar

        if (!validateEmail(email) || !validatePassword(password)) {
            return false;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // ✅ Verificar si el usuario existe en Firestore
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                setErrorMessage("El usuario no está registrado en la base de datos.");
                return false;
            }

            return true;
        } catch (error: any) {
            console.log("❌ Error en la autenticación:", error.message);
            
            if (error.code === "auth/invalid-credential") {
                setErrorMessage("Correo o contraseña incorrectos.");
            } else if (error.code === "auth/user-not-found") {
                setErrorMessage("El usuario no existe.");
            } else if (error.code === "auth/too-many-requests") {
                setErrorMessage("Demasiados intentos fallidos. Inténtalo más tarde.");
            } else {
                setErrorMessage("Error al iniciar sesión.");
            }
            return false;
        }
    };

    return (
        <ValidationContext.Provider
            value={{
                validateEmail,
                validatePassword,
                validateLogin,
                errorMessage,
                setErrorMessage
            }}
        >
            {children}
        </ValidationContext.Provider>
    );
};

// Hook para usar el contexto
export const useValidation = () => useContext(ValidationContext);
