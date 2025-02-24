import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Image,
    StyleSheet,
    ScrollView,
    TextInput,
    Button
} from 'react-native';
import { screenSize } from '../constants/screens';
import { Images } from '../constants/images';
import { Fonts } from '../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const HF_API_KEY = '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';

const MODELS = {
    french: "Helsinki-NLP/opus-mt-en-fr",
    spanish: "Helsinki-NLP/opus-mt-en-es",
    german: "Helsinki-NLP/opus-mt-en-de"
};

const TranslateScreen: React.FC = () => {
    const navigation: any = useNavigation();
    const [inputText, setInputText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof MODELS | "">("");
    const [showDropdown, setShowDropdown] = useState(false);

    const translateText = async () => {
        if (!selectedLanguage) {
            setTranslatedText("Please select a language");
            return;
        }
        if (inputText == null || inputText == '') {
            setTranslatedText("Please type something");
            return;
        }


        try {
            const response = await axios.post(
                `https://api-inference.huggingface.co/models/${MODELS[selectedLanguage]}`,
                { inputs: inputText },
                { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
            );

            setTranslatedText(response.data[0]?.translation_text || "No translation available");
        } catch (error: any) {
            if (error?.response?.status == 503) {
                setTranslatedText("Translation model is currently loading. Please wait a moment and try again.");
            } else {
                setTranslatedText("Error translating text");

            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={Images.down} style={styles.backIcon} />
                </TouchableOpacity>
                <View style={styles.headerTitle}>
                    <Text style={styles.headerText}>Translate</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TextInput
                    placeholder="Enter text in English..."
                    value={inputText}
                    onChangeText={setInputText}
                    style={styles.input}
                />

                {/* Custom Dropdown */}
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setShowDropdown(!showDropdown)}>
                    <Text style={styles.dropdownButtonText}>
                        {selectedLanguage ? selectedLanguage.toUpperCase() : "Select Language"}
                    </Text>
                </TouchableOpacity>
                {showDropdown && (
                    <View style={styles.dropdownContainer}>
                        {Object.keys(MODELS).map((language) => (
                            <TouchableOpacity
                                key={language}
                                style={[
                                    styles.dropdownItem,
                                    selectedLanguage === language && styles.selectedDropdownItem
                                ]}
                                onPress={() => {
                                    setSelectedLanguage(language as keyof typeof MODELS);
                                    setShowDropdown(false);
                                }}>
                                <Text style={styles.dropdownItemText}>{language.charAt(0).toUpperCase() + language.slice(1)}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <TouchableOpacity style={styles.translateButton} onPress={translateText}>
                    <Text style={styles.translateButtonText}>Translate</Text>
                </TouchableOpacity>

                <Text style={styles.translationLabel}>Translation:</Text>
                <Text style={styles.translationText}>{translatedText}</Text>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        width: screenSize.width,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
    },
    backIcon: {
        height: 20,
        width: 30,
        resizeMode: 'contain',
        transform: [{ rotate: '90deg' }]
    },
    headerTitle: {
        flex: 1,
        alignItems: 'center',
    },
    headerText: {
        fontFamily: Fonts.semiBold_SF,
        fontSize: 22,
        color: '#333',
    },
    scrollContent: {
        padding: 20,
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        padding: 12,
        marginBottom: 15,
        width: '90%',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    dropdownButton: {
        width: '90%',
        padding: 12,
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#007BFF',
        alignItems: 'center',
        marginBottom: 10,
    },
    dropdownButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    dropdownContainer: {
        width: '90%',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#fff',
        padding: 5,
    },
    dropdownItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        alignItems: 'center',
    },
    selectedDropdownItem: {
        backgroundColor: '#ddd',
    },
    dropdownItemText: {
        fontSize: 16,
    },
    translateButton: {
        marginTop: 15,
        backgroundColor: '#28A745',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        width: '90%',
    },
    translateButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    translationLabel: {
        marginTop: 20,
        fontWeight: 'bold',
        fontSize: 18,
    },
    translationText: {
        fontSize: 20,
        marginTop: 10,
        textAlign: 'center',
        color: "#333",
    },
});

export default TranslateScreen;