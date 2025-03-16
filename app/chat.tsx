import { View, Text, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { Message } from '@/interfaces/AppInterfaces';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { DataContext } from '../context/dataContext';
import { useTheme } from '../context/themeContext'; // Importamos el tema

export default function Chat() {
    const router = useRouter();
    const { chatTitle, userId } = useLocalSearchParams();
    const { messages, getResponse, isLoading, getMessages, setMessages } = useContext(DataContext);
    const { theme } = useTheme(); // Obtenemos los colores del tema
    const [input, setInput] = React.useState("");

    useEffect(() => {
        if (!chatTitle) {
            setMessages([]); // Limpiar chat si es nuevo
        } else {
            getMessages(userId as string, chatTitle as string);
        }
    }, [chatTitle, userId]);

    const renderItem = ({ item }: { item: Message }) => (
        <View style={{
            alignSelf: item.sender === userId ? 'flex-end' : 'flex-start',
            backgroundColor: item.sender === userId ? theme.inputBackground : theme.borderColor, 
            padding: 10,
            margin: 5,
            borderRadius: 15,
            maxWidth: '75%'
        }}>
            <Text style={{ color: theme.text }}>{item.text}</Text>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 15,
                paddingHorizontal: 20,
                backgroundColor: theme.header
            }}>
                <TouchableOpacity onPress={() => router.push({ pathname: '/dashboard', params: { userId: userId } })}>
                    <Text style={{ color: theme.text, fontSize: 16 }}>{'< Back'}</Text>
                </TouchableOpacity>
                
                <Image
                    source={require('../assets/images/chatgpt2.png')}
                    style={{ width: 25, height: 25, tintColor: theme.text }}
                />
            </View>

            {/* Línea divisoria */}
            <View style={{ height: 1, backgroundColor: theme.borderColor }} />

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
                backgroundColor: theme.inputBackground,
                borderRadius: 20,
                margin: 15
            }}>
                <TextInput
                    style={{ flex: 1, color: theme.inputText, padding: 10 }}
                    placeholderTextColor={theme.text}
                    value={input}
                    onChangeText={setInput}
                    placeholder="Pregunta lo que quieras"
                />
                <TouchableOpacity
                    style={{ backgroundColor: theme.buttonBackground, padding: 10, borderRadius: 20 }}
                    onPress={() => getResponse(userId as string, input)}
                    disabled={isLoading}
                >
                    <Image
                        source={require('../assets/images/flecha.png')}
                        style={{ width: 20, height: 20, tintColor: theme.buttonText }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}
