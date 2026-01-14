import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import FIcon from 'react-native-vector-icons/FontAwesome';

const TermsAndConditions = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.mainTitle}>Terms and Conditions</Text>

        <View style={styles.section}>
          <Text style={styles.introText}>
            By using Brandmax, you agree to our terms and conditions. Our agreement with you is straightforward and transparent, ensuring that you have a clear understanding of your rights and obligations. We have designed our terms and conditions to be fair, concise, and user-friendly. Please read them carefully before using our B2B commerce mobile application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Breaches and Suspensions: Maintaining a Secure Platform</Text>
          <Text style={styles.bodyText}>
            We take security seriously at Brandmax. Our B2B commerce mobile application has been built with robust security measures to protect your business. In the unlikely event of a breach or suspension, we will take swift action to rectify the issue.
          </Text>
          <View style={styles.bulletItem}>
            <FIcon name="shield" size={16} color="#D45500" />
            <Text style={styles.bulletText}>We continuously monitor transactions to identify potential problems</Text>
          </View>
          <View style={styles.bulletItem}>
            <FIcon name="shield" size={16} color="#D45500" />
            <Text style={styles.bulletText}>This helps us maintain a secure platform for your peace of mind</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transactions: Efficient and Streamlined</Text>
          <Text style={styles.bodyText}>
            Managing transactions in the industry can be complex and time-consuming. That's why we have designed our B2B commerce mobile application to be efficient and streamlined.
          </Text>
          <View style={styles.bulletItem}>
            <FIcon name="check-circle" size={16} color="#D45500" />
            <Text style={styles.bulletText}>Manage your inventory, orders, and payments with ease</Text>
          </View>
          <View style={styles.bulletItem}>
            <FIcon name="check-circle" size={16} color="#D45500" />
            <Text style={styles.bulletText}>Save time and money with quick, secure transactions</Text>
          </View>
          <View style={styles.bulletItem}>
            <FIcon name="check-circle" size={16} color="#D45500" />
            <Text style={styles.bulletText}>Enjoy a hassle-free experience</Text>
          </View>
          <Text style={styles.closingParagraph}>
            At Brandmax, we are committed to helping you grow your business. Our B2B commerce mobile application is designed specifically for the footwear industry, providing you with the tools you need to succeed. From our clear and concise terms and conditions to our robust security measures and efficient transactions, we are here to support you every step of the way. Join us today and take your business to new heights.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Last updated: January 2026
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default TermsAndConditions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  mainTitle: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',        
    color: '#D45500',
    textAlign: 'center',
    marginVertical: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  introText: {
    fontSize: 16,
    fontFamily: 'Nunito-Medium',      
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 8,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 19,
    fontFamily: 'Nunito-Bold',        
    color: '#D45500',
    marginBottom: 10,
    marginTop: 4,
  },
  bodyText: {
    fontSize: 15.5,
    fontFamily: 'Nunito-Medium',      
    color: '#444',
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 8,
  },
  closingParagraph: {
    fontSize: 15.5,
    fontFamily: 'Nunito-Medium',      
    color: '#444',
    lineHeight: 24,
    textAlign: 'justify',
    marginTop: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
    marginLeft: 4,
  },
  bulletText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15.5,
    fontFamily: 'Nunito-Medium',      
    color: '#444',
    lineHeight: 23,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',    
    color: '#888',
    fontStyle: 'italic',
  },
});