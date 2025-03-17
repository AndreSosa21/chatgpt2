    import { auth, db } from "@/utils/FirebaseConfig";
    import { router } from "expo-router";
    import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
    import { createContext, useContext } from "react";
    import { doc, setDoc, getDoc } from "firebase/firestore";
    import { useValidation } from "@/context/ValidationContext";

    // Define the interface for the authentication context
    interface AuthContextProps {
        handleSignUp: (email: string, password: string, confirmPassword: string) => void;
        handleLogin: (email: string, password: string) => void;
        signUp: () => void;
        login: () => void;
        handleLogout: () => void;
    }

    // Create the authentication context
    export const AuthContext = createContext({} as AuthContextProps);

    // Provide the authentication context to the application
    export const AuthProvider = ({ children }: any) => {
        const { validateEmail, validatePassword, validateLogin, setErrorMessage } = useValidation();

        // Function to handle user registration (Sign Up)
        const handleSignUp = async (email: string, password: string, confirmPassword: string) => {
            setErrorMessage(null); // Reset error message before validating

            // Validate email and password format before proceeding
            if (!validateEmail(email) || !validatePassword(password)) return;

            // Ensure password confirmation matches
            if (password !== confirmPassword) {
                setErrorMessage("Passwords do not match.");
                return;
            }

            try {
                // Create a new user in Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Store the user data in Firestore under "users" collection
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    createdAt: new Date().toISOString(),
                });

                // Navigate to the dashboard after successful registration
                router.push({
                    pathname: "/dashboard",
                    params: { userId: userCredential.user.email },
                });
            } catch (error) {
                setErrorMessage("Error registering user.");
            }
        };

        // Function to handle user login
        const handleLogin = async (email: string, password: string) => {
            setErrorMessage(null); // Reset error message before validating

            // Validate login credentials using the validation context
            const isValid = await validateLogin(email, password);
            if (!isValid) return;

            try {
                // Sign in the user with Firebase Authentication
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Check if the user exists in Firestore
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    setErrorMessage("User is not registered.");
                    return;
                }

                // Navigate to the dashboard after successful login
                router.push({
                    pathname: "/dashboard",
                    params: { userId: user.email },
                });
            } catch (error) {
                setErrorMessage("Incorrect email or password.");
            }
        };

        // Function to navigate to the Sign Up screen
        const signUp = () => {
            router.push("/signUp");
        };

        // Function to navigate to the Login screen
        const login = () => {
            router.push("/login");
        };

        // Function to handle user logout and navigate to the welcome screen
        const handleLogout = () => {
            router.push("/welcome");
        };

        // Provide the authentication functions to the entire application
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
