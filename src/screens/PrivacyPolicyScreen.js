import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import FIcon from 'react-native-vector-icons/FontAwesome';
import Nunito from '../utils/fonts';

const PrivacyPolicyScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.mainTitle}>Privacy Policy</Text>

        <View style={styles.section}>
          <Text style={styles.introText}>
            At Brandmax, we understand the importance of privacy and are committed to protecting your personal information while empowering your business. Our Privacy Policy outlines our data collection practices and the measures we take to ensure your information is secure.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Collection of Information</Text>
          <Text style={styles.bodyText}>
            We only collect the information necessary to provide you with our services and improve your experience on our platform. This includes:
          </Text>
          <View style={styles.bulletItem}>
            <FIcon name="circle" size={8} color="#D45500" />
            <Text style={styles.bulletText}>Your name and contact information</Text>
          </View>
          <View style={styles.bulletItem}>
            <FIcon name="circle" size={8} color="#D45500" />
            <Text style={styles.bulletText}>Business details (company name, GST, address)</Text>
          </View>
          <Text style={styles.bodyText}>
            We do not collect sensitive financial data without your explicit consent.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Use of Your Data</Text>
          <Text style={styles.bodyText}>
            We use your information to:
          </Text>
          <View style={styles.bulletItem}>
            <FIcon name="check" size={14} color="#D45500" />
            <Text style={styles.bulletText}>Provide seamless B2B commerce services</Text>
          </View>
          <View style={styles.bulletItem}>
            <FIcon name="check" size={14} color="#D45500" />
            <Text style={styles.bulletText}>Offer personalized product recommendations</Text>
          </View>
          <View style={styles.bulletItem}>
            <FIcon name="check" size={14} color="#D45500" />
            <Text style={styles.bulletText}>Improve platform functionality and user experience</Text>
          </View>
          <View style={styles.bulletItem}>
            <FIcon name="check" size={14} color="#D45500" />
            <Text style={styles.bulletText}>Analyze market trends to help you make better business decisions</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Use of Cookies</Text>
          <Text style={styles.bodyText}>
            We use cookies to enhance your experience on our platform. Cookies help us:
          </Text>
          <View style={styles.subBulletItem}>
            <FIcon name="angle-right" size={14} color="#D45500" />
            <Text style={styles.subBulletText}>Remember your preferences</Text>
          </View>
          <View style={styles.subBulletItem}>
            <FIcon name="angle-right" size={14} color="#D45500" />
            <Text style={styles.subBulletText}>Optimize performance and loading speed</Text>
          </View>
          <View style={styles.subBulletItem}>
            <FIcon name="angle-right" size={14} color="#D45500" />
            <Text style={styles.subBulletText}>Provide personalized content and recommendations</Text>
          </View>
          <Text style={styles.bodyText}>
            You can manage or disable cookies anytime through your account settings.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Measures</Text>
          <Text style={styles.bodyText}>
            We take data security very seriously and have implemented industry-standard measures:
          </Text>
          <View style={styles.bulletItem}>
            <FIcon name="lock" size={16} color="#D45500" />
            <Text style={styles.bulletText}>Encrypted data storage and transmission (SSL/TLS)</Text>
          </View>
          <View style={styles.bulletItem}>
            <FIcon name="lock" size={16} color="#D45500" />
            <Text style={styles.bulletText}>Secure hosting on protected servers</Text>
          </View>
          <View style={styles.bulletItem}>
            <FIcon name="lock" size={16} color="#D45500" />
            <Text style={styles.bulletText}>Regular security audits and monitoring</Text>
          </View>
          <View style={styles.bulletItem}>
            <FIcon name="lock" size={16} color="#D45500" />
            <Text style={styles.bulletText}>Restricted access to personal data (need-to-know basis only)</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rights</Text>
          <Text style={styles.bodyText}>
            You have full control over your personal information:
          </Text>
          <View style={styles.bulletItem}>
            <FIcon name="user" size={14} color="#D45500" />
            <Text style={styles.bulletText}>Access your data anytime from your profile</Text>
          </View>
          <View style={styles.bulletItem}>
            <FIcon name="user" size={14} color="#D45500" />
            <Text style={styles.bulletText}>Update or correct information</Text>
          </View>
          <View style={styles.bulletItem}>
            <FIcon name="user" size={14} color="#D45500" />
            <Text style={styles.bulletText}>Request deletion of your account and data</Text>
          </View>
          <View style={styles.bulletItem}>
            <FIcon name="user" size={14} color="#D45500" />
            <Text style={styles.bulletText}>Opt out of promotional communications</Text>
          </View>
          <Text style={styles.bodyText}>
            We are committed to protecting your privacy while helping you grow your business with confidence.
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

export default PrivacyPolicyScreen;

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
    fontFamily: Nunito.bold,
    color: '#D45500',
    textAlign: 'center',
    marginVertical: 16, 
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  introText: {
    fontSize: 16,
    fontFamily: Nunito.medium,
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
    fontFamily: Nunito.bold,
    color: '#D45500',
    marginBottom: 10, 
    marginTop: 4,
  },
  bodyText: {
    fontSize: 15.5,
    fontFamily: Nunito.medium,
    color: '#444',
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 8, 
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
    fontFamily: Nunito.medium,
    color: '#444',
    lineHeight: 23,
  },
  subBulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 3, // Reduced from 5
    marginLeft: 20,
  },
  subBulletText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    fontFamily: Nunito.medium,
    color: '#444',
    lineHeight: 22,
  },
  footer: {
    marginTop: 20, 
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: Nunito.regular,
    color: '#888',
    fontStyle: 'italic',
  },
});