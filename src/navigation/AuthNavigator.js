import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import LoginScreen from '../login/LoginScreen';
import OtpVerifyScreen from '../login/OtpVerifyScreen';
import Home from '../screens/Home';
import RequestRegister from '../login/Register';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <>
      <StatusBar backgroundColor="#F58502" barStyle="light-content" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="RequestRegister" component={RequestRegister} />
        <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </>
  );
}
