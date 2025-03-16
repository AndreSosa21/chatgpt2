import { db } from "@/utils/FirebaseConfig";
import { createContext, useState, useEffect, ReactNode } from "react";
import { doc, setDoc, getDocs, getDoc, collection, updateDoc, arrayUnion, deleteDoc } from "firebase/firestore";
import { Message } from "@/interfaces/AppInterfaces";
import { APIResponse } from '@/interfaces/Responses';

// Define the interface for the data context
interface DataContextProps {
  messages: Message[];
  chats: { id: string; title: string }[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setCurrentChatTitle: React.Dispatch<React.SetStateAction<string>>;
  getMessages: (userId: string, title: string) => Promise<void>;
  getChats: (userId: string) => Promise<void>;
  saveMessageToFirebase: (userId: string, title: string, message: Message) => Promise<void>;
  getResponse: (userId: string, input: string) => Promise<void>;
  isLoading: boolean;
  clearConversations: (userId: string) => Promise<void>;
  handleClearChats: (userId: string) => Promise<void>;
}

// Create the data context
export const DataContext = createContext({} as DataContextProps);

// Provide the data context to the entire app
export const DataProvider = ({ children }: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatTitle, setCurrentChatTitle] = useState("");
  const [chats, setChats] = useState<{ id: string; title: string }[]>([]);

  // Fetch user chats from Firestore
  async function getChats(userId: string) {
    const chatsCol = collection(db, `chats/${userId}/titles`);
    const chatsSnapshot = await getDocs(chatsCol);
    const chatsList = chatsSnapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title }));
    setChats(chatsList);
  }

  // Fetch messages from a specific chat
  async function getMessages(userId: string, title: string) {
    try {
      const chatDocRef = doc(db, `chats/${userId}/titles`, title);
      const chatDocSnap = await getDoc(chatDocRef);

      if (chatDocSnap.exists()) {
        const docData = chatDocSnap.data();
        const chatData = docData?.messages || [];
        setMessages(chatData);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }

  // Save messages to Firestore
  async function saveMessageToFirebase(userId: string, title: string, message: Message) {
    const chatRef = doc(db, `chats/${userId}/titles`, title);

    try {
        const chatDocSnap = await getDoc(chatRef); 

        if (!chatDocSnap.exists()) {
            // If the chat doesn't exist, create it with the first message
            await setDoc(chatRef, { title, messages: [message] });
            console.log("Message saved successfully.");
        } else {
            // If the chat exists, update the messages array
            await updateDoc(chatRef, {
                messages: arrayUnion(message),
            });
            console.log("Message updated successfully.");
        }
    } catch (error) {
        console.error("Error saving message:", error);
    }
  }

  // Handle user input and generate a response
  const getResponse = async (userId: string, input: string) => {
    if (!input.trim()) return;

    let chatTitle = currentChatTitle; // Keep the current title if it exists

    if (!currentChatTitle) {
        chatTitle = input.split(" ").slice(0, 4).join(" "); // Extract the first 4 words as the chat title
        setCurrentChatTitle(chatTitle); // ✅ Update the chat title
        console.log("New chat title:", chatTitle);
    }

    // Create user message
    const userMessage: Message = {
      text: input,
      sender: userId,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    await saveMessageToFirebase(userId, chatTitle, userMessage);
    
    try {
        setIsLoading(true);

        // Send the user message to the API
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAEPKtDGwCVukgRv7ux2ZU4LnZcQ_FO2fA", {
            method: "POST",
            body: JSON.stringify({
                "contents": [{ "parts": [{ "text": input }] }]
            })
        });

        const data: APIResponse = await response.json();
        const botResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";

        // Create bot message
        const botMessage: Message = {
            text: botResponse,
            sender: 'bot',
            timestamp: new Date().toISOString()
        };
        setMessages((prev) => [...prev, botMessage]);
        await saveMessageToFirebase(userId, chatTitle, botMessage);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        setIsLoading(false);
        setInput("");
    }
  };

  // Delete all user conversations
  async function clearConversations(userId: string) {
    try {
        const titlesRef = collection(db, `chats/${userId}/titles`);
        const snapshot = await getDocs(titlesRef);
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        console.log("All chat titles deleted successfully.");
    } catch (error) {
        console.error("Error deleting chat titles:", error);
    }
  }

  // Handle clearing user chats
  const handleClearChats = async (userId: string) => {
    await clearConversations(userId as string);
    getChats(userId as string);
  };

  // Provide the data and functions to the entire application
  return (
    <DataContext.Provider
        value={{
            messages,
            chats,
            setMessages,
            setCurrentChatTitle,
            getMessages,
            getChats,
            saveMessageToFirebase,
            getResponse,
            isLoading,
            clearConversations,
            handleClearChats
        }}
    >
        {children}
    </DataContext.Provider>
  );
};
