import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Image,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
} from "react-native";
import { screenSize } from "../constants/screens";
import { Images } from "../constants/images";
import { Fonts } from "../constants/fonts";
import { useNavigation } from "@react-navigation/native";
import { sendImageToGemini } from "../services/geminiService";
import { launchImageLibrary } from 'react-native-image-picker';

const ImageExplorer: React.FC = () => {
    const navigation: any = useNavigation();
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const pickImage = async (): Promise<string | null> => {
        return new Promise((resolve, reject) => {
            const options: any = {
                mediaType: 'photo',
                includeBase64: true,
                maxWidth: 800,
                maxHeight: 800,
                quality: 1,
            };

            launchImageLibrary(options, (response) => {
                if (response.didCancel) {
                    resolve(null);
                } else if (response.errorMessage) {
                    reject(response.errorMessage);
                } else if (response.assets && response.assets.length > 0) {
                    const uri: any = response.assets[0].uri;
                    setImageUri(uri);
                    resolve(response.assets[0].base64 || null);
                } else {
                    resolve(null);
                }
            });
        });
    };

    const describeImage = async () => {
        setLoading(true);
        setDescription(null);
        setError(null);

        try {
            const base64Image = await pickImage();
            if (!base64Image) return;

            const descriptionResult = await sendImageToGemini(base64Image);
            setDescription(descriptionResult);
        } catch (err) {
            setError("Failed to analyze the image.");
        } finally {
            setLoading(false);
        }
    };
    const formatText = (text: any) => {
        // Regular expression to find **bold** text
        const regex = /\*\*(.*?)\*\*/g;
        let parts = [];
        let lastIndex = 0;

        text.replace(regex, (match: any, boldText: any, index: any) => {
            // Push normal text before bold text
            if (index > lastIndex) {
                parts.push({ text: text.substring(lastIndex, index), bold: false });
            }

            // Push bold text
            parts.push({ text: boldText, bold: true });

            // Update lastIndex
            lastIndex = index + match.length;
        });

        // Push any remaining normal text after the last match
        if (lastIndex < text.length) {
            parts.push({ text: text.substring(lastIndex), bold: false });
        }

        return parts;
    };

    const FormattedText = ({ content }: any) => {
        const formattedParts = formatText(content);

        return (
            <View style={{ padding: 20 }}>
                {formattedParts.map((part, index) => (
                    <Text key={index} style={{ fontWeight: part.bold ? "bold" : "normal" }}>
                        {part.text}
                    </Text>
                ))}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={Images.down} style={styles.backIcon} />
                </TouchableOpacity>
                <View style={styles.headerTitle}>
                    <Text style={styles.headerText}>Image Explorer</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <TouchableOpacity style={styles.uploadButton} onPress={describeImage}>
                    <Text style={styles.uploadButtonText}>Upload Image</Text>
                </TouchableOpacity>

                {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

                {loading && <ActivityIndicator size="large" color="#007bff" />}

                {description && (
                    <FormattedText content={description} />
                )}

                {error && <Text style={styles.error}>{error}</Text>}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    header: {
        padding: 20,
        width: screenSize.width,
        justifyContent: "flex-start",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "grey",
        flexDirection: "row",
    },
    backIcon: {
        height: 13,
        width: 21,
        resizeMode: "contain",
        transform: [{ rotate: "90deg" }],
    },
    headerTitle: {
        width: screenSize.width - 61,
        alignItems: "center",
    },
    headerText: {
        fontFamily: Fonts.semiBold_SF,
        color: "#000000",
        fontSize: 20,
        textTransform: "uppercase",
    },
    scrollContent: {
        padding: 20,
        alignItems: 'center',
    },
    uploadButton: {
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    uploadButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: "contain",
        marginBottom: 10,
    },
    error: {
        fontSize: 14,
        color: "red",
        marginTop: 10,
    },
});

const htmlStyles = {
    p: {
        fontSize: 16,
        color: "#333",
        marginBottom: 10,
    },
    h1: {
        fontSize: 22,
        fontWeight: '600',
        marginBottom: 10,
    },
    h2: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 8,
    },
};

export default ImageExplorer;
