import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Nunito from '../utils/fonts';
import fetchData from '../config/fetchData';
import showToast from '../utils/common_fn';
import { useSelector } from 'react-redux';
import PaymentModal from '../payment/Paymentmodal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const HomeIcon = ({ onPress }) => (
  <TouchableOpacity style={styles.homeButton} onPress={onPress} activeOpacity={0.7}>
    <Icon name="home" size={28} color="#D45500" />
  </TouchableOpacity>
);

const PayButton = ({ onPress }) => (
  <TouchableOpacity style={styles.payButton} onPress={onPress} activeOpacity={0.8}>
    <MIcon name="currency-inr" size={26} color="#fff" />
    <Text style={styles.payButtonText}>Pay</Text>
  </TouchableOpacity>
);

const formatAmount = (amount) => {
  const numAmount = parseFloat(amount) || 0;
  return numAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const DonutChart = ({ totalPurchaseAmount, paidAmount }) => {
  const size = Math.min(SCREEN_WIDTH * 0.58, 200);
  const strokeWidth = size * 0.18;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const percentage = totalPurchaseAmount > 0 
    ? (paidAmount / totalPurchaseAmount) * 100 
    : 0;

  const paidOffset = circumference - (circumference * percentage) / 100;

  return (
    <View style={styles.chartContainer}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#FFE0B2"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#D45500"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={paidOffset}
          rotation="-90"
          origin={`${center}, ${center}`}
        />
        <SvgText
          x={center - 15}
          y={center - 10}
          textAnchor="middle"
          fontSize={size * 0.16}
          fill="#333"
          fontFamily={Nunito.bold}
        >
          {Math.floor(percentage)}%
        </SvgText>
        <SvgText
          x={center}
          y={center + 18}
          textAnchor="middle"
          fontSize={size * 0.08}
          fill="#777"
          fontFamily={Nunito.medium}
        >
          Completed
        </SvgText>
      </Svg>
    </View>
  );
};

const DUMMY_DATA = {
  overAllPercentage: {
    totalTarget: 0,
    totalPurchaseAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
  },
  data: [
    { target: 1, targetAmount: 25000, percentage: '0' },
    { target: 2, targetAmount: 50000, percentage: '0' },
    { target: 3, targetAmount: 75000, percentage: '0' },
    { target: 4, targetAmount: 100000, percentage: '0' },
  ],
};

const TrackPayments = () => {
  const navigation = useNavigation();
  const isGuestUser = useSelector((state) => state.auth.isGuestUser);

  const [overall, setOverall] = useState({
    totalTarget: 100000,
    totalPurchaseAmount: 0,
    paidAmount: 0,
    remainingAmount: 100000,
  });

  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [remainingBalance, setRemainingBalance] = useState(0);

  useEffect(() => {
    if (isGuestUser) {
      loadDummyData();
    } else {
      loadUserData();
      loadRemainingBalance();
      fetchPercentage();
    }
  }, [isGuestUser]);

  const loadRemainingBalance = async () => {
    try {
      const storedBalance = await AsyncStorage.getItem('RemainingBalance');
      if (storedBalance !== null) {
        const balance = parseFloat(storedBalance);
        console.log('Loaded remaining balance from AsyncStorage:', balance);
        setRemainingBalance(balance);
      }
    } catch (error) {
      console.error('Error loading remaining balance:', error);
    }
  };

  const updateRemainingBalanceInStorage = async (newBalance) => {
    try {
      await AsyncStorage.setItem('RemainingBalance', newBalance.toString());
      setRemainingBalance(newBalance);
      console.log('Updated remaining balance in state:', newBalance);
    } catch (error) {
      console.error('Error updating remaining balance:', error);
    }
  };

  const loadUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('UserData');
      if (userDataString) {
        const user = JSON.parse(userDataString);
        if (user?.id) {
          const freshUserData = await fetchData.getUser(user.id);
          if (freshUserData.success && freshUserData.data) {
            await AsyncStorage.setItem('UserData', JSON.stringify(freshUserData.data));
            setUserData(freshUserData.data);
          } else {
            setUserData(user);
          }
        } else {
          setUserData(user);
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadDummyData = () => {
    setLoading(true);
    setTimeout(() => {
      setOverall(DUMMY_DATA.overAllPercentage);
      setTargets(DUMMY_DATA.data);
      setLoading(false);
    }, 600);
  };

  const fetchPercentage = async () => {
    try {
      setLoading(true);
      const response = await fetchData.getPercentage();
      console.log('Percentage response:', response);

      if (response?.success && response?.data) {
        const { data, overAllPercentage } = response.data;

        if (overAllPercentage) {
          const parsedOverall = {
            totalTarget: parseFloat(overAllPercentage.totalTarget) || 0,
            totalPurchaseAmount: parseFloat(overAllPercentage.totalPurchaseAmount) || 0,
            paidAmount: parseFloat(overAllPercentage.paidAmount) || 0,
            remainingAmount: parseFloat(overAllPercentage.remainingAmount) || 0,
          };
          setOverall(parsedOverall);

          // Calculate and store remaining balance
          const balance = parsedOverall.totalPurchaseAmount - parsedOverall.paidAmount;
          const positiveBalance = Math.max(0, balance);
          await updateRemainingBalanceInStorage(positiveBalance);
        }

        if (Array.isArray(data)) {
          setTargets(data);
        }
      } else {
        showToast('Failed to load progress');
      }
    } catch (error) {
      console.error('Error fetching percentage:', error);
      showToast('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (paymentData) => {
    showToast('Payment successful! 🎉');
    setTimeout(() => {
      setPaymentModalVisible(false);
      if (!isGuestUser) {
        loadUserData();
        loadRemainingBalance();
        fetchPercentage();
      }
    }, 1600);
  };

  const handlePaymentFailure = (errorData) => {
    if (!errorData?.cancelled) {
      showToast('Payment failed. Please try again.');
    }
  };

  const handleHomePress = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainDrawer', state: { routes: [{ name: 'Tabs', state: { routes: [{ name: 'Home' }] } }] } }],
    });
  };

  const isUserCredit = userData?.pay_type === 'credit';
  const amountToPay = Math.max(0, overall.totalPurchaseAmount - overall.paidAmount);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D45500" />
        <Text style={styles.loadingText}>Loading your progress...</Text>
      </View>
    );
  }

  const rewardNames = ['Gold', 'Premium', 'Platinum', 'Diamond'];
  const cardColors = ['#FF6B35', '#F44336', '#D32F2F', '#B71C1C'];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Your Payment Progress</Text>

          <DonutChart
            totalPurchaseAmount={overall.totalPurchaseAmount}
            paidAmount={overall.paidAmount}
          />

          <View style={styles.summaryCard}>
            <View style={styles.detailRow}>
              <View style={styles.labelContainer}>
                <View style={[styles.colorDot, { backgroundColor: '#D45500' }]} />
                <Text style={styles.label}>Total Target</Text>
              </View>
              <Text style={styles.amountTarget}>
                ₹{formatAmount(overall.totalTarget)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.labelContainer}>
                <View style={[styles.colorDot, { backgroundColor: '#27AE60' }]} />
                <Text style={styles.label}>Available Limit</Text>
              </View>
              <Text style={styles.amountAvailable}>
                ₹{formatAmount(overall.totalTarget - overall.totalPurchaseAmount)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.labelContainer}>
                <View style={[styles.colorDot, { backgroundColor: '#D45500' }]} />
                <Text style={styles.label}>Total Purchase</Text>
              </View>
              <Text style={styles.amountPaid}>
                ₹{formatAmount(overall.totalPurchaseAmount)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.labelContainer}>
                <View style={[styles.colorDot, { backgroundColor: '#888' }]} />
                <Text style={styles.label}>Paid Amount</Text>
              </View>
              <Text style={styles.amountNormal}>
                ₹{formatAmount(overall.paidAmount)}
              </Text>
            </View>

            {amountToPay > 0 && (
              <View style={[styles.detailRow, styles.detailRow]}>
                <View style={styles.labelContainer}>
                  <View style={[styles.colorDot, { backgroundColor: '#FF6B35' }]} />
                  <Text style={[styles.label, { fontFamily: Nunito.bold }]}>Remaining to Pay</Text>
                </View>
                <Text style={styles.amountRemaining}>
                  ₹{formatAmount(amountToPay)}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.targetsTitle}>Unlock Rewards</Text>

          <View style={styles.targetCardsContainer}>
            {targets.map((item, index) => (
              <View
                key={item.target}
                style={[
                  styles.targetCard,
                  { backgroundColor: cardColors[index] || '#D45500' },
                  index % 2 === 1 && styles.targetCardAlt,
                ]}
              >
                <View style={styles.targetCardContent}>
                  <View>
                    <Text style={styles.targetLabel}>Target {item.target}</Text>
                    <Text style={styles.targetAmount}>
                      ₹{formatAmount(item.targetAmount)}
                    </Text>
                    <Text style={styles.targetReward}>
                      {rewardNames[index] || 'Special'} Reward
                    </Text>
                  </View>
                  <View style={styles.targetProgress}>
                    <Text style={styles.progressText}>
                      {parseFloat(item.percentage).toFixed(1)}%
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <HomeIcon onPress={handleHomePress} />

      {!isGuestUser && amountToPay > 0 && (
        <PayButton onPress={() => setPaymentModalVisible(true)} />
      )}

      <PaymentModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        amount={amountToPay}
        showAmountInput={isUserCredit}
        remainingBalance={remainingBalance}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
        userDetails={{
          name: userData?.name || '',
          email: userData?.email || '',
          phone: userData?.phone || '',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666', fontFamily: Nunito.medium },

  scrollContent: { paddingBottom: 140 },
  contentContainer: {
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingTop: SCREEN_HEIGHT * 0.04,
  },

  title: {
    fontSize: SCREEN_WIDTH * 0.065,
    color: '#333',
    textAlign: 'center',
    fontFamily: Nunito.extraBold,
    marginBottom: SCREEN_HEIGHT * 0.02,
  },

  chartContainer: {
    alignItems: 'center',
    marginVertical: SCREEN_HEIGHT * 0.02,
  },

  summaryCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 18,
    padding: SCREEN_WIDTH * 0.05,
    marginVertical: SCREEN_HEIGHT * 0.02,
    elevation: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  remainingRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#FFE0B2',
  },
  labelContainer: { flexDirection: 'row', alignItems: 'center' },
  colorDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  label: { fontSize: 15, color: '#666', fontFamily: Nunito.medium },
  amountTarget: { fontSize: 17, color: '#D45500', fontFamily: Nunito.bold },
  amountAvailable: { fontSize: 17, color: '#27AE60', fontFamily: Nunito.bold },
  amountPaid: { fontSize: 17, color: '#D45500', fontFamily: Nunito.semiBold },
  amountNormal: { fontSize: 17, color: '#333', fontFamily: Nunito.semiBold },
  amountRemaining: { fontSize: 18, color: '#FF6B35', fontFamily: Nunito.bold },

  targetsTitle: {
    fontSize: 19,
    color: '#333',
    marginTop: SCREEN_HEIGHT * 0.025,
    marginBottom: SCREEN_HEIGHT * 0.015,
    fontFamily: Nunito.semiBold,
  },

  targetCardsContainer: { paddingBottom: 30 },
  targetCard: {
    borderRadius: 16,
    padding: SCREEN_WIDTH * 0.05,
    marginBottom: 12,
    elevation: 5,
  },
  targetCardAlt: { backgroundColor: '#E64A19' },
  targetCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  targetLabel: { fontSize: 16, color: '#fff', marginBottom: 4, fontFamily: Nunito.semiBold },
  targetAmount: { fontSize: 26, color: '#fff', marginBottom: 4, fontFamily: Nunito.bold },
  targetReward: { fontSize: 13, color: '#fff', opacity: 0.9, fontFamily: Nunito.medium },
  targetProgress: {
    width: SCREEN_WIDTH * 0.16,
    height: SCREEN_WIDTH * 0.16,
    borderRadius: SCREEN_WIDTH * 0.08,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  progressText: { fontSize: 18, color: '#fff', fontFamily: Nunito.bold },

  homeButton: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.12,
    right: SCREEN_WIDTH * 0.05,
    width: SCREEN_WIDTH * 0.14,
    height: SCREEN_WIDTH * 0.14,
    borderRadius: SCREEN_WIDTH * 0.07,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  payButton: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.2,
    right: SCREEN_WIDTH * 0.05,
    backgroundColor: '#D45500',
    width: SCREEN_HEIGHT * 0.06,
    height: SCREEN_HEIGHT * 0.06,
    borderRadius: SCREEN_WIDTH * 0.09,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#D45500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  payButtonText: {
    color: '#fff', 
    fontSize: 13,
    fontFamily: Nunito.bold,
    marginTop: 4,
  },
});

export default TrackPayments;