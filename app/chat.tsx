import { View, Text, Image, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import React, { useContext, useEffect } from 'react';
import { Message } from '@/interfaces/AppInterfaces';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { DataContext } from '../context/dataContext';
import { useTheme } from '../context/themeContext'; 

export default function Chat() {
    const router = useRouter();
    const { chatTitle, userId } = useLocalSearchParams();
    const { messages, getResponse, isLoading, getMessages, setMessages, setCurrentChatTitle } = useContext(DataContext);
    const { theme } = useTheme(); 
    const [input, setInput] = React.useState("");

    // useEffect hook to get messages when chatTitle or userId changes
    useEffect(() => {
        if (!chatTitle) {
            console.log("Waiting for chat title...");
            setMessages([]);
            return;
        }

        if (chatTitle && userId) {
            console.log(`messages for.. "${chatTitle}"`);
            setCurrentChatTitle(Array.isArray(chatTitle) ? chatTitle[0] : chatTitle);
            setMessages([]);
            getMessages(userId as string, chatTitle as string);
        }
    }, [chatTitle, userId]);

    // Render each message, user or bot message with some styles
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

    // Main view of the chat with KeyboardAvoidingView
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior for iOS
        >
            <View style={{ flex: 1, backgroundColor: theme.background }}>
                {/* Header */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 60,
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

                {/* Division line */}
                <View style={{ height: 1, backgroundColor: theme.borderColor, marginTop:20 }} />

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
        </KeyboardAvoidingView>
    );
}
