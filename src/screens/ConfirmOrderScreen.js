import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import LottieView from 'lottie-react-native';
import fetchData from '../config/fetchData';
import showToast from '../utils/common_fn';
import poppins from '../utils/fonts';

const ConfirmOrderScreen = ({ route, navigation }) => {
  const { cartItems = [], totalAmount = 0, totalQuantity = 0 } = route.params || {};

  const [selectedPayment, setSelectedPayment] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [orderSuccessModalVisible, setOrderSuccessModalVisible] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectAddressModalVisible, setSelectAddressModalVisible] = useState(false);
  const [editAddressModalVisible, setEditAddressModalVisible] = useState(false);
  const [addressFormModalVisible, setAddressFormModalVisible] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const result = await fetchData.getAddresses();
      if (result.success && result.data) {
        setAddresses(result.data);
        if (result.data.length > 0 && !selectedAddress) {
          setSelectedAddress(result.data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      showToast('Failed to load addresses');
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setFormData({
      name: '',
      phone: '',
      address: '',
      city: '',
      pincode: '',
      state: '',
    });
    setEditAddressModalVisible(false);
    setAddressFormModalVisible(true);
  };

  const handleEditAddressClick = (address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name || '',
      phone: address.phone || '',
      address: address.address || '',
      city: address.city || '',
      pincode: address.pincode || '',
      state: address.state || '',
    });
    setEditAddressModalVisible(false);
    setAddressFormModalVisible(true);
  };

  const handleDeleteAddress = (addressId) => {
    if (global.confirm) {
      global.confirm({
        title: 'Delete Address',
        message: 'Are you sure you want to delete this address?',
        buttons: [
          { text: 'Cancel', type: 'cancel' },
          {
            text: 'Delete',
            type: 'destructive',
            onPress: async () => {
              try {
                const result = await fetchData.deleteAddress(addressId);
                if (result.success) {
                  showToast('Address deleted successfully');
                  fetchAddresses();
                  if (selectedAddress?.id === addressId) {
                    setSelectedAddress(null);
                  }
                } else {
                  showToast(result.message || 'Failed to delete address');
                }
              } catch (error) {
                showToast('Failed to delete address');
              }
            },
          },
        ],
      });
    } else {
      Alert.alert(
        'Delete Address',
        'Are you sure you want to delete this address?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                const result = await fetchData.deleteAddress(addressId);
                if (result.success) {
                  showToast('Address deleted successfully');
                  fetchAddresses();
                  if (selectedAddress?.id === addressId) {
                    setSelectedAddress(null);
                  }
                } else {
                  showToast(result.message || 'Failed to delete address');
                }
              } catch (error) {
                showToast('Failed to delete address');
              }
            },
          },
        ]
      );
    }
  };

  const handleSaveAddress = async () => {
    if (!formData.name || !formData.phone || !formData.address || 
        !formData.city || !formData.pincode || !formData.state) {
      showToast('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (editingAddress) {
        result = await fetchData.updateAddress(editingAddress.id, formData);
      } else {
        result = await fetchData.addAddress(formData);
      }

      if (result.success) {
        showToast(editingAddress ? 'Address updated successfully' : 'Address added successfully');
        setAddressFormModalVisible(false);
        fetchAddresses();
      } else {
        showToast(result.message || 'Failed to save address');
      }
    } catch (error) {
      showToast('Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      showToast('Please select a delivery address');
      return;
    }
    setModalVisible(true);
  };

  const confirmOrder = async () => {
    setModalVisible(false);
    setLoading(true);

    const payload = {
      total_amount: totalAmount,
      address_id: selectedAddress.id,
      payment_method: selectedPayment,
      product: cartItems.map(item => ({
        product_id: item.product_id,
        size_id: item.size_id,
        quantity: item.quantity,
      })),
    };

    try {
      const result = await fetchData.placeOrder(payload);
      setLoading(false);

      if (result.success) {
        setOrderSuccessModalVisible(true);
      } else {
        showToast(result.message || 'Order failed. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      showToast('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <ScrollView style={styles.container}>
        {cartItems.map((item, index) => (
          <View key={index} style={styles.card}>
            <Image
              source={{
                uri: item.product?.product_image || 'https://via.placeholder.com/80',
              }}
              style={styles.productImg}
            />
            <View style={styles.productInfo}>
              <View style={styles.row}>
                <Text style={styles.label}>Article:</Text>
                <Text style={styles.value}>{item.product?.product_name}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Size:</Text>
                <Text style={styles.value}>{item.size?.size || 'N/A'}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Price:</Text>
                <Text style={styles.price}>₹{item.product?.product_price}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Qty:</Text>
                <Text style={styles.value}>{item.quantity}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Total:</Text>
                <Text style={styles.price}>
                  ₹{(item.product?.product_price * item.quantity).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.summaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Quantity:</Text>
            <Text style={styles.summaryValue}>{totalQuantity}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Net Amount:</Text>
            <Text style={styles.summaryPrice}>₹{totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.changeBtn}
                onPress={() => setSelectAddressModalVisible(true)}
              >
                <Text style={styles.changeBtnText}>Change</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.editIconBtn}
                onPress={() => setEditAddressModalVisible(true)}
              >
                <Icon name="edit-2" size={20} color="#D45500" />
              </TouchableOpacity>
            </View>
          </View>
          
          {loadingAddresses ? (
            <ActivityIndicator color="#D45500" />
          ) : selectedAddress ? (
            <View style={styles.addressCard}>
              <Text style={styles.addressName}>{selectedAddress.name}</Text>
              <Text style={styles.addressText}>{selectedAddress.phone}</Text>
              <Text style={styles.addressText}>{selectedAddress.address}</Text>
              <Text style={styles.addressText}>
                {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
              </Text>
            </View>
          ) : (
            <Text style={styles.noAddressText}>No address selected</Text>
          )}

          <TouchableOpacity style={styles.addAddressBtn} onPress={handleAddAddress}>
            <Icon name="plus" size={18} color="#D45500" />
            <Text style={styles.addAddressText}>Add New Address</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Option:</Text>

          <TouchableOpacity style={styles.radioRow} onPress={() => setSelectedPayment('online')}>
            <RadioButton
              value="online"
              status={selectedPayment === 'online' ? 'checked' : 'unchecked'}
              onPress={() => setSelectedPayment('online')}
              color="#D45500"
            />
            <Text style={styles.radioLabel}>Online Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.radioRow} onPress={() => setSelectedPayment('COD')}>
            <RadioButton
              value="COD"
              status={selectedPayment === 'COD' ? 'checked' : 'unchecked'}
              onPress={() => setSelectedPayment('COD')}
              color="#D45500"
            />
            <Text style={styles.radioLabel}>Cash on Delivery (COD)</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.placeOrderBtn, loading && { opacity: 0.7 }]}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.placeOrderText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon name="shopping-bag" size={50} color="#D45500" />
            <Text style={styles.modalTitle}>Confirm Your Order</Text>
            <Text style={styles.modalText}>
              Total Items: {totalQuantity}{'\n'}
              Total Amount: ₹{totalAmount.toFixed(2)}{'\n'}
              Payment: {selectedPayment === 'COD' ? 'Cash on Delivery' : 'Online'}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#ccc' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#D45500' }]}
                onPress={confirmOrder}
              >
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Confirm Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={orderSuccessModalVisible}
        animationType="fade"
        onRequestClose={() => setOrderSuccessModalVisible(false)}
      >
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalContent}>
            <LottieView
              source={require('../../assets/animations/success.json')} 
              autoPlay
              loop={false}
              style={{ width: 200, height: 200 }}
            />
            <Text style={styles.successTitle}>Order Placed Successfully!</Text>
            <Text style={styles.successMessage}>
              Thank you for your purchase!{'\n'}
              Your order is confirmed and will be delivered soon.
            </Text>
            <TouchableOpacity
              style={styles.backToShoppingBtn}
              onPress={() => {
                setOrderSuccessModalVisible(false);
                navigation.popToTop();
                navigation.navigate('MainDrawer', {
                  screen: 'Tabs',
                  params: {
                    screen: 'Cart',
                    params: { refreshCart: true },
                  },
                });
              }}
            >
              <Text style={styles.backToShoppingText}>Back to Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={selectAddressModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.addressModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Address</Text>
              <TouchableOpacity onPress={() => setSelectAddressModalVisible(false)}>
                <Icon name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.addressList}>
              {addresses.map((address) => (
                <TouchableOpacity
                  key={address.id}
                  style={[
                    styles.selectAddressCard,
                    selectedAddress?.id === address.id && styles.selectedAddressCard
                  ]}
                  onPress={() => {
                    setSelectedAddress(address);
                    setSelectAddressModalVisible(false);
                  }}
                >
                  <View style={styles.addressRadioRow}>
                    <RadioButton
                      value={address.id}
                      status={selectedAddress?.id === address.id ? 'checked' : 'unchecked'}
                      color="#D45500"
                    />
                    <View style={styles.addressDetails}>
                      <Text style={styles.addressName}>{address.name}</Text>
                      <Text style={styles.addressText}>{address.phone}</Text>
                      <Text style={styles.addressText}>{address.address}</Text>
                      <Text style={styles.addressText}>
                        {address.city}, {address.state} - {address.pincode}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={editAddressModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.addressModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Manage Addresses</Text>
              <TouchableOpacity onPress={() => setEditAddressModalVisible(false)}>
                <Icon name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.addressList}>
              {addresses.map((address) => (
                <View key={address.id} style={styles.editAddressCard}>
                  <View style={styles.editAddressContent}>
                    <Text style={styles.addressName}>{address.name}</Text>
                    <Text style={styles.addressText}>{address.phone}</Text>
                    <Text style={styles.addressText}>{address.address}</Text>
                    <Text style={styles.addressText}>
                      {address.city}, {address.state} - {address.pincode}
                    </Text>
                  </View>
                  <View style={styles.editDeleteBtnRow}>
                    <TouchableOpacity
                      style={styles.deleteIconBtn}
                      onPress={() => handleDeleteAddress(address.id)}
                    >
                      <Icon name="trash-2" size={18} color="#fff" />
                      <Text style={styles.deleteBtnText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={addressFormModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.formModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </Text>
              <TouchableOpacity onPress={() => setAddressFormModalVisible(false)}>
                <Icon name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.formContainer}>
              <Text style={styles.inputLabel}>Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter your name"
              />
              <Text style={styles.inputLabel}>Phone *</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                maxLength={10}
              />
              <Text style={styles.inputLabel}>Address *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                placeholder="Enter your address"
                multiline
                numberOfLines={3}
              />
              <Text style={styles.inputLabel}>City *</Text>
              <TextInput
                style={styles.input}
                value={formData.city}
                onChangeText={(text) => setFormData({ ...formData, city: text })}
                placeholder="Enter city"
              />
              <Text style={styles.inputLabel}>State *</Text>
              <TextInput
                style={styles.input}
                value={formData.state}
                onChangeText={(text) => setFormData({ ...formData, state: text })}
                placeholder="Enter state"
              />
              <Text style={styles.inputLabel}>Pincode *</Text>
              <TextInput
                style={styles.input}
                value={formData.pincode}
                onChangeText={(text) => setFormData({ ...formData, pincode: text })}
                placeholder="Enter pincode"
                keyboardType="number-pad"
                maxLength={6}
              />
              <TouchableOpacity
                style={[styles.saveBtn, loading && { opacity: 0.7 }]}
                onPress={handleSaveAddress}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>
                    {editingAddress ? 'Update Address' : 'Save Address'}
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 12,
    padding: 12,
    elevation: 3,
  },
  productImg: { width: 80, height: 80, borderRadius: 8, marginRight: 12 },
  productInfo: { flex: 1, justifyContent: 'space-between' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { 
    fontSize: 14, 
    color: '#555',
    fontFamily: poppins.medium,
  },
  value: { 
    fontSize: 14, 
    color: '#000',
    fontFamily: poppins.semiBold,
  },
  price: { 
    fontSize: 15, 
    color: '#D45500',
    fontFamily: poppins.semiBold,
  },
  summaryBox: {
    backgroundColor: '#FFF3E0',
    margin: 15,
    padding: 15,
    borderRadius: 12,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
  summaryLabel: { 
    fontSize: 16, 
    color: '#555',
    fontFamily: poppins.medium,
  },
  summaryValue: { 
    fontSize: 16, 
    color: '#000',
    fontFamily: poppins.bold,
  },
  summaryPrice: { 
    fontSize: 18, 
    color: '#D45500',
    fontFamily: poppins.bold,
  },
  section: { marginHorizontal: 15, marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: { 
    fontSize: 17, 
    color: '#333',
    fontFamily: poppins.semiBold,
  },
  headerButtons: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  changeBtn: {
    backgroundColor: '#D45500',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 6,
  },
  changeBtnText: { 
    color: '#fff', 
    fontSize: 14,
    fontFamily: poppins.semiBold,
  },
  editIconBtn: { padding: 5 },
  addressCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  addressName: { 
    fontSize: 16, 
    color: '#000', 
    marginBottom: 5,
    fontFamily: poppins.semiBold,
  },
  addressText: { 
    fontSize: 14, 
    color: '#555', 
    marginBottom: 3,
    fontFamily: poppins.regular,
  },
  noAddressText: { 
    fontSize: 14, 
    color: '#999', 
    fontStyle: 'italic',
    fontFamily: poppins.regular,
  },
  addAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D45500',
    borderStyle: 'dashed',
    marginTop: 10,
  },
  addAddressText: { 
    fontSize: 15, 
    color: '#D45500', 
    marginLeft: 8,
    fontFamily: poppins.semiBold,
  },
  radioRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  radioLabel: { 
    fontSize: 16, 
    marginLeft: 8, 
    color: '#333',
    fontFamily: poppins.medium,
  },
  placeOrderBtn: {
    backgroundColor: '#D45500',
    marginHorizontal: 15,
    marginBottom: "10%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeOrderText: { 
    color: '#fff', 
    fontSize: 18,
    fontFamily: poppins.semiBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 16,
    width: '85%',
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: { 
    fontSize: 20, 
    marginVertical: 10,
    fontFamily: poppins.bold,
  },
  modalText: { 
    fontSize: 16, 
    textAlign: 'center', 
    color: '#555', 
    marginBottom: 20, 
    lineHeight: 24,
    fontFamily: poppins.regular,
  },
  modalButtons: { flexDirection: 'row', gap: 15, marginTop: 10 },
  modalBtn: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  modalBtnText: { 
    fontSize: 16,
    fontFamily: poppins.semiBold,
  },
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    width: '80%',
    elevation: 15,
  },
  successTitle: {
    fontSize: 22,
    color: '#D45500',
    fontFamily: poppins.bold,
  },
  successMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    padding: 10,
    lineHeight: 24,
    fontFamily: poppins.regular,
  },
  backToShoppingBtn: {
    backgroundColor: '#D45500',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 5,
  },
  backToShoppingText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: poppins.semiBold,
  },
  addressModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  addressList: { padding: 15 },
  selectAddressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    elevation: 2,
  },
  selectedAddressCard: {
    borderColor: '#D45500',
    backgroundColor: '#FFF3E0',
  },
  addressRadioRow: { flexDirection: 'row', alignItems: 'flex-start' },
  addressDetails: { flex: 1, marginLeft: 10 },
  editAddressCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
  },
  editAddressContent: { marginBottom: 12 },
  editDeleteBtnRow: { flexDirection: 'row', gap: 10 },
  deleteIconBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ff4444',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  deleteBtnText: { 
    color: '#fff', 
    fontSize: 14,
    fontFamily: poppins.semiBold,
  },
  formModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  formContainer: { padding: 20 },
  inputLabel: { 
    fontSize: 15, 
    color: '#333', 
    marginBottom: 8, 
    marginTop: 10,
    fontFamily: poppins.semiBold,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#fff',
    fontFamily: poppins.regular,
  },
  textArea: { height: 80, textAlignVertical: 'top' },
  saveBtn: {
    backgroundColor: '#D45500',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  saveBtnText: { 
    color: '#fff', 
    fontSize: 16,
    fontFamily: poppins.semiBold,
  },
});

export default ConfirmOrderScreen;