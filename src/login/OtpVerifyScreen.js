import React from 'react';
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
  TouchableOpacity
} from 'react-native';
import { OtpInput } from 'react-native-otp-entry';
import { setLoggedIn } from '../store/authSlice';
import { useDispatch } from 'react-redux';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const OtpVerifyScreen = () => {
  const dispatch = useDispatch();

  const handleLogin = () => {
    console.log("OTP Verified, dispatching logout ===>");
    
    dispatch(setLoggedIn(true));
    // Optional: Navigate to login screen
    // navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
       behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -70}
      >
      <StatusBar backgroundColor="#D45500" barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        <View style={styles.topContainer}>
          <Image
            source={require('../../assets/images/logo_back.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.bottomContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Verify Phone Number</Text>
      
            <OtpInput
              numberOfDigits={4}
              focusColor="#000"
              borderColor="#B0B0B0"
              onTextChange={(text) => console.log('OTP:', text)}
              onFilled={(text) => console.log('Complete OTP:', text)}
              textInputProps={{
                keyboardType: 'number-pad',
              }}
              theme={{
                containerStyle: styles.otpContainer,
                pinCodeContainerStyle: styles.pinContainer,
                pinCodeTextStyle: styles.pinText,
                focusStickStyle: styles.focusStick,
              }}
            />
      
            <TouchableOpacity onPress={handleLogin} style={styles.verifyButton}>
              <Text style={styles.verifyText}>Verify OTP</Text>
            </TouchableOpacity>
      
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive a code? </Text>
              <Text style={styles.resendLink1}>Resend OTP!</Text>
            </View>
      
            <TouchableOpacity style={styles.checkButton}>
              <Text style={styles.checkText}>Check Number?</Text>
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
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  topContainer: {
    maxHeight: windowHeight / 1.9,
    backgroundColor: '#F5EBE8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '75%',
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingBottom: 40,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
    color: '#000',
  },
  otpContainer: {
    justifyContent: 'space-between',
    width: '70%',
    marginBottom: 40,
  },
  pinContainer: {
    width: 55,
    height: 55,
    borderWidth: 2,
    borderColor: '#B0B0B0',
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinText: {
    fontSize: 22,
    color: '#000',
    fontWeight: 'bold',
  },
  focusStick: {
    backgroundColor: '#000',
  },
  verifyButton: {
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#D45500',
    width: windowWidth * 0.75,
  },
  verifyText: {
    fontSize: 20,
    color: '#fff',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
  },
  resendText: {
    fontSize: 18,
  },
  resendLink: {
    fontSize: 18,
    color: '#D45500',
    fontWeight: '600',
  },
  resendLink1: {
    textDecorationLine: 'underline',
    fontSize: 18,
    color: '#D45500',
    fontWeight: '600',
  },
  checkButton: {
    alignItems: 'center',
    marginTop: 30,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#D45500',
    width: 'auto',
  },
  checkText: {
    fontSize: 17,
    color: '#fff',
  },
});

export default OtpVerifyScreen;