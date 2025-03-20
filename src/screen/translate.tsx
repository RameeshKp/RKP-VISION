import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Image,
    ImageBackground,
    StyleSheet,
    ScrollView,
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { screenSize } from '../constants/screens';
import { Images } from '../constants/images';
import { Fonts } from '../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Config from 'react-native-config';
import { showToast, TOAST_TYPE } from '../utils/Toast';

const MODELS = {
    french: "Helsinki-NLP/opus-mt-en-fr",
    spanish: "Helsinki-NLP/opus-mt-en-es",
    german: "Helsinki-NLP/opus-mt-en-de"
};

const TranslateScreen: React.FC = () => {
    const navigation: any = useNavigation();
    const [inputText, setInputText] = useState("");
    const [translatedText, setTranslatedText] = useState<any>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof MODELS | "">("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    const translateText = async () => {
        setLoading(true);

        if (!selectedLanguage) {
            showToast(TOAST_TYPE.ERROR, 'Please select a language');
            setLoading(false);
            return;
        }
        if (!inputText) {
            showToast(TOAST_TYPE.ERROR, 'Please type something');
            setLoading(false);
            return;
        }

        try {


            const response = await axios.post(
                `https://api-inference.huggingface.co/models/${MODELS[selectedLanguage]}`,
                { inputs: inputText },
                { headers: { Authorization: `Bearer ${Config?.HF_API_KEY}` } }
            );

            setTranslatedText(response.data[0]?.translation_text || "No translation available");
            setLoading(false)
        } catch (error) {
            setTranslatedText(null)
            if (error?.response?.status === 503) {
                setTimeout(translateText, 10000);
            } else {
                setLoading(false)
                showToast(TOAST_TYPE.ERROR, error?.response?.data?.error)
            }
        }
    };

    return (
        <ImageBackground source={Images.translateBg} style={styles.backgroundImage}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={Images.down} style={styles.backIcon} />
                    </TouchableOpacity>
                    <View style={styles.headerTitle}>
                        <Text style={styles.headerText}>Translate</Text>

                    </View>
                </View>
                <ScrollView
                    nestedScrollEnabled
                    bounces={false}
                    contentContainerStyle={styles.scrollContent}>
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
                        {!loading ? <Text style={styles.translateButtonText}>Translate</Text> :
                            <ActivityIndicator color={"#FFFFFF"} />}
                    </TouchableOpacity>
                    {translatedText &&
                        <View style={styles.translationContainer}>
                            <Text style={styles.translationLabel}>Translation</Text>
                            {!loading ? (
                                <ScrollView>
                                    <Text style={styles.translationText}>{translatedText}</Text>
                                </ScrollView>
                            ) : (
                                <>
                                    <View style={styles.loadingBar1} />
                                    <View style={styles.loadingBar2} />
                                    <View style={styles.loadingBar3} />
                                </>
                            )}
                        </View>}
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
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
        transform: [{ rotate: '90deg' }],
        tintColor: '#FFFFFF'
    },
    headerTitle: {
        flex: 1,
        alignItems: 'center',
    },
    headerText: {
        fontFamily: Fonts.semiBold_SF,
        fontSize: 22,
        color: '#FFFFFF',
    },
    scrollContent: {
        padding: 20,
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#8810de',
        padding: 12,
        marginBottom: 15,
        width: '90%',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    dropdownButton: {
        width: '90%',
        padding: 12,
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
        fontWeight: 'bold',
        fontSize: 18,
        color: '#000000'
    },
    translationText: {
        fontSize: 20,
        marginTop: 10,
        textAlign: 'center',
        color: "#ed0955",
    },
    translationContainer: {
        backgroundColor: "#FFFFFF",
        width: screenSize.width - 80,
        borderRadius: 10,
        marginVertical: 20,
        padding: 10,
        alignItems: "center",
        maxHeight: 300,
        minHeight: 130,
    },
    loadingBar1: {
        width: screenSize.width - 100,
        backgroundColor: "#e8e9ed",
        height: 10,
        marginTop: 20,
    },
    loadingBar2: {
        width: screenSize.width - 120,
        backgroundColor: "#e8e9ed",
        height: 10,
        marginTop: 10,
    },
    loadingBar3: {
        width: screenSize.width - 140,
        backgroundColor: "#e8e9ed",
        height: 10,
        marginTop: 10,
    },
});

export default TranslateScreen;
