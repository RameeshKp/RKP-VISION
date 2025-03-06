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
    ActivityIndicator,
} from 'react-native';
import { screenSize } from '../constants/screens';
import { Images } from '../constants/images';
import { Fonts } from '../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Buffer } from 'buffer';
import AnimatedButton from '../components/AnimatedButton';
import Config from 'react-native-config';


const ImageGeneration: React.FC = () => {
    const navigation: any = useNavigation();
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const handleGenerateImage = async () => {
        if (!prompt) return;
        setLoading(true);
        setError(null);

        try {
            const response: any = await axios.post(
                Config?.HUGGING_FACE_IMAGE_ENDPOINT as string,
                { inputs: prompt },
                { headers: { Authorization: `Bearer ${Config?.HUGGING_FACE_IMAGE_API_KEY}` }, responseType: "arraybuffer" }
            );
            const base64Image: any = `data:image/png;base64,${Buffer.from(response.data).toString("base64")}`;

            setImage(base64Image);
        } catch (err: any) {
            setError("Failed to generate image. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={Images.down} style={styles.backIcon} />
                </TouchableOpacity>
                <View style={styles.headerTitle}>
                    <Text style={styles.headerText}>Image Generation</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.heading}>Enter a description to generate an image:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Type a prompt..."
                    value={prompt}
                    onChangeText={setPrompt}
                />
                <AnimatedButton onPress={handleGenerateImage} />


                {error && <Text style={styles.error}>{error}</Text>}
                {image && !loading ? <Image source={{ uri: image }} style={styles.image} /> :
                    loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />
                }
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
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
    image: {
        width: 300,
        height: 300,
        marginTop: 20,
        borderRadius: 10,
        resizeMode: 'contain'
    },
});

export default ImageGeneration;