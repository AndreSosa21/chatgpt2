import { auth, db } from "@/utils/FirebaseConfig";
import { router } from "expo-router";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { createContext, useContext } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useValidation } from "@/context/ValidationContext";

interface AuthContextProps {
    handleSignUp: (email: string, password: string, confirmPassword: string) => void;
    handleLogin: (email: string, password: string) => void;
    signUp: () => void;
    login: () => void;
    handleLogout: () => void;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
    const { validateEmail, validatePassword, validateLogin, setErrorMessage } = useValidation();

    const handleSignUp = async (email: string, password: string, confirmPassword: string) => {
        setErrorMessage(null);

        if (!validateEmail(email) || !validatePassword(password)) return;

        if (password !== confirmPassword) {
            setErrorMessage("Las contraseñas no coinciden.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdAt: new Date().toISOString(),
            });

            router.push({
                pathname: "/dashboard",
                params: { userId: userCredential.user.email },
            });
        } catch (error) {
            setErrorMessage("Error al registrar el usuario.");
        }
    };

    const handleLogin = async (email: string, password: string) => {
        setErrorMessage(null);

        const isValid = await validateLogin(email, password);
        if (!isValid) return;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                setErrorMessage("El usuario no está registrado.");
                return;
            }

            router.push({
                pathname: "/dashboard",
                params: { userId: user.email },
            });
        } catch (error) {
            setErrorMessage("Correo o contraseña incorrectos.");
        }
    };

    // 🔹 Funciones de Navegación
    const signUp = () => {
        router.push("/signUp");
    };

    const login = () => {
        router.push("/login");
    };

    const handleLogout = () => {
        router.push("/welcome");
    };

    return (
        <AuthContext.Provider
            value={{
                handleLogin,
                signUp,
                handleSignUp,
                login,
                handleLogout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
