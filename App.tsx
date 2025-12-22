import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import store from './src/store';
import AuthNavigator from './src/navigation/AuthNavigator';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import CustomerSupportButton from './src/screens/CustomerSupportButton';
import { setLoggedIn, setGuestUser } from './src/store/authSlice';

export const navigationRef = createNavigationContainerRef();

function MainApp() {
  const [loading, setLoading] = useState(true);
  const [currentRoute, setCurrentRoute] = useState<string | undefined>();

  const loggedIn = useSelector((state: any) => state.auth.loggedIn);
  const isGuestUser = useSelector((state: any) => state.auth.isGuestUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const guestUserValue = await AsyncStorage.getItem('isGuestUser');
        if (token && token !== 'null' && token !== 'undefined') {
          dispatch(setLoggedIn(true));
          dispatch(setGuestUser(false));
        } else if (guestUserValue === 'true') {
          dispatch(setGuestUser(true));
          dispatch(setLoggedIn(false));
        } else {
          dispatch(setLoggedIn(false));
          dispatch(setGuestUser(false));
        }
      } catch (error) {
        console.log('❌ Initialization error:', error);
        dispatch(setLoggedIn(false));
        dispatch(setGuestUser(false));
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  useEffect(() => {
    console.log('🔄 Auth State Changed:');
    console.log('   - loggedIn:', loggedIn);
    console.log('   - isGuestUser:', isGuestUser);
  }, [loggedIn, isGuestUser]);

  if (loading) {
    return <SplashScreen />;
  }

  console.log('🎯 Rendering Navigator:');
  console.log('   - loggedIn:', loggedIn);
  console.log('   - isGuestUser:', isGuestUser);

  const getNavigatorKey = () => {
    if (loggedIn) return 'logged-in';
    if (isGuestUser) return 'guest';
    return 'auth';
  };

  return (
    <>
      <NavigationContainer
        ref={navigationRef}
        key={getNavigatorKey()} 
        onReady={() => {
          const route = navigationRef.getCurrentRoute();
          setCurrentRoute(route?.name);
          console.log('📍 Initial Route:', route?.name);
        }}
        onStateChange={() => {
          if (navigationRef.isReady()) {
            const route = navigationRef.getCurrentRoute();
            setCurrentRoute(route?.name);
            console.log('📍 Current Route:', route?.name);
          }
        }}
      >
        {loggedIn || isGuestUser ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>

      {currentRoute !== 'TrackPayments' && <CustomerSupportButton />}
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar backgroundColor="#F58502" barStyle="light-content" />
      <Provider store={store}>
        <MainApp />
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});