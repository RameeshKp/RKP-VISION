import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    SafeAreaView,
    TouchableOpacity,
    BackHandler,
    ScrollView,
    Animated
} from 'react-native';
import { Images } from '../constants/images';
import { ScreenName, screenSize } from '../constants/screens';
import { useNavigation } from '@react-navigation/native';
import { Fonts } from '../constants/fonts';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

// Animated Gradient Background Component
const AnimatedGradientBackground = ({ children }: any) => {
    const colorAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(colorAnimation, {
                    toValue: 1,
                    duration: 5000,
                    useNativeDriver: false, // ✅ Use false because colors can't be animated natively
                }),
                Animated.timing(colorAnimation, {
                    toValue: 0,
                    duration: 5000,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, [colorAnimation]);

    // Convert hex colors to interpolated RGB values
    const backgroundColor = colorAnimation.interpolate({
        inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1], // Expanding the range
        outputRange: [
            'rgb(255,0,0)',    // Red
            'rgb(255,165,0)',  // Orange
            'rgb(255,255,0)',  // Yellow
            'rgb(0,255,0)',    // Green
            'rgb(0,0,255)',    // Blue
            'rgb(128,0,128)'   // Purple
        ],
    });

    return (
        <Animated.View style={[styles.gradientBackground, { backgroundColor }]}>
            {/* <LinearGradient
                colors={["orange", "red"]}
                style={styles.gradientBackground}
            >
                {children}
            </LinearGradient> */}
            {children}
        </Animated.View>
    );
};


const WelcomeScreen = () => {
    const navigation: any = useNavigation();

    return (
        <AnimatedGradientBackground>
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => BackHandler.exitApp()}>
                    <Image source={Images.home} style={styles.backIcon} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Welcome</Text>
                </View>
            </View>
            <ScrollView
                bounces={false}
                contentContainerStyle={styles.scrollContainer}>
                <View style={styles.gridContainer}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.menuItem, index >= 2 && { marginTop: 20 }]}
                            onPress={() => navigation.navigate(item?.screen)}
                        >
                            <Image source={item.image} style={styles.menuImage} />
                            <Text style={styles.menuText}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
        </AnimatedGradientBackground>
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
    },
    gradientBackground: {
        flex: 1,
    },
    headerContainer: {
        padding: 20,
        width: screenSize.width,
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        flexDirection: 'row'
    },
    backIcon: {
        height: 25,
        width: 25,
        resizeMode: 'contain',
        position: 'absolute',
        top: -15,
        tintColor: '#FFFFFF'
    },
    headerTitleContainer: {
        width: screenSize.width - 40,
        alignItems: 'center',
    },
    headerTitle: {
        fontFamily: Fonts.semiBold_SF,
        color: '#ffffff',
        fontSize: 20,
        textTransform: 'uppercase'
    },
    scrollContainer: {
        flexGrow: 1,
        padding: 20,
    },
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
    },
    menuItem: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'grey',
        borderWidth: 1,
        width: (screenSize.width - 50) / 2,
        padding: 10,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.2)' // Transparent effect
    },
    menuImage: {
        width: (screenSize.width - 90) / 2,
        height: (screenSize.width - 90) / 2,
        borderRadius: 8
    },
    menuText: {
        fontFamily: Fonts.semiBold_SF,
        fontSize: 15,
        color: '#ffffff',
        marginTop: 10
    }
});

export default WelcomeScreen;
