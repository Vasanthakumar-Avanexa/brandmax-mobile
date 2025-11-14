import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import React from 'react';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      <Image
        source={require('../../assets/images/logo_back.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F0EC', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    backgroundColor: '#F4F0EC',
    width: '75%',
  },
});

export default SplashScreen;
