import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView, TouchableOpacity, BackHandler, ScrollView } from 'react-native';
import { Images } from '../constants/images';
import { ScreenName, screenSize } from '../constants/screens';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../constants/fonts';
import LottieView from 'lottie-react-native';
import Animated from 'react-native-reanimated';
import { FadeIn, FadeInUp, FadeInDown } from 'react-native-reanimated';
const { width } = Dimensions.get('window');

const WelcomeScreen = () => {
    const navigation: any = useNavigation();



    return (
        <SafeAreaView style={styles.container}>
            {/* Lottie Animated Background */}
            <LottieView
                source={require('../assets/animation/animatedBackground.json')} // Place Lottie file in assets folder
                autoPlay
                loop
                style={styles.lottieBackground}
            />

            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => BackHandler.exitApp()}>
                    <Image source={Images.home} style={styles.backIcon} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Animated.Text entering={FadeInUp.duration(1800)} style={styles.headerTitle}>
                        Welcome
                    </Animated.Text>
                </View>
            </View>
            <ScrollView
                bounces={false}
                contentContainerStyle={styles.scrollContainer}>
                <View style={styles.gridContainer}>
                    {menuItems.map((item, index) => (
                        <Animated.View
                            key={index}
                            entering={FadeIn.delay(index * 200).duration(1800)}
                            style={[styles.menuItem, index >= 2 && { marginTop: 20 }]}>
                            <TouchableOpacity
                                onPress={() => navigation.navigate(item.screen)}>
                                <Image source={item.image} style={styles.menuImage} />
                                <Animated.Text entering={FadeInDown.duration(4800)} style={styles.menuText}>
                                    {item.label}
                                </Animated.Text>
                            </TouchableOpacity>
                        </Animated.View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const menuItems = [
    { label: 'RKP Genie', image: Images.chatbot, screen: ScreenName.AI_BOT },
    { label: 'Face Comparison', image: Images.face, screen: ScreenName.FACE_COMPARISON },
    { label: 'Image Explorer', image: Images.imageDescriber, screen: ScreenName.IMAGE_EXPLORER },
    { label: 'Image Generation', image: Images.imageGeneration, screen: ScreenName.IMAGE_GENERATION },
    { label: 'Translate', image: Images.translator, screen: ScreenName.TRANSLATE },
    { label: 'My Expense', image: Images.myExpense, screen: ScreenName.EXPENSE },
    { label: 'Gallery', image: Images.myPhotos, screen: ScreenName.GALLERY },
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    lottieBackground: {
        position: 'absolute',
        width: '100%',
        height: "100%",
    },
    headerContainer: {
        padding: 20,
        width: screenSize.width,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        flexDirection: 'row',
    },
    backIcon: {
        height: 25,
        width: 25,
        resizeMode: 'contain',
        position: 'absolute',
        top: -15,
    },
    headerTitleContainer: {
        width: screenSize.width - 40,
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: Fonts.semiBold_SF,
        color: '#000000',
        fontSize: 20,
        textTransform: 'uppercase',
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    menuItem: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'grey',
        borderWidth: 1,
        width: (screenSize.width - 50) / 2,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#cacdcf',
    },
    menuImage: {
        width: (screenSize.width - 90) / 2,
        height: (screenSize.width - 90) / 2,
        borderRadius: 8,
    },
    menuText: {
        fontFamily: Fonts.semiBold_SF,
        fontSize: 15,
        color: '#525557',
        marginTop: 10,
    },
});

export default WelcomeScreen;