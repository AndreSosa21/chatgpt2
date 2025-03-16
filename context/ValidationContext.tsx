import { createContext, useContext, useState } from "react";
import { auth, db } from "@/utils/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface ValidationContextProps {
    validateEmail: (email: string) => boolean; // Function to validate email format
    validatePassword: (password: string) => boolean; // Function to validate password length
    validateLogin: (email: string, password: string) => Promise<boolean>; // Function to validate login credentials
    errorMessage: string | null; // Stores any validation or authentication errors
    setErrorMessage: (message: string | null) => void; // Function to set error messages
}

// 1. Create the validation context
export const ValidationContext = createContext({} as ValidationContextProps);

// 2. Create the ValidationProvider component
export const ValidationProvider = ({ children }: any) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to store error messages

    // 🔹 Validate Email Format
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regular expression for email validation
        if (!emailRegex.test(email)) {
            setErrorMessage("Invalid email format. Please use a valid email.");
            return false;
        }
        return true;
    };

    // 🔹 Validate Password (minimum 8 characters)
    const validatePassword = (password: string): boolean => {
        if (password.length < 8) {
            setErrorMessage("Password must be at least 8 characters long.");
            return false;
        }
        return true;
    };

    // 🔹 Validate if the user exists in Firebase before logging in
    const validateLogin = async (email: string, password: string): Promise<boolean> => {
        setErrorMessage(null); // 🔄 Reset error message before validation

        if (!validateEmail(email) || !validatePassword(password)) {
            return false; //  Stop login attempt if email or password are invalid
        }

        try {
            console.log("Attempting to log in..."); // Debugging log
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // ✅ Check if the user exists in Firestore
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                setErrorMessage("User is not registered in the database.");
                return false;
            }

            return true; // ✅ Login successful
        } catch (error: any) {
            console.log(" Authentication error:", error.message); // Debugging log

            // Handle specific Firebase authentication errors
            if (error.code === "auth/invalid-credential") {
                setErrorMessage("Incorrect email or password.");
            } else if (error.code === "auth/user-not-found") {
                setErrorMessage("User does not exist.");
            } else if (error.code === "auth/too-many-requests") {
                setErrorMessage("Too many failed attempts. Try again later.");
            } else {
                setErrorMessage("Error logging in.");
            }
            return false; // Login failed
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

// 3. Custom hook to use the validation context
export const useValidation = () => useContext(ValidationContext);
