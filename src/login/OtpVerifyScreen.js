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
  ActivityIndicator,
} from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { setLoggedIn, setGuestUser } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import fetchData from '../config/fetchData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import showToast from '../utils/common_fn';
import Nunito from '../utils/fonts';

const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

const OtpVerifyScreen = ({ route, navigation }) => {
  const { userInput } = route.params;
  const dispatch = useDispatch();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!otp || otp.length !== 4) {
      showToast('Please enter a valid 4-digit OTP');
      return;
    }

    setLoading(true);

    const payload = {
      user: userInput,
      otp: Number(otp),
    };

    try {
      const response = await fetchData.OTPVerify(payload);

      if (response.success || response.data) {
        const token = response.data?.token || response.token;
        await AsyncStorage.setItem('token', token);

        const userData = response.data?.user || response.data;
        await AsyncStorage.setItem('UserData', JSON.stringify(userData));
        await AsyncStorage.setItem('isGuestUser', 'false');

        showToast('Login successful!');

        dispatch(setGuestUser(false));
        dispatch(setLoggedIn(true));
      } else {
        showToast(response.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        'Something went wrong. Please try again.';
      showToast(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckNumber = () => {
    navigation.goBack();
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
        <View style={styles.topContainer}>
          <Image
            source={require('../../assets/images/logo_back.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.bottomContainer}>
          <Text style={styles.title}>Verify Phone Number</Text>
          <Text style={styles.subtitle}>
            Please Enter the OTP sent to{'\n'}
            {userInput}
          </Text>

          <OtpInput
            numberOfDigits={4}
            focusColor="#D45500"
            onTextChange={(text) => setOtp(text)}
            onFilled={(text) => setOtp(text)}
            theme={{
              containerStyle: styles.otpContainer,
              pinCodeContainerStyle: styles.pinCodeContainer,
              pinCodeTextStyle: styles.pinCodeText,
              focusStickStyle: styles.focusStick,
            }}
          />

          {loading ? (
            <TouchableOpacity disabled style={styles.button}>
              <ActivityIndicator size="small" color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
          )}

          <View style={styles.linkContainer}>
            <Text style={styles.linkText}>Didn't receive a code? </Text>
            <TouchableOpacity>
              <Text style={styles.link}>Resend OTP</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleCheckNumber} style={styles.checkButton}>
            <Text style={styles.link}>Check Number?</Text>
          </TouchableOpacity>

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
  otpContainer: {
    width: windowWidth * 0.7,
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  pinCodeContainer: {
    width: 55,
    height: 55,
    borderWidth: 2,
    borderColor: '#B0B0B0',
    borderRadius: 10,
    backgroundColor: '#F4F0EC',
  },
  pinCodeText: {
    fontSize: 22,
    color: '#000',
    fontWeight: 'bold',
    fontFamily: Nunito.bold,
  },
  focusStick: {
    backgroundColor: '#D45500',
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
  checkButton: {
    marginTop: 15,
  },
});

export default OtpVerifyScreen;