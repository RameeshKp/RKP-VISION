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
    ImageBackground,
} from "react-native";
import { screenSize } from "../constants/screens";
import { Images } from "../constants/images";
import { Fonts } from "../constants/fonts";
import { useNavigation } from "@react-navigation/native";
import { sendImageToGemini } from "../services/geminiService";
import { launchImageLibrary } from 'react-native-image-picker';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat } from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";


const ImageExplorer: React.FC = () => {
    const navigation: any = useNavigation();
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const scale = useSharedValue(1);

    // Scale effect on press
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    // Pulse effect
    React.useEffect(() => {
        scale.value = withRepeat(withSpring(1.05, { damping: 2 }), -1, true);
    }, []);


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
        let parts: any = [];
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
            <View style={styles.textContainer}>
                {formattedParts.map((part, index) => (
                    <View key={index} style={[styles.highlight, { backgroundColor: index % 2 === 0 ? "#f2f08570" : "#a614f570" }]}>
                        <Text style={[styles.text, part.bold && styles.bold]}>{part.text}</Text>
                    </View>
                ))}
            </View>
        );
    };
    return (
        <ImageBackground source={Images.imageDescribeBg} style={styles.backgroundImage}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={Images.down} style={styles.backIcon} />
                    </TouchableOpacity>
                    <View style={styles.headerTitle}>
                        <Text style={styles.headerText}>Image Explorer</Text>
                    </View>
                </View>

                <View style={styles.scrollContent}>
                    <TouchableOpacity
                        onPress={() => {
                            scale.value = withSpring(0.9, { damping: 4 }, () => {
                                scale.value = withSpring(1);
                            });
                            describeImage();
                        }}
                        activeOpacity={0.8}
                    >
                        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
                            <LinearGradient
                                colors={["#FF512F", "#F09819"]} // Red to Orange
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.uploadButton}
                            >
                                <Text style={styles.uploadButtonText}>📸 Upload Image</Text>
                            </LinearGradient>
                        </Animated.View>
                    </TouchableOpacity>

                    {imageUri &&
                        <LinearGradient
                            colors={["#FF512F", "#F09819"]} // Red to Orange
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                borderWidth: 1,
                                marginTop: 20,
                                borderColor: '#F09819',
                                borderRadius: 10
                            }}
                        >
                            <Image source={{ uri: imageUri }} style={styles.image} />
                        </LinearGradient>
                    }

                    {loading && <ActivityIndicator style={{ marginTop: 10 }} size="large" color="#FFFFFF" />}

                    {description && (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            bounces={false}
                            contentContainerStyle={styles.scrollSec}
                            style={styles.scrollViw}
                        >
                            <FormattedText content={description} />
                        </ScrollView>
                    )}

                    {error && <Text style={styles.error}>{error}</Text>}
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    scrollSec: {
        paddingBottom: 300,
    },
    scrollViw: {
        marginTop: 15,
    },
    textContainer: {
        padding: 0,
    },
    highlight: {
        padding: 10,
        borderRadius: 5,
        marginBottom: 5, // Space between lines
    },
    text: {
        fontSize: 16,
        color: "#000000",
    },
    bold: {
        fontWeight: "bold",
    },
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
        justifyContent: "flex-start",
        alignItems: "center",
        borderBottomWidth: 2,
        borderBottomColor: "#000000",
        flexDirection: "row",
    },
    backIcon: {
        height: 20,
        width: 21,
        resizeMode: "contain",
        transform: [{ rotate: "90deg" }],
        tintColor: '#000000'
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
    animatedContainer: {
        borderRadius: 10,
        overflow: "hidden",
    },
    uploadButton: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    uploadButtonText: {
        color: "black",
        fontSize: 18,
        fontWeight: "bold",
        padding: 10
    },
    image: {
        width: 200,
        height: 200,
        resizeMode: "contain",
        margin: 5
    },
    error: {
        fontSize: 14,
        color: "red",
        marginTop: 10,
    },
});



export default ImageExplorer;
