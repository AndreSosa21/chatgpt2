import { View, Text, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import React, { useContext } from 'react';
import { Message } from '@/interfaces/AppInterfaces';
import { useRouter,useLocalSearchParams } from 'expo-router';
import { DataContext } from '../context/dataContext';

export default function Chat() {
    const router = useRouter();
    const { chatTitle, userId } = useLocalSearchParams();
    const userid = userId && typeof userId === "string" ? userId : "";

    

    const { messages, getResponse, isLoading } = useContext(DataContext);
    console.log("userId", userId);

    if (!userId) {
        console.error("Error: userId no está definido.");
        return <Text style={{ color: 'red' }}>Error: No se encontró el usuario.</Text>;
    }
    
    const [input, setInput] = React.useState("");
    
    const [currentChatTitle, setCurrentChatTitle] = React.useState("");
    const chatTitleString = Array.isArray(chatTitle) ? chatTitle[0] : chatTitle || "";

    console.log(input);
    const renderItem = ({ item }: { item: Message }) => (
        <View style={{
            alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: item.sender === 'user' ? 'grey' : '#444',
            padding: 10,
            margin: 5,
            borderRadius: 15,
            maxWidth: '75%'
        }}>
            <Text style={{ color: '#fff' }}>{item.text}</Text>
        </View>
    );
   

    return (
        <View style={{ flex: 1, backgroundColor: '#353540' }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 15,
                paddingHorizontal: 20,
                backgroundColor: '#2A2B30'
            }}>
                <TouchableOpacity onPress={() => router.push({ pathname: '/dashboard', params: {  userId: userId  } })}>
                    <Text style={{ color: '#fff', fontSize: 16 }}>{'< Back'}</Text>
                </TouchableOpacity>
                
                <Image
                    source={require('../assets/images/chatgpt2.png')}
                    style={{ width: 25, height: 25, tintColor: 'white' }}
                />
            </View>

            {/* Línea divisoria */}
            <View style={{ height: 1, backgroundColor: '#444' }} />

            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={{ padding: 15 }}
            />

            {/* Input */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                backgroundColor: '#444',
                borderRadius: 20,
                margin: 15
            }}>
                <TextInput
                    style={{ flex: 1, color: '#fff', padding: 10 }}
                    placeholderTextColor="#aaa"
                    value={input}
                    onChangeText={setInput}
                    placeholder="Pregunta lo que quieras"
                />
                <TouchableOpacity
                    style={{ backgroundColor: 'white', padding: 10, borderRadius: 20 }}
                    onPress={() => getResponse(userid, input)}
                    disabled={isLoading}
                >
                    <Image
                        source={require('../assets/images/flecha.png')}
                        style={{ width: 20, height: 20, tintColor: 'black' }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}
