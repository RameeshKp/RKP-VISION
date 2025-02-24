import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import Navigation from './src/navigation';
import { NavigationContainer } from '@react-navigation/native';
import { Animated } from 'react-native';

const App: React.FC = () => {
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    setTimeout(() => {
      SplashScreen?.hide();
    }, 1000);
  }, []);



  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
};

export default App;