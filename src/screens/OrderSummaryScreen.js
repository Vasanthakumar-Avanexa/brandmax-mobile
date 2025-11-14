import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Divider } from 'react-native-elements';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import poppins from '../utils/fonts'; // Adjust path if needed

const COLORS = {
  white: '#ffffff',
  black: '#000000',
  red: '#e74c3c',
  green: '#27ae60',
  grey: '#95a5a6',
  lightGrey: '#ecf0f1',
  border: '#ddd',
  primary: '#D45500',
  quantityStock: '#2ecc71',
  orderProductColor: '#D45500',
};

const FONT = {
  small: 14,
  medium: 15,
  large: 16,
  header: 18,
  title: 20,
};

// Reusable Status Icon + Text
const StatusBadge = ({ status, history }) => {
  const getIcon = () => {
    if (status === 'In Progress') return 'progress-check';
    if (status === 'Cancelled') return 'cancel';
    return 'checkbox-marked-circle-outline';
  };

  const getColor = () => {
    if (status === 'In Progress') return COLORS.green;
    if (status === 'Cancelled') return COLORS.red;
    return COLORS.quantityStock;
  };

  return (
    <View style={styles.statusView}>
      <MIcon name={getIcon()} size={22} color={getColor()} />
      {history.map((h, i) => (
        <Text key={i} style={styles.statusName}>
          {h.name}
        </Text>
      ))}
    </View>
  );
};

// Size Tag Component
const SizeTag = ({ size, quantity }) => (
  <View style={styles.sizeTag}>
    <Text style={styles.sizeName}>{size}</Text>
    <Text style={styles.sizeQty}>/ {quantity}</Text>
  </View>
);

// Product Item
const ProductItem = ({ product }) => {
  const { product_name, total_quantity, product_size } = product;

  return (
    <View style={styles.itemSingle}>
      <View style={styles.itemHeader}>
        <Text style={styles.productName} numberOfLines={2}>
          {product_name}
        </Text>
        <Text style={styles.quantityLabel}>
          Quantity:{' '}
          <Text style={styles.quantityValue}>{total_quantity}</Text>
        </Text>
      </View>

      <Divider style={styles.itemDivider} />

      <View style={styles.sizeTagsContainer}>
        {product_size?.map((s, i) => (
          <SizeTag key={i} size={s.size_name} quantity={s.quantity} />
        ))}
      </View>
    </View>
  );
};

const OrderSummaryScreen = ({ route }) => {
  // Use route.params or fallback to dummy data
  const order = route?.params?.item || DUMMY_ORDER;

  const {
    order_id,
    date,
    total,
    name: status,
    history,
    customer_name,
    phone,
    address,
    city,
    state,
    pincode,
    products,
    payment_method,
  } = order;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerRow}>
            <Text style={styles.label}>Order ID:</Text>
            <Text style={styles.orderId}>#{order_id}</Text>
          </View>
          <View style={styles.headerRow}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
          <View style={styles.headerRow}>
            <Text style={styles.label}>Total:</Text>
            <Text style={styles.total}>₹{total}</Text>
          </View>
          <View style={styles.headerRow}>
            <Text style={styles.label}>Status:</Text>
            <StatusBadge status={status} history={history} />
          </View>
        </View>

        {/* Billing Info */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Billing Information</Text>
          <Divider style={styles.divider} />
          <View style={styles.billingDetails}>
            <Text style={styles.billingText}>{customer_name}</Text>
            <Text style={styles.billingText}>{phone}</Text>
            <Text style={styles.billingText} numberOfLines={2}>
              {address}
            </Text>
            <Text style={styles.billingText}>{city}</Text>
            <Text style={styles.billingText}>
              {state} - {pincode}
            </Text>
          </View>
        </View>

        {/* Item Details */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Item Details</Text>
          <Divider style={styles.divider} />
          {products.map((p, i) => (
            <ProductItem key={i} product={p} />
          ))}
        </View>

        {/* Payment */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Payment Option</Text>
          <Divider style={styles.divider} />
          <Text style={styles.paymentText}>{payment_method}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderSummaryScreen;

// Dummy Data (for testing without route.params)
const DUMMY_ORDER = {
  order_id: 'ORD123456',
  date: '12 Apr 2025',
  total: 2499,
  name: 'In Progress',
  history: [{ name: 'In Progress' }],
  customer_name: 'John Doe',
  phone: '+91 98765 43210',
  address: '123, MG Road, Near City Center',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  payment_method: 'Cash on Delivery',
  products: [
    {
      product_name: 'Premium Leather Shoes - Black',
      total_quantity: 5,
      product_size: [
        { size_name: '7', quantity: 2 },
        { size_name: '8', quantity: 1 },
        { size_name: '9', quantity: 2 },
      ],
    },
    {
      product_name: 'Casual Sneakers - White',
      total_quantity: 3,
      product_size: [
        { size_name: '8', quantity: 1 },
        { size_name: '9', quantity: 2 },
      ],
    },
  ],
};

// Local Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 12,
  },
  headerCard: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    marginHorizontal: 5,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  label: {
    flex: 1,
    fontSize: FONT.medium,
    fontFamily: poppins.semiBold,
    color: COLORS.black,
  },
  orderId: {
    color: COLORS.orderProductColor,
    fontSize: FONT.header,
    fontFamily: poppins.medium,
  },
  date: {
    color: COLORS.black,
    fontSize: FONT.medium,
  },
  total: {
    color: COLORS.red,
    fontSize: FONT.header,
    fontFamily: poppins.medium,
  },
  statusView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  statusName: {
    marginLeft: 6,
    color: COLORS.black,
    fontSize: FONT.medium,
    fontFamily: poppins.semiBold,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: FONT.header,
    fontFamily: poppins.semiBold,
    color: COLORS.black,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  billingDetails: {
    marginTop: 8,
  },
  billingText: {
    fontSize: FONT.large,
    fontFamily: poppins.medium,
    color: COLORS.black,
    marginVertical: 4,
  },
  itemSingle: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderRadius: 8,
    marginVertical: 8,
    padding: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    flex: 1,
    fontSize: FONT.large,
    fontFamily: poppins.semiBold,
    color: COLORS.black,
    marginRight: 10,
  },
  quantityLabel: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    fontSize: FONT.medium,
    fontFamily: poppins.medium,
    color: COLORS.black,
  },
  quantityValue: {
    color: COLORS.red,
    fontFamily: poppins.medium,
  },
  itemDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 10,
  },
  sizeTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },
  sizeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.grey,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sizeName: {
    fontSize: 14,
    fontFamily: poppins.medium,
    color: COLORS.black,
    width: 22,
    height: 22,
    textAlign: 'center',
    textAlignVertical: 'center',
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: 11,
  },
  sizeQty: {
    fontSize: FONT.small,
    fontFamily: poppins.medium,
    color: COLORS.black,
    marginLeft: 6,
  },
  paymentText: {
    fontSize: FONT.large,
    fontFamily: poppins.medium,
    color: COLORS.black,
    textAlign: 'center',
    marginVertical: 10,
  },
});