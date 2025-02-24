import React, { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScreenName } from '../constants/screens';
import welcome from '../screen/welcome';
import Expense from '../screen/expense';
import GalleryScreen from '../screen/gallery';
import ChatGPTApp from '../screen/aiBot';
import ImageExplorer from '../screen/imageExplorer';
import FaceComparison from '../screen/faceComparison';
import TranslateScreen from '../screen/translate';
import ImageGeneration from '../screen/imageGeneration';


const Navigation = (item: any) => {

    const Stack = createNativeStackNavigator<any>();


    return (
        <>

            <Stack.Navigator
                screenOptions={{ headerShown: false, animation: 'fade' }}
                initialRouteName={ScreenName.WELCOME}
            >
                <Stack.Screen name={ScreenName.EXPENSE} component={Expense} />
                <Stack.Screen name={ScreenName.WELCOME} component={welcome} />
                <Stack.Screen name={ScreenName.GALLERY} component={GalleryScreen} />
                <Stack.Screen name={ScreenName.AI_BOT} component={ChatGPTApp} />
                <Stack.Screen name={ScreenName.IMAGE_EXPLORER} component={ImageExplorer} />
                <Stack.Screen name={ScreenName.FACE_COMPARISON} component={FaceComparison} />
                <Stack.Screen name={ScreenName.TRANSLATE} component={TranslateScreen} />
                <Stack.Screen name={ScreenName.IMAGE_GENERATION} component={ImageGeneration} />
            </Stack.Navigator>

        </>
    );
};
export default Navigation;
