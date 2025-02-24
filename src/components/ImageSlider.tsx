import React from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions } from 'react-native';

const ImageSlider = ({ images }:any) => {
    const { width } = Dimensions.get('window');

    return (
        <View style={{
            height: Dimensions.get('window').width
        }}>
            <FlatList
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Image source={item} style={{
                        width: Dimensions.get('window').width,
                    }} resizeMode='contain' />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
   
    
});

export default ImageSlider;
