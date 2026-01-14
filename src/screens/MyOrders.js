import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fetchData from '../config/fetchData';
import showToast from '../utils/common_fn';
import Nunito from '../utils/fonts';
import PaymentModal from '../payment/Paymentmodal';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const MyOrders = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [remainingBalance, setRemainingBalance] = useState(0);

  useEffect(() => {
    loadUserData();
    loadRemainingBalance();
    fetchOrders();
  }, []);

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

  const loadUserData = async () => {
    setUserLoading(true);
    try {
      const userDataString = await AsyncStorage.getItem('UserData');

      if (userDataString) {
        const user = JSON.parse(userDataString);
        console.log('User Data from AsyncStorage:', user);
        
        if (user?.id) {
          try {
            const freshUserData = await fetchData.getUser(user.id);
            console.log('Fresh User Data from API:', freshUserData);
            
            if (freshUserData.success && freshUserData.data) {
              setUserData(freshUserData.data);
              console.log('User Pay Type:', freshUserData.data?.pay_type);
              console.log('User Total Amount:', freshUserData.data?.total_amount);
            } else {
              setUserData(user);
            }
          } catch (error) {
            console.error('Error fetching fresh user data:', error);
            setUserData(user);
          }
        } else {
          setUserData(user);
        }
      } else {
        setUserData(null);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserData(null);
    } finally {
      setUserLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetchData.getOrders(1, 10);
      console.log("------------------loguuu===>", response);
      
      if (response.success) {
        if (response.data.length === 0) {
          showToast(response.message || 'No orders found');
        }
        setOrders(response.data || []);
      } else {
        showToast(response.message || 'Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showToast('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadUserData();
    loadRemainingBalance();
    fetchOrders();
  };

  const handlePaymentSuccess = (paymentData) => {
    console.log('Payment Success:', paymentData);
    showToast('Payment successful! 🎉');
    setTimeout(() => {
      setPaymentModalVisible(false);
      loadUserData();
      loadRemainingBalance();
      fetchOrders();
    }, 1600);
  };

  const handlePaymentFailure = (error) => {
    console.log('Payment Failed:', error);
    if (!error.cancelled) {
      showToast('Payment failed. Please try again.');
    }
  };

  const getStatusInfo = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { text: 'Pending', color: '#FF8C00', icon: 'clock-outline' };
      case 'placed':
      case 'confirmed':
        return { text: 'Placed', color: '#007BFF', icon: 'check-circle-outline' };
      case 'shipped':
      case 'in progress':
        return { text: 'Shipped', color: '#D4A017', icon: 'truck-fast' };
      case 'delivered':
        return { text: 'Delivered', color: '#28A745', icon: 'check-circle' };
      case 'failed':
      case 'cancelled':
        return { text: `${status}`, color: '#DC3545', icon: 'close-circle' };
      default:
        return { text: 'Unknown', color: '#888', icon: 'help-circle-outline' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';

    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };

    return date.toLocaleDateString('en-IN', options).replace(',', '');
  };

  const renderItem = ({ item }) => {
    const statusInfo = getStatusInfo(item.order_status);
    const itemCount = item.items?.length || 0;

    return (
      <View style={styles.card}>
        <View style={styles.statusRow}>
          <Icon name={statusInfo.icon} size={SCREEN_HEIGHT * 0.028} color={statusInfo.color} />
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.text}
          </Text>
        </View>

        <View style={styles.details}>
          <View style={styles.row}>
            <Text style={styles.label}>Order ID</Text>
            <Text style={styles.orderId}>#{item.id}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Order Date</Text>
            <Text style={styles.value}>{formatDate(item.createdAt)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Items</Text>
            <Text style={styles.value}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Total Amount</Text>
            <Text style={styles.totalAmount}>
              ₹{parseFloat(item.total_amount).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('OrderSummaryScreen', { orderId: item.id })}
          style={styles.viewButton}
        >
          <Text style={styles.viewButtonText}>View Order Details</Text>
          <Icon name="chevron-right" size={SCREEN_HEIGHT * 0.024} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading && orders.length === 0) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#D45500" />
        <Text style={styles.loadingText}>Loading your orders...</Text>
      </View>
    );
  }

  const isUserCredit = userData?.pay_type === 'credit';
  const totalAmountToPay = parseFloat(userData?.total_amount) || 0;

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          orders.length === 0 ? styles.emptyList : styles.listContent,
        ]}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Icon name="package-variant-closed" size={SCREEN_HEIGHT * 0.12} color="#ddd" />
              <Text style={styles.emptyTitle}>No Orders Yet</Text>
            </View>
          )
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
      />

      {remainingBalance > 0 && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setPaymentModalVisible(true)}
          activeOpacity={0.8}
        >
          <Icon name="currency-inr" size={26} color="#fff" />
          <Text style={styles.floatingButtonText}>Pay</Text>
        </TouchableOpacity>
      )}

      <PaymentModal
        visible={paymentModalVisible}
        onClose={() => setPaymentModalVisible(false)}
        amount={totalAmountToPay}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
        showAmountInput={isUserCredit}
        remainingBalance={remainingBalance}
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
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  listContent: {
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingVertical: SCREEN_HEIGHT * 0.02,
    paddingBottom: SCREEN_HEIGHT * 0.12, 
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: SCREEN_HEIGHT * 0.015,
    paddingHorizontal: SCREEN_WIDTH * 0.045,
    paddingVertical: SCREEN_HEIGHT * 0.02,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: SCREEN_HEIGHT * 0.008,
  },
  statusText: {
    fontSize: SCREEN_HEIGHT * 0.018,
    marginLeft: SCREEN_WIDTH * 0.02,
    fontFamily: Nunito.semiBold,
  },
  details: {
    paddingTop: SCREEN_HEIGHT * 0.015,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SCREEN_HEIGHT * 0.006,
  },
  label: {
    fontSize: SCREEN_HEIGHT * 0.017,
    color: '#666',
    fontFamily: Nunito.medium,
  },
  value: {
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#333',
    fontFamily: Nunito.medium,
    textAlign: 'right',
    maxWidth: '60%',
  },
  orderId: {
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#D45500',
    fontFamily: Nunito.semiBold,
  },
  totalAmount: {
    fontSize: SCREEN_HEIGHT * 0.021,
    color: '#D45500',
    fontFamily: Nunito.bold,
  },
  viewButton: {
    flexDirection: 'row',
    backgroundColor: '#D45500',
    marginTop: SCREEN_HEIGHT * 0.012,
    paddingVertical: SCREEN_HEIGHT * 0.013,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: SCREEN_HEIGHT * 0.018,
    fontFamily: Nunito.semiBold,
    marginRight: SCREEN_WIDTH * 0.015,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    marginTop: SCREEN_HEIGHT * 0.02,
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#888',
    fontFamily: Nunito.regular,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SCREEN_WIDTH * 0.1,
    marginTop: SCREEN_HEIGHT * 0.1,
  },
  emptyTitle: {
    fontSize: SCREEN_HEIGHT * 0.026,
    color: '#333',
    marginTop: SCREEN_HEIGHT * 0.025,
    fontFamily: Nunito.semiBold,
  },
  emptyList: {
    flexGrow: 1,
    paddingBottom: SCREEN_HEIGHT * 0.12, 
  },
  floatingButton: {
    position: 'absolute',
    right: SCREEN_WIDTH * 0.05,
    bottom: SCREEN_HEIGHT * 0.08,
    backgroundColor: '#D45500',
    width: SCREEN_HEIGHT * 0.06,
    height: SCREEN_HEIGHT * 0.06,
    borderRadius: SCREEN_HEIGHT * 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#D45500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: SCREEN_HEIGHT * 0.014,
    fontFamily: Nunito.bold,
    marginTop: SCREEN_HEIGHT * 0.003,
  },
});

export default MyOrders; 