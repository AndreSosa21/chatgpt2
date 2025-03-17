# **Chatgpt2 - AI Chatbot App by Andrea Sosa**

ChatGPT2 is an AI-powered chatbot application built using **React Native** with **Expo Router** and Firebase authentication. This project allows users to chat with an AI assistant, manage conversations, and store messages in Firebase.

---

## **📂 Project Structure**
The project is structured as follows:

📦 CHATGPT2

├── .expo/                     # Expo-related configurations

├── app/                       # Main application screens
      │  
      ├── chat.tsx               # Chat screen where users interact with the AI
│   
   ├── dashboard.tsx          # Dashboard with chat history
│   
   ├── index.tsx              # Splash screen before redirection
│   
   ├── login.tsx              # User login screen
│   
   ├── signUp.tsx             # User registration screen
│   
   ├── welcome.tsx            # Initial welcome screen
│   
   ├── welcome2.tsx           # Capabilities introduction screen
│   
   ├── welcome3.tsx           # Limitations information screen
│   
   ├── splashScreen.tsx       # App loading screen
│   
   ├── _layout.tsx            # Layout configuration with providers

├── assets/                     # Static assets like images, fonts
│   
   ├── fonts/                  # Custom fonts
│   
   ├── images/                 # App images and icons

├── context/                    # Contexts for state management
│   
   ├── authContext.tsx         # Handles authentication (sign in, sign up, logout)
│   
   ├── dataContext.tsx         # Manages chat history and message storage
│   
   ├── themeContext.tsx        # Provides light/dark theme support
│   
   ├── ValidationContext.tsx   # Handles form validations and error messages

├── interfaces/                 # TypeScript interfaces
│   
   ├── AppInterfaces.ts        # Defines message and metadata structures
│   
   ├── Responses.ts            # Defines API response structure

├── utils/                      # Utility functions (e.g., Firebase config)
│   
   ├── FirebaseConfig.ts       # Firebase authentication and database config

├── .gitignore                  # Files to ignore in version control

├── app.json                    # Expo configuration file

├── tsconfig.json               # TypeScript configuration

├── package.json                # Dependencies and scripts

└── README.md                   # Project documentation


---

## **🚀 Features**
✅ **User Authentication**: Users can register and log in using Firebase authentication.  
✅ **AI Chatbot**: Users can chat with an AI-powered assistant.  
✅ **Chat History**: Stores past conversations in Firebase for later access.  
✅ **Dark & Light Theme**: Users can switch between dark and light themes.  
✅ **Validation Handling**: Ensures correct email format, password length, and login credentials.  
✅ **Error Messages**: Displays meaningful error messages for authentication failures.  

---

## **🛠️ Technologies Used**
- **React Native** (Expo)
- **Firebase** (Authentication & Firestore)
- **TypeScript** (For type safety)
- **Expo Router** (Navigation)
- **Context API** (Global state management)

---

## **📌 Installation & Setup**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/AndreSosa21/Chatgpt2.git
cd chatgpt2
```
2️⃣ Install Dependencies
```sh
npm install
```
3️⃣ Configure Firebase
```sh
Create a Firebase project in the Firebase Console.
Enable Authentication (Email/Password).
Set up a Cloud Firestore Database.
Copy your Firebase credentials into FirebaseConfig.ts.
```
4️⃣ Run the Project
```sh
expo start
```
📖 Application Overview

🔹 Authentication Context (authContext.tsx)
handleSignUp → Registers a new user with Firebase.
handleLogin → Signs in an existing user.
handleLogout → Logs the user out.
signUp / login → Navigation functions.


🔹 Chat Data Management (dataContext.tsx)
getChats → Fetches the user's chat history from Firestore.
getMessages → Retrieves messages from a specific chat.
saveMessageToFirebase → Saves messages in Firestore.
getResponse → Calls the AI API and saves responses.


🔹 Validation (ValidationContext.tsx)
validateEmail → Ensures email format is correct.
validatePassword → Ensures password is at least 8 characters.
validateLogin → Checks if the user exists in Firebase before login.
errorMessage → Stores validation errors.


🔹 Theme Support (themeContext.tsx)
Dark & Light Themes managed via Context API.

📄 License
This project is licensed under the MIT License.

📬 Contact
For any inquiries, feel free to reach out:

📧 Email: andreasosro@unisabana.edu.co

🔗 GitHub: AndreSosa21

🚀 Happy coding! 🚀

This **README.md** file provides:
- A clear **project structure**
- **Installation & setup instructions**
- **Features and technologies used**
- **Description of each important context**
- **License & contact information**
