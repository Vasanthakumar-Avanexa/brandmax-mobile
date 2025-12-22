import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import fetchData from '../config/fetchData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import showToast from '../utils/common_fn';
import poppins from '../utils/fonts';

const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    const trimmedInput = userInput.trim();

    if (!trimmedInput) {
      showToast('Please enter your mobile number or email');
      return;
    }

    setLoading(true);

    const payload = { user: trimmedInput };

    try {
      const response = await fetchData.Logins(payload);

      console.log('Login API Response:', response);

      if (response.success || response.data) {
        await AsyncStorage.setItem('UserData', JSON.stringify(response.data));
        showToast('OTP sent successfully!');
        navigation.navigate('OtpVerify', { userInput: trimmedInput });
      } else {
        showToast(response.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      console.error('Login Error:', err.response?.data || err.message);
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        'Network error. Please check your connection and try again.';
      showToast(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterNavigation = () => {
    navigation.navigate('RequestRegister');
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -70}
    >
      <StatusBar backgroundColor="#D45500" barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.topContainer}>
          <Image
            source={require('../../assets/images/logo_back.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.bottomContainer}>
          <Text style={styles.title}>Enter your Mobile Number</Text>
          <Text style={styles.title1}>
            Please Enter your Mobile Number to Verify your Account
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your Email or Mobile"
              placeholderTextColor="#B0B0B0"
              returnKeyType="done"
              value={userInput}
              onChangeText={setUserInput}
              autoCapitalize="none"
              keyboardType="default"
              onSubmitEditing={handleVerify}
            />
          </View>

          {loading ? (
            <TouchableOpacity disabled style={styles.verifyButton}>
              <ActivityIndicator size="small" color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleVerify} style={styles.verifyButton}>
              <Text style={styles.verifyText}>Verify</Text>
            </TouchableOpacity>
          )}

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleRegisterNavigation}>
              <Text style={styles.registerLink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: '#F4F0EC',
  },
  topContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  logo: {
    width: '75%',
    height: windowHeight * 0.25,
  },
  bottomContainer: {
    flex: 2,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
    color: '#000',
    fontFamily: poppins.semiBold,
  },
  title1: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
    color: '#B0B0B0',
    fontFamily: poppins.semiBold,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F0EC',
    borderRadius: 10,
    width: windowWidth * 0.8,
    paddingHorizontal: 12,
    marginBottom: 25,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 10,
    paddingLeft: 10,
    fontFamily: poppins.regular,
  },
  verifyButton: {
    backgroundColor: '#D45500',
    width: windowWidth * 0.75,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  verifyText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    fontFamily: poppins.semiBold,
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  registerText: {
    fontSize: 16,
    color: '#000',
    fontFamily: poppins.regular,
  },
  registerLink: {
    fontSize: 16,
    color: '#D45500',
    fontWeight: '600',
    textDecorationLine: 'underline',
    fontFamily: poppins.semiBold,
  },
});

export default LoginScreen;