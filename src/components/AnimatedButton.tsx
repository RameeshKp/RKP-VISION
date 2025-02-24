import React, { useState, useRef } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, Animated, ActivityIndicator, StyleSheet } from "react-native";

const AnimatedButton = ({ onPress }: any) => {
    const scaleValue = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.9, // Shrink effect
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1, // Back to normal size
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start(() => onPress && onPress());
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <TouchableOpacity
                style={styles.button}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Text style={styles.buttonText}>Generate Image</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "blue",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default AnimatedButton;
