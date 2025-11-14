import React from 'react';
import {StyleSheet, ScrollView, Image, Text, View} from 'react-native';
import poppins from '../utils/fonts';
import FIcon from 'react-native-vector-icons/FontAwesome';

const AboutUsScreen = () => {
  return (
    <View style={styles.AboutContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={require('../../assets/images/logo_back.png')} style={styles.logoImage} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.ContentHeader}>Who are We?</Text>
          <Text style={styles.contentText}>
            Welcome to Brandmax, your ultimate mobile platform designed
            exclusively for the footwear industry. We are a B2B marketplace that
            brings together manufacturers, wholesalers, and retailers in one
            seamless digital ecosystem. With our user-friendly mobile app, we
            are transforming the way business is done in the footwear industry.
          </Text>
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image source={require('../../assets/images/logo_back.png')} style={styles.logoImage} />
          </View>
          <Text style={styles.ContentHeader}>
            "Connecting Businesses: Making B2B Commerce Effortless "
          </Text>
          <Text style={styles.contentText}>
            At Brandmax, we understand the unique challenges and complexities of
            the industry. That's why we have created a mobile app that
            simplifies the entire B2B commerce process. From connecting
            manufacturers with wholesalers to facilitating seamless
            transactions, and streamlining inventory management, our platform is
            tailored to the needs of the industry. With Brandmax, you can expect
            a hassle-free and efficient B2B commerce experience like never
            before.
          </Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.ContentHeader}>
            "Empowering Businesses: Boosting Sales and Growth"
          </Text>
          <Text style={styles.contentText}>
            Our mission at Brandmax is to empower businesses to thrive in the
            competitive industry. With our mobile app, you can easily showcase
            your products, reach a wider audience, and increase your sales. We
            provide a secure and reliable platform for transactions, ensuring
            that your business information and data are protected
          </Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.ContentHeader}>
            Are you ready to revolutionize your B2B commerce experience in the
            footwear industry?
          </Text>
          <Text style={styles.contentText}>
            Join Brandmax today and be a part of our growing community of
            manufacturers, wholesalers, and retailers.
          </Text>
          <Text style={styles.contentText}>
            <FIcon name={'mobile'} size={18} color={'red'} />
            Innovative mobile app
          </Text>
          <Text style={styles.contentText}>
            <FIcon name={'support'} size={18} color={'red'} />
            Personalised support
          </Text>
          <Text style={styles.contentText}>
            <FIcon name={'excellence'} size={18} color={'red'} />
            Commitment to excellence
          </Text>
          <Text style={styles.contentText}>
            <FIcon name={'sneaker'} size={18} color={'red'} />
            Trusted partner for the footwear industry
          </Text>
          <Text style={styles.contentText}>
            Experience the future of B2B commerce with Brandmax - your ultimate
            business solution. Sign up now and take your fashion business to new
            heights!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
  AboutContainer: {flex: 1, backgroundColor: "#fff", padding: 10},
  imageContainer: {alignItems: 'center', marginVertical: 50},
  logoImage: {width: 300, height: 200, resizeMode: 'contain'},
  contentContainer: {marginVertical: 5},
  ContentHeader: {
    fontSize: 20,
    fontFamily: poppins.semiBold,
    color: 'red',
  },
  contentImage: {width: '50%', height: 200},
  contentText: {
    fontSize: 15,
    fontFamily: poppins.semiBold,
    textAlign: 'justify',
    marginVertical: 20,
    color: '#000',
  },
});
