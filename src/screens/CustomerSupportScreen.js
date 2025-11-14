import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Image, Alert } from 'react-native';
import { Button, Divider } from 'react-native-elements';
import poppins from '../utils/fonts'; 

const COLORS = {
  white: '#ffffff',
  primary: '#D45500',
  black: '#000000',
  border: '#ddd',
  placeholder: '#888',
};

const LOGO = require('../../assets/images/logo_back.png'); 

const CustomerSupportScreen = () => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    Alert.alert('Success', 'Your message has been sent!');
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />
      </View>

      <Divider style={styles.divider} />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Contact Us</Text>

        <TextInput
          placeholder="Type your message here..."
          placeholderTextColor={COLORS.placeholder}
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          style={styles.textInput}
        />

        <Button
          title="Send Message"
          onPress={handleSend}
          buttonStyle={styles.sendButton}
          titleStyle={styles.sendButtonText}
          containerStyle={styles.buttonContainer}
        />
      </View>
    </View>
  );
};

export default CustomerSupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 15,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 280,
    height: 180,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  formContainer: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 26,
    fontFamily: poppins.semiBold,
    color: COLORS.black,
    textAlign: 'center',
    marginVertical: 20,
  },
  textInput: {
    height: 140,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.black,
    backgroundColor: '#fdfdfd',
    marginVertical: 12,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 14,
  },
  sendButtonText: {
    fontFamily: poppins.semiBold,
    fontSize: 16,
  },
});