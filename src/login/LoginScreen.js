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
import Nunito from '../utils/fonts';

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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -70}
    >
      <StatusBar backgroundColor="#D45500" barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Orange Section with Logo */}
        <View style={styles.topContainer}>
          <Image
            source={require('../../assets/images/logo_back.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Bottom White Curved Card */}
        <View style={styles.bottomContainer}>
          <Text style={styles.title}>Enter your Mobile Number</Text>
          <Text style={styles.subtitle}>
            Please Enter your Mobile Number{'\n'}to Verify your Account
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your Email or Mobile"
              placeholderTextColor="#B0B0B0"
              value={userInput}
              onChangeText={setUserInput}
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="done"
              onSubmitEditing={handleVerify}
            />
          </View>

          {loading ? (
            <TouchableOpacity disabled style={styles.button}>
              <ActivityIndicator size="small" color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleVerify} style={styles.button}>
              <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>
          )}

          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleRegisterNavigation}>
              <Text style={styles.link}>Register</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 50 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F0EC',
  },
  scrollContent: {
    flexGrow: 1,
  },
  topContainer: {
    flex: 3,
    backgroundColor: '#F4F0EC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  logo: {
    width: '70%',
    height: windowHeight * 0.15,
  },
  bottomContainer: {
    flex: 2,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: Nunito.semiBold,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    fontFamily: Nunito.regular,
  },
  inputContainer: {
    width: windowWidth * 0.8,
    backgroundColor: '#F4F0EC',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 25,
  },
  input: {
    fontSize: 16,
    color: '#000',
    paddingVertical: 12,
    fontFamily: Nunito.regular,
  },
  button: {
    backgroundColor: '#D45500',
    width: windowWidth * 0.75,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Nunito.semiBold,
  },
  linkContainer: {
    flexDirection: 'row',
    marginTop: 25,
  },
  linkText: {
    fontSize: 16,
    color: '#000',
    fontFamily: Nunito.regular,
  },
  link: {
    fontSize: 16,
    color: '#D45500',
    fontWeight: '600',
    textDecorationLine: 'underline',
    fontFamily: Nunito.semiBold,
  },
});

export default LoginScreen;