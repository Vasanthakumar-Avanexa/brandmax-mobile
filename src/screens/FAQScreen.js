// FAQScreen.js
import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  SectionList,
  View,
  Text,
  TouchableOpacity,
  Image,
  LayoutAnimation,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FIcon from 'react-native-vector-icons/FontAwesome';
import poppins from '../utils/fonts';

// Static FAQ Data
const STATIC_FAQ_DATA = [
  {
    faq_cat_id: 1,
    name: 'Account & Login',
    data: [
      {
        faq_id: 101,
        question: 'How do I reset my password?',
        answer:
          'Go to Profile → Settings → Change Password. Enter your old password and set a new one. A verification code will be sent to your registered email.',
      },
      {
        faq_id: 102,
        question: 'Can I use the app without login?',
        answer:
          'No, login is required to access orders, pricing, and personalized catalog. Guest mode is not supported.',
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
          'We accept UPI, Net Banking, Credit/Debit Cards, and COD (up to ₹50,000). Wallet payments coming soon.',
      },
      {
        faq_id: 202,
        question: 'How can I track my order?',
        answer:
          'Go to My Orders → Select order → Tap "Track". Real-time updates from pickup to delivery are shown.',
      },
      {
        faq_id: 203,
        question: 'Can I cancel an order?',
        answer:
          'Yes, within 30 minutes of placing the order. After that, contact support for assistance.',
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
          'Metro cities: 2–4 days\nTier-2 cities: 4–6 days\nRemote areas: 6–10 days\nExpress delivery available at extra cost.',
      },
      {
        faq_id: 302,
        question: 'Do you ship internationally?',
        answer:
          'Currently, we only deliver within India. International shipping is planned for Q4 2025.',
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
          '7-day return window for manufacturing defects only. Product must be unused, in original packaging.',
      },
      {
        faq_id: 402,
        question: 'How long does refund take?',
        answer:
          'Refunds are processed within 5–7 business days after we receive the returned product.',
      },
    ],
  },
];

// Reusable FAQ Item
const FAQItem = React.memo(({ question, answer, isOpen, onToggle }) => {
  return (
    <View style={styles.FaqContainer}>
      <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
        <View style={styles.FaqView}>
          <Text style={styles.faqQuesText}>{question}</Text>
          <FIcon
            name={isOpen ? 'minus-circle' : 'plus-circle'}
            size={25}
            color="#fff"
          />
        </View>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.AnswerView}>
          <Text style={styles.answerText}>{answer}</Text>
        </View>
      )}
    </View>
  );
});

// Section Header
const SectionHeader = React.memo(({ title }) => (
  <View style={styles.faqHeaderContainer}>
    <Text style={styles.FaqHeaderNameText}>{title}</Text>
  </View>
));

const FAQScreen = () => {
  const [openItems, setOpenItems] = useState({});

  // Toggle FAQ
  const toggleFAQ = useCallback((faqId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenItems(prev => ({
      ...prev,
      [faqId]: !prev[faqId],
    }));
  }, []);

  // Render Item
  const renderItem = useCallback(
    ({ item }) => {
      const isOpen = !!openItems[item.faq_id];
      return (
        <FAQItem
          question={item.question}
          answer={item.answer}
          isOpen={isOpen}
          onToggle={() => toggleFAQ(item.faq_id)}
        />
      );
    },
    [openItems, toggleFAQ],
  );

  // Render Header
  const renderSectionHeader = useCallback(
    ({ section }) => <SectionHeader title={section.name} />,
    [],
  );

  // Key Extractor
  const keyExtractor = useCallback((item) => `faq-${item.faq_id}`, []);

  return (
    <SafeAreaView style={styles.faqViewContainer}>
      <SectionList
        sections={STATIC_FAQ_DATA}
        keyExtractor={keyExtractor}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        stickySectionHeadersEnabled={true}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

export default FAQScreen;

// Styles
const styles = StyleSheet.create({
  faqViewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  FaqContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  FaqView: {
    backgroundColor: '#D45500',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqQuesText: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontFamily: poppins.medium,
  },
  AnswerView: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    marginTop: 8,
    padding: 12,
  },
  answerText: {
    fontSize: 15,
    fontFamily: poppins.medium,
    color: '#000',
    lineHeight: 22,
  },
  faqHeaderContainer: {
    padding: 12,
    backgroundColor: '#D00',
    borderRadius: 8,
    marginHorizontal: 10,
    // marginVertical: 8,
    borderWidth: 1,
    borderColor: '#000',
  },
  FaqHeaderNameText: {
    fontFamily: poppins.semiBold,
    color: '#fff',
    textTransform: 'uppercase',
    lineHeight: 24,
  },
});