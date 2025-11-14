/**
 * App Entry Point
 * Updated: November 10, 2025
 */

import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useSelector } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import store from './src/store';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';

const { height } = Dimensions.get('window');

const Color = {
  primary: '#E11D38',
  logoBackground: '#F8F8F8',
  white: '#FFFFFF',
  black: '#000000',
  cloudyGrey: '#9E9E9E',
};

const Inter = {
  Bold: 'Poppins-Bold',
  SemiBold: 'Poppins-SemiBold',
  Medium: 'Poppins-Medium',
};

function MainApp() {
  const [loading, setLoading] = React.useState(true);
  const loggedIn = useSelector((state: any) => state.auth.loggedIn);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {loggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  console.log("App Component called ===>");
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar backgroundColor="#F58502" barStyle="light-content" />
      <Provider store={store}>
        <MainApp />
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Color.logoBackground },
  LoginContainer: { flex: 1, backgroundColor: Color.logoBackground },
  logoView: {
    height: height / 2,
    backgroundColor: Color.logoBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
});