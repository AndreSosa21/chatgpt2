import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/utils/FirebaseConfig';
import { useContext, useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemeContext } from '../context/themeContext';
import { DataContext } from '@/context/dataContext';

const [chats, setChats] = useState<{ id: string; title: string }[]>([]);
export { setChats };
export default function Dashboard() {
    const router = useRouter();
    const { userId } = useLocalSearchParams();
    console.log("userid", userId);
    const [chats, setChats] = useState<{ id: string; title: string }[]>([]);
   
    const { theme,darkMode,setDarkMode } = useContext(ThemeContext);
    const { clearConversations } = useContext(DataContext);

    async function getChats() {
        const chatsCol = collection(db, `chats/${userId}/titles`);
        const chatsSnapshot = await getDocs(chatsCol);
        const chatsList = chatsSnapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title }));
        setChats(chatsList);
    }
    
    useEffect(() => {
        getChats();
    }, []);

    const handleLogout  = () => {
        
         router.push("/welcome");
    };
    const handleClearChats = async () => {
        await clearConversations(userId as string);
        getChats(); // 🔹 Vuelve a cargar los títulos en Dashboard
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 15,
                    paddingHorizontal: 20,
                    paddingTop: 40
                }}>
                    <View style={{ alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'center' }}>
                        <Image
                            source={require('../assets/images/chat.png')}
                            style={{ width: 25, height: 25, tintColor: theme.ImageBackground }}
                        />
                        <Text style={{ color: theme.text, fontSize: 16, paddingInlineStart: 20 }}>{'New Chat'}</Text>
                    </View>
                    
                    <TouchableOpacity onPress={() => router.push({ pathname: '/chat', params: {  userId: userId  } })}>
                        <Text style={{ color: theme.text, fontSize: 16 }}>{'>'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 1, backgroundColor: '#444' }} />
                
                {chats.map(chat => (
                    <View key={chat.id} style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 15,
                        paddingHorizontal: 20,
                        paddingTop: 40
                    }}>
                        <View style={{ alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'center' }}>
                            <Image
                                source={require('../assets/images/chat.png')}
                                style={{ width: 25, height: 25, tintColor: theme.ImageBackground }}
                            />
                            <Text style={{ color: theme.text, fontSize: 16, paddingInlineStart: 20 }}>
                                {chat.id}
                            </Text>
                        </View>

                        <TouchableOpacity onPress={() => router.push({ pathname: '/chat', params: { chatTitle: chat.id, userId: userId  } })}>
                            <Text style={{ color: theme.text, fontSize: 16 }}>{'>'}</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <View style={{ height: 1, backgroundColor: '#444' }} />

                <View style={{ height: 400, paddingHorizontal: 20 }}>
                    {/* Aquí se agregarán dinámicamente los chats guardados */}
                </View>

                <View style={{ height: 2, backgroundColor: '#444' }} />

                <View style={{ flexDirection: 'column', paddingTop: 20, paddingHorizontal: 20 }}>
                    <TouchableOpacity   onPress={handleClearChats} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                        <Image
                            source={require('../assets/images/iconoBasura.png')}
                            style={{ width: 25, height: 25, tintColor: theme.ImageBackground }}
                        />
                        <Text style={{ color: theme.text, fontSize: 16, paddingLeft: 20 }}>{'Clear conversations'}</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                        <Image
                            source={require('../assets/images/perfil.png')}
                            style={{ width: 26, height: 26, tintColor: theme.ImageBackground }}
                        />
                        <Text style={{ color: theme.text, fontSize: 16, paddingLeft: 20 }}>{'Upgrade to Plus'}</Text>
                    </View>

                    <TouchableOpacity
                     onPress={() => {
                        console.log("Cambiando tema...", darkMode); // Ver si se ejecuta
                        setDarkMode(!darkMode);
                        console.log("Cambiando tema...", darkMode); 
                    }} 
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
                    >
                        <Image
                            source={require('../assets/images/light.png')}
                            style={{ width: 26, height: 26, tintColor: theme.ImageBackground }}
                        />
                        <Text style={{ color: theme.text, fontSize: 16, paddingLeft: 20 }}>{'Light mode'}</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                        <Image
                            source={require('../assets/images/update.png')}
                            style={{ width: 23, height: 23, tintColor: theme.ImageBackground }}
                        />
                        <Text style={{ color: theme.text, fontSize: 16, paddingLeft: 20 }}>{'Updates and FAQ'}</Text>
                    </View>

                    {/* Aquí envolvemos la sección de Logout en un TouchableOpacity */}
                    <TouchableOpacity 
                        onPress={handleLogout}
                        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}
                    >
                        <Image
                            source={require('../assets/images/logout.png')}
                            style={{ width: 25, height: 25, tintColor: 'red' }}
                        />
                        <Text style={{ color: 'red', fontSize: 16, paddingLeft: 20 }}>{'Logout'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
