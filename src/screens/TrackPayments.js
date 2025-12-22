import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Ionicons';
import poppins from '../utils/fonts';

const { width, height } = Dimensions.get('window');

const HomeIcon = ({ onPress }) => {
  return (
    <TouchableOpacity
      style={styles.homeButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Icon name="home" size={30} color="#fff" />
    </TouchableOpacity>
  );
};

const DonutChart = ({ totalTarget, totalPaid }) => {
  const size = Math.min(width * 0.6, 300);
  const strokeWidth = size * 0.2;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const percentage = totalTarget > 0 ? (totalPaid / totalTarget) * 100 : 0;
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
          // strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />

        <SvgText
          x={center}
          y={center - 15}
          textAnchor="middle"
          fontSize={size * 0.14}
          fill="#333"
          fontFamily={poppins.bold}
        >
          {percentage.toFixed(0)}%
        </SvgText>

        <SvgText
          x={center}
          y={center + 20}
          textAnchor="middle"
          fontSize={size * 0.07}
          fill="#777"
          fontFamily={poppins.medium}
        >
          Complete
        </SvgText>
      </Svg>
    </View>
  );
};

const TrackPayments = () => {
  const navigation = useNavigation();
  const totalTarget = 30000;
  const totalPaid = 2900;
  const toBeAchieved = totalTarget - totalPaid;

  const handleHomePress = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'MainDrawer',
          state: {
            routes: [
              {
                name: 'Tabs',
                state: {
                  routes: [{ name: 'Home' }],
                },
              },
            ],
          },
        },
      ],
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Your Payment Progress</Text>

          <DonutChart totalTarget={totalTarget} totalPaid={totalPaid} />

          <View style={styles.summaryCard}>
            <View style={styles.detailRow}>
              <View style={styles.labelContainer}>
                <View style={[styles.colorDot, { backgroundColor: '#D45500' }]} />
                <Text style={styles.label}>Total Target</Text>
              </View>
              <Text style={styles.amountTarget}>₹{totalTarget.toLocaleString('en-IN')}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.labelContainer}>
                <View style={[styles.colorDot, { backgroundColor: '#D45500' }]} />
                <Text style={styles.label}>Paid Amount</Text>
              </View>
              <Text style={styles.amountPaid}>₹{totalPaid.toLocaleString('en-IN')}</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.labelContainer}>
                <View style={[styles.colorDot, { backgroundColor: '#FFB84D' }]} />
                <Text style={styles.label}>Remaining</Text>
              </View>
              <Text style={styles.amountRemaining}>₹{toBeAchieved.toLocaleString('en-IN')}</Text>
            </View>
          </View>

          <Text style={styles.targetsTitle}>Unlock Rewards</Text>

          <View style={styles.targetCardsContainer}>
            {[
              { target: 'I', amount: 30000, progress: '8%', color: '#FF6B35' },
              { target: 'II', amount: 50000, progress: '5%', color: '#F44336' },
              { target: 'III', amount: 75000, progress: '3%', color: '#D32F2F' },
              { target: 'IV', amount: 100000, progress: '2%', color: '#B71C1C' },
            ].map((item, index) => (
              <View
                key={index}
                style={[
                  styles.targetCard,
                  { backgroundColor: item.color },
                  index % 2 === 1 && styles.targetCardAlt,
                ]}
              >
                <View style={styles.targetCardContent}>
                  <View>
                    <Text style={styles.targetLabel}>Target {item.target}</Text>
                    <Text style={styles.targetAmount}>₹{item.amount.toLocaleString('en-IN')}</Text>
                    <Text style={styles.targetReward}>
                      *Get {['Gold', 'Premium', 'Platinum', 'Diamond'][index]} Reward
                    </Text>
                  </View>
                  <View style={styles.targetProgress}>
                    <Text style={styles.progressText}>{item.progress}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <HomeIcon onPress={handleHomePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 120,
  },
  contentContainer: {
    paddingHorizontal: width * 0.06,
    paddingTop: height * 0.02,
  },
  title: {
    fontSize: width * 0.07,
    color: '#333',
    textAlign: 'center',
    marginVertical: height * 0.03,
    fontFamily: poppins.bold,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: height * 0.04,
  },
  summaryCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 20,
    padding: width * 0.06,
    marginVertical: height * 0.02,
    elevation: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontFamily: poppins.medium,
  },
  amountTarget: {
    fontSize: 18,
    color: '#D45500',
    fontFamily: poppins.bold,
  },
  amountPaid: {
    fontSize: 18,
    color: '#D45500',
    fontFamily: poppins.semiBold,
  },
  amountRemaining: {
    fontSize: 18,
    color: '#FF6B35',
    fontFamily: poppins.semiBold,
  },
  targetsTitle: {
    fontSize: 20,
    color: '#333',
    marginTop: height * 0.04,
    marginBottom: height * 0.02,
    fontFamily: poppins.semiBold,
  },
  targetCardsContainer: {
    // marginBottom: '0.01%',
  },
  targetCard: {
    borderRadius: 18,
    padding: width * 0.06,
    marginBottom: 10,
    elevation: 5,
  },
  targetCardAlt: {
    backgroundColor: '#E64A19',
  },
  targetCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  targetLabel: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 6,
    fontFamily: poppins.semiBold,
  },
  targetAmount: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 6,
    fontFamily: poppins.bold,
  },
  targetReward: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    fontFamily: poppins.medium,
  },
  targetProgress: {
    width: width * 0.18,
    height: width * 0.18,
    borderRadius: width * 0.09,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#fff',
  },
  progressText: {
    fontSize: 20,
    color: '#fff',
    fontFamily: poppins.bold,
  },
  homeButton: {
    position: 'absolute',
    bottom: height * 0.06,
    right: width * 0.05,
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    backgroundColor: '#D45500',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

export default TrackPayments;