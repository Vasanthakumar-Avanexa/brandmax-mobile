import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { Divider } from 'react-native-elements';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import fetchData from '../config/fetchData';
import Nunito from '../utils/fonts';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

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
      <MIcon name={icon} size={SCREEN_HEIGHT * 0.024} color={color} />
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
  const [tax, setTax] = useState(0);

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
      console.log("====response0000000-->",response);
      

      if (response?.success && response?.data && response.data.length > 0) {
        setTax(response?.tax || 0);
        setOrder(response?.data[0]);
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

  // Calculate subtotal (sum of all item totals)
  const calculateSubtotal = () => {
    if (!order || !order.items) return 0;
    return order.items.reduce((sum, item) => {
      return sum + (item.price || 0) * (item.quantity || 0);
    }, 0);
  };

  // Calculate tax amount
  const calculateTaxAmount = (subtotal) => {
    return (subtotal * (tax / 100));
  };

  // Calculate grand total
  const calculateGrandTotal = (subtotal, taxAmount) => {
    return subtotal + taxAmount;
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
        <MIcon name="alert-circle-outline" size={SCREEN_HEIGHT * 0.08} color="#ccc" />
        <Text style={styles.loadingText}>Order not found</Text>
      </View>
    );
  }

  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = calculateSubtotal();
  const taxAmount = calculateTaxAmount(subtotal);
  const grandTotal = calculateGrandTotal(subtotal, taxAmount);

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
          <Text style={styles.label}>Order Type</Text>
          <Text style={styles.value}>
            {order?.order_pay_type?.toUpperCase() || 'CASH ON DELIVERY'}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Total Amount</Text>
          <Text style={styles.totalAmount}>
            ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
            ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax & Charges ({tax}%)</Text>
          <Text style={styles.summaryValue}>
            ₹{taxAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.grandTotalLabel}>Grand Total</Text>
          <Text style={styles.grandTotal}>
            ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>
      </View>

      <View style={{ height: SCREEN_HEIGHT * 0.05 }} />
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
    marginTop: SCREEN_HEIGHT * 0.02,
    fontSize: SCREEN_HEIGHT * 0.016,
    color: '#888',
    fontFamily: Nunito.medium,
  },
  headerCard: {
    backgroundColor: '#fff',
    marginHorizontal: SCREEN_WIDTH * 0.04,
    marginTop: SCREEN_HEIGHT * 0.02,
    marginBottom: SCREEN_HEIGHT * 0.01,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingVertical: SCREEN_HEIGHT * 0.015,
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
    marginVertical: SCREEN_HEIGHT * 0.008,
  },
  label: {
    fontSize: SCREEN_HEIGHT * 0.016,
    color: '#666',
    fontFamily: Nunito.medium,
  },
  value: {
    fontSize: SCREEN_HEIGHT * 0.017,
    color: '#333',
    fontFamily: Nunito.semiBold,
    maxWidth: SCREEN_WIDTH * 0.5,
    textAlign: 'right',
  },
  orderId: {
    fontSize: SCREEN_HEIGHT * 0.020,
    color: COLORS.primary,
    fontFamily: Nunito.bold,
  },
  totalAmount: {
    fontSize: SCREEN_HEIGHT * 0.024,
    color: COLORS.primary,
    fontFamily: Nunito.bold,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: SCREEN_WIDTH * 0.025,
    fontSize: SCREEN_HEIGHT * 0.017,
    fontFamily: Nunito.semiBold,
  },
  sectionCard: {
    backgroundColor: '#fff',
    marginHorizontal: SCREEN_WIDTH * 0.04,
    marginVertical: SCREEN_HEIGHT * 0.01,
    borderRadius: 16,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingVertical: SCREEN_HEIGHT * 0.02,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: SCREEN_HEIGHT * 0.020,
    color: '#333',
    fontFamily: Nunito.semiBold,
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  divider: {
    backgroundColor: '#eee',
    marginVertical: SCREEN_HEIGHT * 0.001,
  },
  productCard: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    paddingVertical: SCREEN_HEIGHT * 0.01,
    borderRadius: 14,
    marginTop: SCREEN_HEIGHT * 0.012,
  },
  productName: {
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#000',
    fontFamily: Nunito.semiBold,
  },
  article: {
    fontSize: SCREEN_HEIGHT * 0.014,
    color: '#777',
    marginTop: SCREEN_HEIGHT * 0.006,
    fontFamily: Nunito.regular,
  },
  color: {
    fontSize: SCREEN_HEIGHT * 0.015,
    color: COLORS.primary,
    marginTop: SCREEN_HEIGHT * 0.008,
    fontFamily: Nunito.semiBold,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SCREEN_HEIGHT * 0.012,
  },
  detailLabel: {
    fontSize: SCREEN_HEIGHT * 0.015,
    color: '#666',
    fontFamily: Nunito.medium,
  },
  detailValue: {
    fontSize: SCREEN_HEIGHT * 0.016,
    color: '#333',
    fontFamily: Nunito.semiBold,
  },
  priceText: {
    fontSize: SCREEN_HEIGHT * 0.017,
    color: COLORS.red,
    fontFamily: Nunito.semiBold,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: SCREEN_HEIGHT * 0.001,
    marginTop: SCREEN_HEIGHT * 0.012,
  },
  totalLabel: {
    fontSize: SCREEN_HEIGHT * 0.017,
    color: '#333',
    fontFamily: Nunito.semiBold,
  },
  totalPrice: {
    fontSize: SCREEN_HEIGHT * 0.019,
    color: COLORS.red,
    fontFamily: Nunito.bold,
  },
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: SCREEN_WIDTH * 0.04,
    marginVertical: SCREEN_HEIGHT * 0.01,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
    paddingVertical: SCREEN_HEIGHT * 0.02,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  summaryTitle: {
    fontSize: SCREEN_HEIGHT * 0.020,
    color: '#333',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
    fontFamily: Nunito.semiBold,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: SCREEN_HEIGHT * 0.008,
  },
  summaryLabel: {
    fontSize: SCREEN_HEIGHT * 0.016,
    color: '#666',
    fontFamily: Nunito.medium,
  },
  summaryValue: {
    fontSize: SCREEN_HEIGHT * 0.017,
    color: '#333',
    fontFamily: Nunito.semiBold,
  },
  grandTotalLabel: {
    fontSize: SCREEN_HEIGHT * 0.019,
    color: '#000',
    fontFamily: Nunito.bold,
  },
  grandTotal: {
    fontSize: SCREEN_HEIGHT * 0.024,
    color: COLORS.primary,
    fontFamily: Nunito.bold,
  },
});

export default OrderSummaryScreen;