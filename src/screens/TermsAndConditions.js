import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';
import FIcon from 'react-native-vector-icons/FontAwesome';
import poppins from '../utils/fonts';

const Bullet = ({ children }) => (
  <Text style={styles.ContentText}>
    <FIcon name={"arrow-right"} size={18} color={"red"} /> {children}
  </Text>
);

const TermsAndConditions = () => {
  return (
    <View style={styles.termsContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Section 1 */}
        <View style={styles.headerView}>
          <Text style={styles.headerText}>Terms And Conditions</Text>
          <Bullet>
            By using Brandmax, you agree to our terms and conditions. Our
            agreement with you is straightforward and transparent, ensuring that
            you have a clear understanding of your rights and obligations. We
            have designed our terms and conditions to be fair, concise, and
            user-friendly. Please read them carefully before using our B2B
            commerce mobile application.
          </Bullet>
        </View>

        {/* Section 2 */}
        <View style={styles.headerView}>
          <Text style={styles.headerText}>
            Breaches and Suspensions: Maintaining a Secure Platform
          </Text>
          <Bullet>
            We take security seriously at Brandmax. Our B2B commerce mobile
            application has been built with robust security measures to protect
            your business. In the unlikely event of a breach or suspension, we
            will take swift action to rectify the issue. We continuously monitor
            your transactions to identify any potential problems, allowing us to
            maintain a secure platform for your peace of mind.
          </Bullet>
        </View>

        {/* Section 3 */}
        <View style={styles.headerView}>
          <Text style={styles.headerText}>
            Transactions: Efficient and Streamlined
          </Text>
          <Bullet>
            Managing transactions in the industry can be complex and
            time-consuming. That's why we have designed our B2B commerce mobile
            application to be efficient and streamlined. You can manage your
            inventory, orders, and payments with ease, saving you time and
            money. We ensure that your transactions are completed quickly and
            securely, providing you with a hassle-free experience.
          </Bullet>
          <Bullet>
            At Brandmax, we are committed to helping you grow your business. Our
            B2B commerce mobile application is designed specifically for the
            footwear industry, providing you with the tools you need to succeed.
            From our clear and concise terms and conditions to our robust
            security measures and efficient transactions, we are here to support
            you every step of the way. Join us today and take your business to
            new heights.
          </Bullet>
        </View>
      </ScrollView>
    </View>
  );
};

export default TermsAndConditions;

// Styles
const styles = StyleSheet.create({
  termsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  headerView: {
    marginVertical: 5,
  },
  headerText: {
    color: 'red',
    fontSize: 18,
    fontFamily: poppins.semiBold,
    textTransform: 'uppercase',
  },
  ContentText: {
    fontSize: 15,
    fontFamily: poppins.semiBold,
    marginVertical: 5,
    marginHorizontal: 5,
    textAlign: 'justify',
    color: '#000',
  },
});