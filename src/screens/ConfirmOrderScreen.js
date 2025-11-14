import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';

const ConfirmOrderScreen = ({ navigation }) => {
  const product = {
    id: 'BC1303',
    name: 'Article:',
    color: 'TAN',
    subTotal: 905,
    quantity: 5,
    imageUrl:
      'https://via.placeholder.com/80x80/8B4513/FFFFFF?text=Shoe', 
  };

  const billing = {
    name: 'Demo User',
    phone: '5555555555',
    address: 'Ramanathapuram, Tamil Nadu-641045',
  };

  const [selectedPayment, setSelectedPayment] = useState('online');

  const QuantityButton = ({ label }) => (
    <TouchableOpacity style={styles.qtyBtn}>
      <Text style={styles.qtyText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>

      <View style={styles.card}>
        <Image source={{ uri: product.imageUrl }} style={styles.productImg} />
        <View style={styles.productInfo}>
          <View style={styles.row}>
            <Text style={styles.label}>Article:</Text>
            <Text style={styles.value}>{product.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Color:</Text>
            <Text style={styles.value}>{product.color}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Sub Total:</Text>
            <Text style={styles.price}>₹{product.subTotal}</Text>
          </View>

          <View style={styles.qtyRow}>
            <QuantityButton label="1/1" />
            <QuantityButton label="2/1" />
            <QuantityButton label="3/1" />
            <QuantityButton label="4/1" />
            <QuantityButton label="5/1" />
          </View>

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>
              Total Quantity: <Text style={styles.totalValue}>{product.quantity}</Text>
            </Text>
            <Text style={styles.totalLabel}>
              Net Amount: <Text style={styles.totalPrice}>₹{product.subTotal}</Text>
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Billing Information:</Text>
        <Text style={styles.billingText}>{billing.name}</Text>
        <Text style={styles.billingText}>{billing.phone}</Text>
        <Text style={styles.billingText}>{billing.address}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Option:</Text>

        <TouchableOpacity
          style={styles.radioRow}
          onPress={() => setSelectedPayment('online')}
        >
          <RadioButton
            value="online"
            status={selectedPayment === 'online' ? 'checked' : 'unchecked'}
            onPress={() => setSelectedPayment('online')}
            color="#D45500"
          />
          <Text style={styles.radioLabel}>Online Payment</Text>
          <View style={styles.dotOrange} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.radioRow}
          onPress={() => setSelectedPayment('cod')}
        >
          <RadioButton
            value="cod"
            status={selectedPayment === 'cod' ? 'checked' : 'unchecked'}
            onPress={() => setSelectedPayment('cod')}
            color="#D45500"
          />
          <Text style={styles.radioLabel}>Cash on delivery</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.placeOrderBtn}>
        <Text style={styles.placeOrderText}>Place Order →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#D45500',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  headerTitle: { fontSize: 20, fontWeight: '600', color: '#fff' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  productImg: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  productInfo: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { fontSize: 15, color: '#555' },
  value: { fontSize: 15, fontWeight: '600', color: '#000' },
  price: { fontSize: 15, fontWeight: '600', color: '#D45500' },
  qtyRow: { flexDirection: 'row', marginTop: 8, marginBottom: 12 },
  qtyBtn: {
    backgroundColor: '#eee',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
  },
  qtyText: { fontSize: 13, color: '#555' },
  totalBox: {
    backgroundColor: '#FFF3E0',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  totalLabel: { fontSize: 15, color: '#555' },
  totalValue: { fontWeight: '600', color: '#000' },
  totalPrice: { fontWeight: '600', color: '#D45500' },
  section: { marginHorizontal: 15, marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '600', marginBottom: 8, color: '#333' },
  billingText: { fontSize: 15, color: '#444', marginBottom: 2 },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioLabel: { fontSize: 16, marginLeft: 8, color: '#333' },
  dotOrange: { width: 8, height: 8, backgroundColor: '#D45500', borderRadius: 4, marginLeft: 'auto' },
  placeOrderBtn: {
    backgroundColor: '#D45500',
    marginHorizontal: 15,
    marginBottom: 30,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeOrderText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});

export default ConfirmOrderScreen;