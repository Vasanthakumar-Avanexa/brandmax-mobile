// import React from 'react';
// import { View, Text, Button, TouchableOpacity } from 'react-native';
// import { useDispatch } from 'react-redux';
// import { setLoggedIn } from '../store/authSlice';
// import { useNavigation } from '@react-navigation/native';

// const LoginScreen = () => {
//   const navigation=useNavigation();
//   console.log("LoginScreen Component called ===>");

//   const handleLogin = () => {
//     console.log("Login button pressed ===>");
    
//     navigation.navigate('OtpVerify');
//   };
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Login Screen</Text>
//       <TouchableOpacity onPress={handleLogin}><Text>hello login button</Text></TouchableOpacity>
//     </View>
//   );
// };
// export default LoginScreen;

import { useNavigation } from '@react-navigation/native';
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
  TouchableOpacity,
  TextInput,
} from 'react-native';

const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();

  const handleLogin = () => {
    console.log("Login button pressed ===>");
    
    navigation.navigate('OtpVerify');
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -70}>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled">

        <View style={styles.topContainer}>
          <Image
            source={require('../../assets/images/logo_back.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.bottomContainer}>
          <Text style={styles.title}>Enter your Mobile Number</Text>

         <Text style={styles.title1}>Please Enter your Mobile Number to Verify your Account</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.prefix}>+91</Text>
            <View style={styles.line} />
            <TextInput
              style={styles.input}
              placeholder="Enter your mobile number"
              placeholderTextColor="#B0B0B0"
              keyboardType="numeric"
              maxLength={10}
              returnKeyType="done"
            />
          </View>

          <TouchableOpacity onPress={handleLogin} style={styles.verifyButton}>
            <Text style={styles.verifyText}>Verify</Text>
          </TouchableOpacity>
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
  },
   title1: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
    color: '#B0B0B0',
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
  prefix: {
    fontSize: 16,
    color: '#000',
    marginRight: 8,
  },
  line: {
    width: 1,
    height: 20,
    backgroundColor: 'grey',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 10,
    paddingLeft: 10,
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
  },
});

export default LoginScreen;
	