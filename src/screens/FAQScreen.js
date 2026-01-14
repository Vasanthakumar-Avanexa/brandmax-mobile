import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
} from 'react-native';
import Nunito from '../utils/fonts';

const STATIC_FAQ_DATA = [
  {
    faq_cat_id: 1,
    name: 'Account & Login',
    data: [
      {
        faq_id: 101,
        question: 'I am an existing user. How do I login?',
        answer:
          '• Enter your registered mobile number\n• Tap "Get OTP"\n• Enter the 6-digit OTP received on your phone\n• You will be logged in directly to the Home screen\n\nAll features (orders, catalog, payments) will be accessible immediately.',
      },
      {
        faq_id: 102,
        question: 'I am a new user. How do I register?',
        answer:
          '• Tap on "Login" from the bottom tab or drawer menu\n• Enter your mobile number\n• Tap "Request Registration"\n• Your request will be sent to Admin for approval\n• Once approved, you will receive an SMS notification\n• After approval, use the same number to login with OTP',
      },
      {
        faq_id: 103,
        question: 'How do I reset my password or change number?',
        answer:
          'Currently, login is OTP-based only (no password).\nIf you change your phone number:\n• Contact support with old & new number\n• Admin will update your account\n• You can then login with new number via OTP',
      },
    ],
  },
  {
    faq_cat_id: 2,
    name: 'Orders & Payment',
    data: [
      {
        faq_id: 201,
        question: 'What payment methods are accepted?',
        answer:
          'We accept:\n• UPI (Google Pay, PhonePe, BHIM etc.)\n• Net Banking\n• Credit / Debit Cards\n• Cash on Delivery (COD) up to ₹50,000\n\nWallet payments coming soon!',
      },
      {
        faq_id: 202,
        question: 'How can I track my order?',
        answer:
          '• Go to Profile → My Orders\n• Select your order\n• Tap "Track Order"\n• Real-time status shown: Processing → Picked Up → In Transit → Out for Delivery → Delivered',
      },
      {
        faq_id: 203,
        question: 'Can I cancel an order?',
        answer:
          '• Yes, within 30 minutes of placing the order\n• Go to My Orders → Select order → Tap "Cancel"\n• After 30 mins, cancellation not possible\n• Contact support for assistance',
      },
    ],
  },
  {
    faq_cat_id: 3,
    name: 'Shipping & Delivery',
    data: [
      {
        faq_id: 301,
        question: 'What is the delivery timeline?',
        answer:
          'Delivery time depends on location:\n• Metro cities: 2–4 days\n• Tier-2 cities: 4–6 days\n• Remote areas: 6–10 days\n\nExpress delivery available at extra charge (1–2 days in select cities)',
      },
      {
        faq_id: 302,
        question: 'Do you ship internationally?',
        answer:
          'Currently we deliver only within India.\nInternational shipping is planned for Q4 2025.',
      },
    ],
  },
  {
    faq_cat_id: 4,
    name: 'Returns & Refunds',
    data: [
      {
        faq_id: 401,
        question: 'What is your return policy?',
        answer:
          '• 7-day return window only for manufacturing defects\n• Product must be unused & in original packaging\n• No returns for change of mind\n• Raise return request from My Orders',
      },
      {
        faq_id: 402,
        question: 'How long does refund take?',
        answer:
          '• Once returned product reaches us and quality check passed\n• Refund initiated within 2 business days\n• Amount credited in 5–7 working days (depending on bank)',
      },
    ],
  },
];

const FAQScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {STATIC_FAQ_DATA.map((section) => (
          <View key={section.faq_cat_id} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{section.name}</Text>
            </View>

            {section.data.map((item) => (
              <View key={item.faq_id} style={styles.itemContainer}>
                <Text style={styles.questionText}>{item.question}</Text>
                <Text style={styles.answerText}>{item.answer}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default FAQScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    backgroundColor: '#D45500',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
    marginTop:10
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: Nunito.bold,
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemContainer: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#FFF8F2',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFE0CC',
  },
  questionText: {
    fontSize: 16,
    fontFamily: Nunito.semiBold,
    color: '#333',
    marginBottom: 12,
  },
  answerText: {
    fontSize: 15,
    fontFamily: Nunito.medium,
    color: '#444',
    lineHeight: 24,
  },
});