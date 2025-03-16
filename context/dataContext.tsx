
import { db } from "@/utils/FirebaseConfig";
import { createContext, useState, useEffect, ReactNode } from "react";
import { doc, setDoc, getDocs, getDoc, collection, updateDoc, arrayUnion, deleteDoc } from "firebase/firestore";
import { Message } from "@/interfaces/AppInterfaces";
import { APIResponse } from '@/interfaces/Responses';


interface DataContextProps {
  messages: Message[];
  chats: { id: string; title: string }[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setCurrentChatTitle: React.Dispatch<React.SetStateAction<string>>;
  getMessages: (userId: string,title: string) => Promise<void>;
  getChats: (userId: string) => Promise<void>;
  saveMessageToFirebase: (userId: string, title: string, message: Message) => Promise<void>;
  getResponse: (userid: string, input: string) => Promise<void>;
  isLoading: boolean;
  clearConversations: (userId: string) => Promise<void>;
  handleClearChats: (userId: string) => Promise<void>;
}

export const DataContext = createContext({} as DataContextProps);

export const DataProvider = ({ children }: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatTitle, setCurrentChatTitle] = useState("");
  const [chats, setChats] = useState<{ id: string; title: string }[]>([]);

  async function getChats( userId: string) {
    const chatsCol = collection(db, `chats/${userId}/titles`);
    const chatsSnapshot = await getDocs(chatsCol);
    const chatsList = chatsSnapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title }));
    setChats(chatsList);
}
  async function getMessages(userId: string, title: string) {
    try {
      // Ruta al documento
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
      console.error("Error obteniendo mensajes:", error);
    }
  }

  async function saveMessageToFirebase(userId: string, title: string, message: Message) {
    const chatRef = doc(db, `chats/${userId}/titles`, title);
     
    try {
        const chatDocSnap = await getDoc(chatRef); 

        if (!chatDocSnap.exists()) {
            
            await setDoc(chatRef, { title, messages: [message] });
            console.log("Mensaje guardado correctamente.");
        } else {
            
            await updateDoc(chatRef, {
                messages: arrayUnion(message),
                
            });
            console.log("Mensaje actualizado correctamente.");
        }
    } catch (error) {
        console.error("Error saving message:", error);
    }
}


  const getResponse = async (userId: string, input:string ) => {
    if (!input.trim()) return;
   

    let chatTitle = currentChatTitle; // Mantenemos el título actual si ya existe

    if (!currentChatTitle) {
        chatTitle = input.split(" ").slice(0, 4).join(" "); // Tomamos las primeras 4 palabras como título
        setCurrentChatTitle(chatTitle); // ✅ Actualizamos correctamente el título
        console.log("Nuevo título del chat:", chatTitle);
    }

    const userMessage: Message = {
      text: input,
      sender: userId,
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
                await saveMessageToFirebase(userId, chatTitle, botMessage);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setIsLoading(false);
                setInput("");
            }
        };
        async function clearConversations(userId: string) {
          try {
              const titlesRef = collection(db, `chats/${userId}/titles`);
              const snapshot = await getDocs(titlesRef);
              const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
              await Promise.all(deletePromises);
      
              console.log("Títulos eliminados correctamente.");
          } catch (error) {
              console.error("Error al borrar los títulos:", error);
          }
      }

       const handleClearChats = async (userId: string) => {
            await clearConversations(userId as string);
            getChats(userId as string);
        };
    

    return <DataContext.Provider
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
}