import React from 'react';
import { StyleSheet, ScrollView, View, Text, Image } from 'react-native';
import FIcon from 'react-native-vector-icons/FontAwesome';
import Nunito from '../utils/fonts';

const AboutUsScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo_back.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Who Are We?</Text>
          <Text style={styles.bodyText}>
            Welcome to Brandmax, your ultimate mobile platform designed exclusively for the footwear industry. We are a B2B marketplace that brings together manufacturers, wholesalers, and retailers in one seamless digital ecosystem. With our user-friendly mobile app, we are transforming the way business is done in the footwear industry.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.quoteTitle}>
            "Connecting Businesses: Making B2B Commerce Effortless"
          </Text>
          <Text style={styles.bodyText}>
            At Brandmax, we understand the unique challenges and complexities of the footwear industry. That's why we have created a mobile app that simplifies the entire B2B commerce process — from connecting manufacturers with wholesalers to facilitating seamless transactions and streamlining inventory management.
          </Text>
          <Text style={styles.bodyText}>
            With Brandmax, you can expect a hassle-free, efficient, and secure B2B experience like never before.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.quoteTitle}>
            "Empowering Businesses: Boosting Sales and Growth"
          </Text>
          <Text style={styles.bodyText}>
            Our mission is to empower businesses to thrive in a competitive market. With Brandmax, you can easily showcase your products, reach a wider audience, increase sales, and grow faster.
          </Text>
          <Text style={styles.bodyText}>
            We provide a secure and reliable platform for transactions, ensuring your business information and data are always protected.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Ready to revolutionize your footwear business?
          </Text>
          <Text style={styles.bodyText}>
            Join Brandmax today and become part of our growing community of manufacturers, wholesalers, and retailers.
          </Text>

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <FIcon name="mobile" size={22} color="#D45500" />
              <Text style={styles.featureText}>Innovative & easy-to-use mobile app</Text>
            </View>
            <View style={styles.featureItem}>
              <FIcon name="headphones" size={20} color="#D45500" />
              <Text style={styles.featureText}>Dedicated personalized support</Text>
            </View>
            <View style={styles.featureItem}>
              <FIcon name="trophy" size={20} color="#D45500" />
              <Text style={styles.featureText}>Commitment to excellence in service</Text>
            </View>
            <View style={styles.featureItem}>
              <FIcon name="handshake-o" size={20} color="#D45500" />
              <Text style={styles.featureText}>Your trusted partner in the footwear industry</Text>
            </View>
          </View>

          <Text style={styles.closingText}>
            Experience the future of B2B commerce with Brandmax — your ultimate business growth solution. Sign up now and take your footwear business to new heights!
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Powered by innovation. Built for your success.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logoImage: {
    width: 280,
    height: 180,
    resizeMode: 'contain',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 21,
    fontFamily: 'Nunito-Bold',
    color: '#D45500',
    marginBottom: 12,
    textAlign: 'center',
  },
  quoteTitle: {
    fontSize: 19,
    fontFamily: 'Nunito-Bold',
    color: '#D45500',
    textAlign: 'center',
    marginVertical: 12,
    fontStyle: 'italic',
  },
  bodyText: {
    fontSize: 15.5,
    fontFamily: 'Nunito-Medium',
    color: '#444',
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 10,
  },
  featureList: {
    marginVertical: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
    paddingLeft: 4,
  },
  featureText: {
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    fontFamily: 'Nunito-Medium',
    color: '#333',
    lineHeight: 24,
  },
  closingText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#D45500',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 24,
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});