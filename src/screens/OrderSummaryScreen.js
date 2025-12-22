import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Divider } from 'react-native-elements';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import fetchData from '../config/fetchData';
import poppins from '../utils/fonts';

const COLORS = {
  primary: '#D45500',
  green: '#27ae60',
  red: '#e74c3c',
  orange: '#F39C12',
  blue: '#3498DB',
  gray: '#95a5a6',
};

const StatusBadge = ({ status }) => {
  const getStatus = () => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { text: 'Pending', color: COLORS.orange, icon: 'clock-outline' };
      case 'confirmed':
      case 'placed':
        return { text: 'Confirmed', color: '#007BFF', icon: 'check-circle-outline' };
      case 'shipped':
        return { text: 'Shipped', color: COLORS.blue, icon: 'truck-fast' };
      case 'in progress':
        return { text: 'In Progress', color: COLORS.orange, icon: 'progress-clock' };
      case 'delivered':
        return { text: 'Delivered', color: COLORS.green, icon: 'check-circle' };
      case 'cancelled':
        return { text: 'Cancelled', color: COLORS.red, icon: 'cancel' };
      default:
        return { text: status || 'Unknown', color: COLORS.gray, icon: 'help-circle-outline' };
    }
  };

  const { text, color, icon } = getStatus();

  return (
    <View style={styles.statusContainer}>
      <MIcon name={icon} size={26} color={color} />
      <Text style={[styles.statusText, { color }]}>{text}</Text>
    </View>
  );
};

const ProductItem = ({ item }) => {
  const { product, size, quantity, price } = item;

  return (
    <View style={styles.productCard}>
      <Text style={styles.productName}>
        {product?.product_name?.trim() || 'Product Name Missing'}
      </Text>

      {product?.article && (
        <Text style={styles.article}>
          {product.article.name} - Code: {product.article.code}
        </Text>
      )}

      <Text style={styles.color}>
        Color: {product?.colour?.color || 'N/A'}
      </Text>

      <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>Size</Text>
        <Text style={styles.detailValue}>{size?.size || '—'}</Text>
      </View>

      <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>Quantity</Text>
        <Text style={styles.detailValue}>{quantity || 0}</Text>
      </View>

      <View style={styles.detailsRow}>
        <Text style={styles.detailLabel}>Unit Price</Text>
        <Text style={styles.priceText}>₹{parseFloat(price || 0).toFixed(2)}</Text>
      </View>

      <Divider style={styles.divider} />

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Item Total</Text>
        <Text style={styles.totalPrice}>
          ₹{((price || 0) * (quantity || 0)).toLocaleString('en-IN')}
        </Text>
      </View>
    </View>
  );
};

const OrderSummaryScreen = ({ route, navigation }) => {
  const { orderId } = route.params || {};
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    } else {
      Alert.alert('Error', 'No order ID provided');
      navigation.goBack();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetchData.getOrderDetails(orderId);

      if (response?.success && response?.data && response.data.length > 0) {
        setOrder(response.data[0]);
      } else {
        Alert.alert('Not Found', 'This order does not exist');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Failed to load order details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <MIcon name="alert-circle-outline" size={80} color="#ccc" />
        <Text style={styles.loadingText}>Order not found</Text>
      </View>
    );
  }

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.headerCard}>
        <View style={styles.row}>
          <Text style={styles.label}>Order ID</Text>
          <Text style={styles.orderId}>#{order.id}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Order Date</Text>
          <Text style={styles.value}>{formatDateTime(order.createdAt)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <StatusBadge status={order.order_status} />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Payment Method</Text>
          <Text style={styles.value}>
            {(order.payment_method || 'Cash on Delivery').toUpperCase()}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Total Amount</Text>
          <Text style={styles.totalAmount}>
            ₹{parseFloat(order.total_amount).toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>
          Order Items ({totalItems} {totalItems === 1 ? 'item' : 'items'})
        </Text>
        <Divider style={styles.divider} />

        {order.items.map((item) => (
          <ProductItem key={item.id} item={item} />
        ))}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Order Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Items</Text>
          <Text style={styles.summaryValue}>{totalItems} pcs</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>
            ₹{parseFloat(order.total_amount).toLocaleString('en-IN')}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax & Charges</Text>
          <Text style={styles.summaryValue}>₹0</Text>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.grandTotalLabel}>Grand Total</Text>
          <Text style={styles.grandTotal}>
            ₹{parseFloat(order.total_amount).toLocaleString('en-IN')}
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#888',
    fontFamily: poppins.medium,
  },
  headerCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontFamily: poppins.medium,
  },
  value: {
    fontSize: 17,
    color: '#333',
    fontFamily: poppins.semiBold,
  },
  orderId: {
    fontSize: 20,
    color: COLORS.primary,
    fontFamily: poppins.bold,
  },
  totalAmount: {
    fontSize: 24,
    color: COLORS.primary,
    fontFamily: poppins.bold,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: 10,
    fontSize: 18,
    fontFamily: poppins.semiBold,
  },
  sectionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 16,
    padding: 18,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#333',
    fontFamily: poppins.semiBold,
    marginBottom: 12,
  },
  divider: {
    backgroundColor: '#eee',
    marginVertical: 12,
  },
  productCard: {
    backgroundColor: '#f5f5f5',
    padding: 18,
    borderRadius: 14,
    marginBottom: 14,
  },
  productName: {
    fontSize: 18,
    color: '#000',
    fontFamily: poppins.semiBold,
  },
  article: {
    fontSize: 14,
    color: '#777',
    marginTop: 6,
    fontFamily: poppins.regular,
  },
  color: {
    fontSize: 15,
    color: COLORS.primary,
    marginTop: 8,
    fontFamily: poppins.semiBold,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  detailLabel: {
    fontSize: 15,
    color: '#666',
    fontFamily: poppins.medium,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontFamily: poppins.semiBold,
  },
  priceText: {
    fontSize: 17,
    color: COLORS.red,
    fontFamily: poppins.semiBold,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 17,
    color: '#333',
    fontFamily: poppins.semiBold,
  },
  totalPrice: {
    fontSize: 19,
    color: COLORS.red,
    fontFamily: poppins.bold,
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  summaryTitle: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: poppins.semiBold,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
    fontFamily: poppins.medium,
  },
  summaryValue: {
    fontSize: 17,
    color: '#333',
    fontFamily: poppins.semiBold,
  },
  grandTotalLabel: {
    fontSize: 19,
    color: '#000',
    fontFamily: poppins.bold,
  },
  grandTotal: {
    fontSize: 24,
    color: COLORS.primary,
    fontFamily: poppins.bold,
  },
});

export default OrderSummaryScreen;