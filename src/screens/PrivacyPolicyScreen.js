// PrivacyPolicy.js
import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import FIcon from 'react-native-vector-icons/FontAwesome';
import poppins from '../utils/fonts';

// Reusable Bullet Point (Main)
const Bullet = ({ children }) => (
  <Text style={styles.ContentText}>
    <FIcon name="circle" size={18} color={'red'} /> {children}
  </Text>
);

// Reusable Sub-Bullet (Indented with Check)
const SubBullet = ({ children }) => (
  <Text style={styles.SubContentText}>
    <FIcon name="check" size={18} color={'red'} /> {children}
  </Text>
);

// Section Title
const SectionTitle = ({ children }) => (
  <Text style={styles.headerText}>{children}</Text>
);

// Sub-Title
const SubTitle = ({ children }) => (
  <Text style={styles.subTitleText}>{children}</Text>
);

const PrivacyPolicyScreen = () => {
  return (
    <View style={styles.privacyContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Section 1 */}
        <View style={styles.headerView}>
          <SectionTitle>Privacy Policy</SectionTitle>
          <Bullet>
            At Brandmax, we understand the importance of privacy and are
            committed to protecting your personal information while empowering
            your business. Our Privacy Policy outlines our data collection
            practices and the measures we take to ensure your information is
            secure.
          </Bullet>
        </View>

        {/* Section 2 */}
        <View style={styles.headerView}>
          <SectionTitle>Collection of Information:</SectionTitle>
          <SubTitle>Relevant and Necessary Data</SubTitle>
          <Bullet>
            We only collect the information necessary to provide you with our
            services and improve your experience on our platform. This includes
            your name, contact information, and business details. We do not
            collect sensitive information such as financial data without your
            explicit consent.
          </Bullet>
        </View>

        {/* Section 3 */}
        <View style={styles.headerView}>
          <SectionTitle>Use of User Data:</SectionTitle>
          <Bullet>
            We use your data to provide you with a seamless B2B commerce
            experience. This includes creating personalised product
            recommendations and improving our platform's functionality. We also
            use your data to analyse market trends and provide insights to help
            you make informed business decisions.
          </Bullet>
        </View>

        {/* Section 4 */}
        <View style={styles.headerView}>
          <SectionTitle>Use of Cookies:</SectionTitle>
          <Bullet>Improving Your Experience</Bullet>
          <Bullet>We use cookies to enhance your experience on our platform.</Bullet>
          <Bullet>Cookies help us</Bullet>

          <SubBullet>Remember your preferences,</SubBullet>
          <SubBullet>Optimise our services, and</SubBullet>
          <SubBullet>Provide personalised content.</SubBullet>

          <Text style={styles.ContentText}>
            You can manage your cookie preferences in your account settings.
          </Text>
        </View>

        {/* Section 5 */}
        <View style={styles.headerView}>
          <SectionTitle>Security Measures:</SectionTitle>
          <SubTitle>Protecting Your Data</SubTitle>
          <Text style={styles.ContentText}>
            We take the security of your data seriously and have implemented
            robust measures to ensure its safety. Our platform is hosted on
            secure servers with encrypted data storage, and we continuously
            monitor our systems for any vulnerabilities. We also use
            industry-standard security protocols to protect your data during
            transmission.
          </Text>
        </View>

        {/* Section 6 */}
        <View style={styles.headerView}>
          <SectionTitle>Your Rights:</SectionTitle>
          <SubTitle>Control and Transparency</SubTitle>
          <Text style={styles.ContentText}>
            At Brandmax, we believe in transparency and respect your right to
            control your personal information. You have the right to access,
            modify, or delete your information at any time. You can also opt out
            of receiving promotional messages from us.
          </Text>
          <Text style={styles.ContentText}>
            We are committed to protecting your privacy while empowering your
            business. With our secure and seamless B2B commerce platform, you
            can focus on growing your business with confidence.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicyScreen;

// Styles
const styles = StyleSheet.create({
  privacyContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  headerView: {
    marginVertical: 5,
  },
  headerText: {
    color: "red",
    fontSize: 18,
    fontFamily: poppins.semiBold,
    textTransform: 'uppercase',
  },
  subTitleText: {
    color: 'red',
    fontSize: 14,
    fontFamily: poppins.semiBold,
    textTransform: 'uppercase',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  ContentText: {
    fontSize: 15,
    fontFamily: poppins.semiBold,
    marginVertical: 5,
    marginHorizontal: 5,
    textAlign: 'justify',
    color: '#000',
  },
  SubContentText: {
    fontSize: 15,
    fontFamily: poppins.semiBold,
    marginVertical: 5,
    marginHorizontal: 20,
    textAlign: 'justify',
    color: '#000',
  },
});