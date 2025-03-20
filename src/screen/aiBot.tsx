import React, { useState, useRef } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet,
    SafeAreaView, Image, ActivityIndicator, ImageBackground
} from 'react-native';
import { sendMessageToGemini } from '../services/geminiService';
import { screenSize } from '../constants/screens';
import { Images } from '../constants/images';
import { Fonts } from '../constants/fonts';
import { useNavigation } from '@react-navigation/native';

type Message = {
    id: string;
    text: string;
    isUser: boolean;
};

const ChatScreen: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false); // Loader state
    const flatListRef = useRef<FlatList<Message>>(null);

    const replaceGemini = (text: string) => {
        return text
            .replace(/developed by google/gi, "developed by Rameesh K P")
            .replace(/trained by google/gi, "trained by Rameesh K P")
            .replace(/gemini/gi, "RKP GENIE");
    };

    const handleSendMessage = async () => {
        if (inputText.trim() === '') return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputText,
            isUser: true,
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setInputText('');

        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        setLoading(true);

        try {
            const geminiResponse = await sendMessageToGemini(inputText);

            const botMessage: Message = {
                id: Date.now().toString(),
                text: replaceGemini(geminiResponse),
                isUser: false,
            };
            setMessages((prevMessages) => [...prevMessages, botMessage]);

            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        } catch (error) {
            console.error('Failed to get response from Gemini:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View style={item.isUser ? styles.userMessage : styles.botMessage}>
            {item.isUser ? (
                <Text style={styles.messageText}>{item.text}</Text>
            ) : (
                <FormattedText content={item.text} />
            )}
        </View>
    );

    const navigation: any = useNavigation();

    const formatText = (text: any) => {
        const regex = /\*\*(.*?)\*\*/g;
        let parts: any[] = [];
        let lastIndex = 0;

        text.replace(regex, (match, boldText, index) => {
            if (index > lastIndex) {
                parts.push({ text: text.substring(lastIndex, index), bold: false });
            }
            parts.push({ text: boldText, bold: true });
            lastIndex = index + match.length;
        });

        if (lastIndex < text.length) {
            parts.push({ text: text.substring(lastIndex), bold: false });
        }

        return parts;
    };

    const FormattedText = ({ content }: { content: string }) => {
        const formattedParts = formatText(content);

        return (
            <View>
                {formattedParts.map((part, index) => (
                    <Text key={index} style={[{ fontWeight: part.bold ? 'bold' : 'normal' }, styles.botText]}>
                        {part.text}
                    </Text>
                ))}
            </View>
        );
    };

    return (
        <ImageBackground
            source={Images.chatBg}  
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <SafeAreaView style={{ flex: 1 }}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={Images.down} style={styles.backIcon} />
                    </TouchableOpacity>
                    <View style={styles.headerTitle}>
                        <Text style={styles.headerText}>RKP Genie</Text>
                    </View>
                </View>

                {/* Chat Container */}
                <View style={styles.container}>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.messagesContainer}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    />

                    {/* Loader */}
                    {loading && <ActivityIndicator size="small" color="#007bff" style={styles.loader} />}

                    {/* Input Area */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            value={inputText}
                            onChangeText={setInputText}
                            placeholder="Type a message..."
                        />
                        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                            <Text style={styles.sendButtonText}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </SafeAreaView>
        </ImageBackground >
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    header: {
        padding: 20,
        width: screenSize.width,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#FFFFFF',
        flexDirection: 'row',

    },
    backIcon: {
        height: 20,
        width: 21,
        resizeMode: 'contain',
        transform: [{ rotate: '90deg' }],
        tintColor: '#FFFFFF'
    },
    headerTitle: {
        width: screenSize.width - 61,
        alignItems: 'center',
    },
    headerText: {
        fontFamily: Fonts.semiBold_SF,
        color: '#FFFFFF',
        fontSize: 20,
        textTransform: 'uppercase',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    messagesContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
        maxWidth: '80%',
    },
    botMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 8,
        marginBottom: 8,
        maxWidth: '80%',
    },
    messageText: {
        color: '#fff',
    },
    botText: {
        color: '#007bff',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
        padding: 10,
        borderRadius: 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        marginRight: 8,
    },
    sendButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    loader: {
        marginVertical: 10,
        alignSelf: 'center',
    },
});

export default ChatScreen;
