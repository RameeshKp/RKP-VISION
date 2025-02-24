import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, Alert, SafeAreaView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import { screenSize } from '../constants/screens';
import { useNavigation } from '@react-navigation/native';
import { Images } from '../constants/images';
import { Fonts } from '../constants/fonts';

type ImageItem = {
    uri: string;
    id: string;
};

const GalleryScreen: React.FC = () => {
    const navigation: any = useNavigation();

    const [images, setImages] = useState<ImageItem[]>([]);

    // Function to handle image upload
    const handleUploadImage = () => {
        const options: any = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        launchImageLibrary(options, (response: any) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const newImage = {
                    uri: response.assets[0].uri!,
                    id: Date.now().toString(),
                };
                setImages((prevImages) => [...prevImages, newImage]);
            }
        });
    };

    // Function to handle image deletion
    const handleDeleteImage = (id: string) => {
        Alert.alert(
            'Delete Image',
            'Are you sure you want to delete this image?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    onPress: () => {
                        setImages((prevImages) => prevImages.filter((image) => image.id !== id));
                    },
                },
            ],
            { cancelable: true }
        );
    };

    // Render each image item
    const renderImageItem = ({ item }: { item: ImageItem }) => (
        <View style={styles.imageContainer}>
            <Image source={{ uri: item.uri }} style={styles.image} />
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteImage(item.id)}
            >
                <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={{
                padding: 20,
                width: screenSize.width,
                justifyContent: 'flex-start',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderBottomColor: 'grey',
                flexDirection: 'row'
            }}>
                <TouchableOpacity
                    style={{
                    }}
                    onPress={() => navigation.goBack()}>
                    <Image
                        source={Images.down}
                        style={{
                            height: 13,
                            width: 21,
                            resizeMode: 'contain',
                            transform: [{ rotate: '90deg' }],
                        }}
                    />

                </TouchableOpacity>
                <View style={{
                    width: screenSize.width - 61,
                    alignItems: 'center',
                }}>
                    <Text style={{
                        fontFamily: Fonts.semiBold_SF,
                        color: '#000000',
                        fontSize: 20,
                        textTransform: 'uppercase'
                    }}>Gallery </Text>
                </View>
            </View>
            <View style={{
                padding: 15
            }}>
                <TouchableOpacity style={styles.uploadButton} onPress={handleUploadImage}>
                    <Text style={styles.uploadButtonText}>Upload Image</Text>
                </TouchableOpacity>

                {/* Image Gallery */}
                <FlatList
                    data={images}
                    renderItem={renderImageItem}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    contentContainerStyle={styles.galleryContainer}
                />

            </View>
            {/* Upload Button */}

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    uploadButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 16
    },
    uploadButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    galleryContainer: {
        justifyContent: 'space-between',
        paddingBottom: 120
    },
    imageContainer: {
        flex: 1,
        margin: 4,
        alignItems: 'center',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 8,
    },
    deleteButton: {
        marginTop: 8,
        backgroundColor: '#ff4444',
        padding: 8,
        borderRadius: 4,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default GalleryScreen;