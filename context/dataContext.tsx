
import { db } from "@/utils/FirebaseConfig";
import { createContext, useState, useEffect, ReactNode } from "react";
import { doc, setDoc, getDocs, collection, updateDoc, arrayUnion } from "firebase/firestore";
import { Message } from "@/interfaces/AppInterfaces";
import { APIResponse } from '@/interfaces/Responses';

interface DataContextProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  getMessages: (title: string) => Promise<void>;
  saveMessageToFirebase: (userId: string, title: string, message: Message) => Promise<void>;
  getResponse: (userid: string, input: string) => Promise<void>;
  isLoading: boolean;
}

export const DataContext = createContext({} as DataContextProps);

export const DataProvider = ({ children }: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatTitle, setCurrentChatTitle] = useState("");

  async function getMessages(title: string) {
    try {
      const chatSnap = await getDocs(collection(db, `chats/${title}/messages`));
      if (!chatSnap.empty) {
        const chatData = chatSnap.docs.map(doc => doc.data() as Message);
        setMessages(chatData || []);
      }
    } catch (error) {
      console.error("Error obteniendo mensajes:", error);
    }
  }

  async function saveMessageToFirebase(userId: string, title: string, message: Message) {
    const chatRef = doc(db, `chats/${userId}/titles`, title);
    try {
      const chatDoc = await getDocs(collection(db, `chats/${userId}/titles`));
      const chatExists = chatDoc.docs.some(doc => doc.id === title);

      if (!chatExists) {
        await setDoc(chatRef, { messages: [message] });
      } else {
        await updateDoc(chatRef, {
          messages: arrayUnion(message),
        });
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  }

  const getResponse = async (userId: string, input:string ) => {
    if (!input.trim()) return;

    const chatTitle = currentChatTitle || input.split(" ").slice(0, 4).join(" ");
    if (!currentChatTitle) {
      setCurrentChatTitle(chatTitle);
    }

    const userMessage: Message = {
      text: input,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    await saveMessageToFirebase(userId, chatTitle, userMessage);
    
            try {
                setIsLoading(true);
    
                const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAEPKtDGwCVukgRv7ux2ZU4LnZcQ_FO2fA", {
                    method: "POST",
                    body: JSON.stringify({
                        "contents": [{ "parts": [{ "text": input }] }]
                    })
                });
    
                const data: APIResponse = await response.json();
                const botResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response received";
    
                // Crear respuesta del bot
                const botMessage: Message = {
                    text: botResponse,
                    sender: 'bot',
                    timestamp: new Date().toISOString()
                };
                setMessages((prev) => [...prev, botMessage]);
                await saveMessageToFirebase("userId", chatTitle, botMessage);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setIsLoading(false);
                setInput("");
            }
        };
    
    

    return <DataContext.Provider
        value={{
            messages,
            setMessages,
            getMessages,
            saveMessageToFirebase,
            getResponse,
            isLoading
            
        }}
    >
        {children}
    </DataContext.Provider>
}