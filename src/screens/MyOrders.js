import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import fetchData from '../config/fetchData';
import showToast from '../utils/common_fn';
import poppins from '../utils/fonts';

const MyOrders = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetchData.getOrders(1, 10);

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
    fetchOrders();
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
      case 'cancelled':
        return { text: 'Cancelled', color: '#DC3545', icon: 'close-circle' };
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
        {/* Status Badge */}
        <View style={styles.statusRow}>
          <Icon name={statusInfo.icon} size={24} color={statusInfo.color} />
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.text}
          </Text>
        </View>

        {/* Order Details */}
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
            <Text style={styles.totalAmount}>₹{parseFloat(item.total_amount).toFixed(2)}</Text>
          </View>
        </View>

        {/* View Details Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('OrderSummaryScreen', { orderId: item.id })}
          style={styles.viewButton}
        >
          <Text style={styles.viewButtonText}>View Order Details</Text>
          <Icon name="chevron-right" size={20} color="#fff" />
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

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={orders.length === 0 ? styles.emptyList : styles.listContent}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Icon name="package-variant-closed" size={100} color="#ddd" />
              <Text style={styles.emptyTitle}>No Orders Yet</Text>
            </View>
          )
        }
        refreshing={refreshing}
        onRefresh={handleRefresh}
        showsVerticalScrollIndicator={false}
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
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    padding: 18,
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
    marginBottom: 12,
  },
  statusText: {
    fontSize: 16,
    marginLeft: 8,
    fontFamily: poppins.semiBold,
  },
  details: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  label: {
    fontSize: 15,
    color: '#666',
    fontFamily: poppins.medium,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontFamily: poppins.medium,
    textAlign: 'right',
    maxWidth: '60%',
  },
  orderId: {
    fontSize: 16,
    color: '#D45500',
    fontFamily: poppins.semiBold,
  },
  totalAmount: {
    fontSize: 18,
    color: '#D45500',
    fontFamily: poppins.bold,
  },
  viewButton: {
    flexDirection: 'row',
    backgroundColor: '#D45500',
    marginTop: 18,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: poppins.semiBold,
    marginRight: 6,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#888',
    fontFamily: poppins.regular,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 80,
  },
  emptyTitle: {
    fontSize: 22,
    color: '#333',
    marginTop: 20,
    fontFamily: poppins.semiBold,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
    fontFamily: poppins.regular,
  },
  emptyList: {
    flexGrow: 1,
  },
});

export default MyOrders;