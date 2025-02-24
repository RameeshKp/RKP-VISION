import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    Image,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { screenSize } from '../constants/screens';
import { Images } from '../constants/images';
import { Fonts } from '../constants/fonts';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { compareFaces } from '../services/geminiService';
import axios from 'axios';
import ImageResizer from 'react-native-image-resizer';

const FaceComparison: React.FC = () => {
    const navigation: any = useNavigation();

    const [image1, setImage1] = useState<any>(null);
    const [image2, setImage2] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [matchPercentage, setMatchPercentage] = useState<number | null>(null);
    const [babyImage, setBabyImage] = useState<string | null>(null);

    const YOUR_FACE_API_KEY = 'H7NEi0SQZdOfzTnvkSG5nGR1Z-awpahc';
    const YOUR_FACE_API_SECRET = 'W_bIL8hNls2Sa44c_2RhnJITgVQVI2x9';

    const compressImage = async (uri: string) => {
        try {
            const resizedImage = await ImageResizer.createResizedImage(uri, 800, 800, 'JPEG', 80);
            return resizedImage.uri;
        } catch (error) {
            console.error('Image compression error:', error);
            Alert.alert('Image compression failed');
            return uri;
        }
    };

    const pickImage = async (setImage: React.Dispatch<React.SetStateAction<any>>) => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            includeBase64: true,
        });

        if (!result.didCancel && result.assets) {
            const selectedImage = result.assets[0];
            const compressedUri = await compressImage(selectedImage.uri || '');

            setImage({ ...selectedImage, uri: compressedUri });
        }
    };

    const handleCompareFaces = async () => {
        if (!image1 || !image2) {
            Alert.alert('Please upload both images');
            return;
        }
        setLoading(true);
        try {
            const confidence = await compareFaces(image1.base64, image2.base64);
            setMatchPercentage(confidence);
        } catch (error) {
            Alert.alert('Failed to compare faces');
        } finally {
            setLoading(false);
        }
    };

    const generateBabyFace = async () => {
        if (!image1 || !image2) {
            Alert.alert('Please upload both images');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                'https://api-us.faceplusplus.com/imagepp/v1/mergeface',
                new URLSearchParams({
                    api_key: YOUR_FACE_API_KEY,
                    api_secret: YOUR_FACE_API_SECRET,
                    template_base64: image1.base64,
                    merge_base64: image2.base64,
                    merge_rate: '50',
                }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );
            if (response.data.result) {
                setBabyImage(`data:image/jpeg;base64,${response.data.result}`);
            } else {
                Alert.alert('Failed to generate  image');
            }
        } catch (error) {
            Alert.alert('Error generating  face');
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
                    <Text style={styles.headerText}>Face Comparison</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={{
                    flexDirection: 'row',
                    width: screenSize.width - 40,
                    flexWrap: 'wrap',
                }}>
                    <View style={{ width: "50%", justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setImage1)}>
                            <Text style={styles.buttonText}>{"Upload " + "\n" + " First Face"}</Text>
                        </TouchableOpacity>
                        {image1 && <Image source={{ uri: image1.uri }} style={styles.uploadedImage} />}
                    </View>
                    <View style={{ width: "50%", justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setImage2)}>
                            <Text style={styles.buttonText}>{"Upload " + "\n" + "Second Face"}</Text>
                        </TouchableOpacity>
                        {image2 && <Image source={{ uri: image2.uri }} style={styles.uploadedImage} />}

                    </View>


                </View>


                <TouchableOpacity style={styles.actionButton} onPress={handleCompareFaces} >
                    <Text style={styles.buttonText}>Compare Faces</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={generateBabyFace}>
                    <Text style={styles.buttonText}>Merge Faces</Text>
                </TouchableOpacity>


                {loading && <ActivityIndicator size="large" />}

                {matchPercentage !== null && (
                    <Text style={styles.resultText}>Match Percentage: {matchPercentage?.toFixed(2)}%</Text>
                )}

                {babyImage && <Image source={{ uri: babyImage }} style={styles.babyImage} />}
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        flexDirection: 'row',
    },
    backIcon: {
        height: 13,
        width: 21,
        resizeMode: 'contain',
        transform: [{ rotate: '90deg' }],
    },
    headerTitle: {
        width: screenSize.width - 61,
        alignItems: 'center',
    },
    headerText: {
        fontFamily: Fonts.semiBold_SF,
        color: '#000000',
        fontSize: 20,
        textTransform: 'uppercase',
    },
    scrollContent: {
        padding: 20,
        alignItems: 'center',
    },
    resultText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
    },
    babyImage: {
        width: 300,
        height: 300,
        marginTop: 20,
        borderRadius: 10,
    },
    uploadButton: {
        backgroundColor: '#6200EE',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    actionButton: {
        backgroundColor: '#03DAC6',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    uploadedImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginTop: 10,
    },
});

export default FaceComparison;
