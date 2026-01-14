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
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Feather';
import LottieView from 'lottie-react-native';
import fetchData from '../config/fetchData';
import showToast from '../utils/common_fn';
import Nunito from '../utils/fonts';
import { setCartCount } from '../store/ProductSlice';
import { useDispatch } from 'react-redux';
import PaymentModal from '../payment/Paymentmodal'

const ConfirmOrderScreen = ({ route, navigation }) => {
  const { cartItems = [], totalAmount = 0, totalQuantity = 0, tax = 0 } = route.params || {};

  const [selectedPayment, setSelectedPayment] = useState('online');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [orderSuccessModalVisible, setOrderSuccessModalVisible] = useState(false);
  const [orderCancelledModalVisible, setOrderCancelledModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectAddressModalVisible, setSelectAddressModalVisible] = useState(false);
  const [editAddressModalVisible, setEditAddressModalVisible] = useState(false);
  const [addressFormModalVisible, setAddressFormModalVisible] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
  });
  const dispatch = useDispatch();

  const taxAmount = (totalAmount * tax) / 100;
  const finalTotal = totalAmount + taxAmount;

  useEffect(() => {
    loadUserData();
    fetchAddresses();
  }, []);

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
            
            if (freshUserData.success && freshUserData.data) {
              setUserData(freshUserData.data);
              console.log('User Pay Type:', freshUserData.data?.pay_type);
              const payType = freshUserData.data?.pay_type;
              if (payType === 'credit') {
                setSelectedPayment('COD');
              } else {
                setSelectedPayment('online');
              }
            } else {
              setUserData(user);
              setDefaultPaymentMethod(user?.pay_type);
            }
          } catch (error) {
            console.error('Error fetching fresh user data:', error);
            setUserData(user);
            setDefaultPaymentMethod(user?.pay_type);
          }
        } else {
          setUserData(user);
          setDefaultPaymentMethod(user?.pay_type);
        }
      } else {
        setUserData(null);
        setSelectedPayment('online');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserData(null);
      setSelectedPayment('online');
    } finally {
      setUserLoading(false);
    }
  };

  const setDefaultPaymentMethod = (payType) => {
    if (payType === 'credit') {
      setSelectedPayment('COD');
    } else {
      setSelectedPayment('online');
    }
  };

  const isUserCredit = userData?.pay_type === 'credit';
  const isUserAdvance = userData?.pay_type === 'advance';

  const checkUserLimit = () => {
    if (!userData?.user_limit_available_amount && userData?.user_limit_available_amount !== 0) {
      return true;
    }

    const availableLimit = userData.user_limit_available_amount;
    
    if (finalTotal > availableLimit) {
      showToast(
        `Order exceeds available limit. Your available limit is ₹${availableLimit.toLocaleString('en-IN')}`
      );
      return false;
    }
    
    return true;
  };

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
        
        setFormData({
          name: '',
          phone: '',
          address: '',
          city: '',
          pincode: '',
          state: '',
        });
        
        setEditingAddress(null); 
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
    console.log("handle place triggered");
    console.log("Selected Payment:", selectedPayment);
    console.log("User Data:", userData);
    console.log("Is User Credit:", isUserCredit);
    console.log("Is User Advance:", isUserAdvance);
    
    if (!selectedAddress) {
      showToast('Please select a delivery address');
      return;
    }

    // Check user limit before proceeding
    if (!checkUserLimit()) {
      return;
    }

    // For online payment, place order first then open payment modal
    if (selectedPayment === 'online') {
      console.log("Online Payment - Placing order first");
      placeOrderForOnlinePayment();
    } else {
      // For COD, show confirmation modal
      console.log("Opening Confirmation Modal for COD");
      setModalVisible(true);
    }
  };

  const placeOrderForOnlinePayment = async () => {
    setLoading(true);

    const payload = {
      total_amount: finalTotal,
      address_id: selectedAddress.id,
      payment_method: 'online',
      order_pay_type: 'Online',
      product: cartItems.map(item => ({
        product_id: item.product_id,
        size_id: item.size_id,
        quantity: item.quantity,
      })),
    };

    try {
      console.log("Place order payload (online):", payload);
      
      const result = await fetchData.placeOrder(payload);
      console.log("Place order result:", result);
      
      setLoading(false);

      if (result.success && result.data?.order_id) {
        console.log("Order placed successfully, user_order_id:", result.data.order_id);
        setPendingOrderId(result.data.order_id);
        
        setPaymentModalVisible(true);
      } else {
        showToast(result.message || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      console.error("Error placing order:", error);
      showToast('Something went wrong. Please try again.');
    }
  };

  const handlePaymentSuccess = async (paymentData) => {
    console.log('Payment successful, verifying payment:', paymentData);
    
    setPaymentModalVisible(false);
    
    // Payment verified successfully in PaymentModal, just show success
    setOrderSuccessModalVisible(true);
    dispatch(setCartCount(0));
  };

  const handlePaymentFailure = (error) => {
    console.log('Payment failed or cancelled:', error);
    setPaymentModalVisible(false);
    
    if (error.cancelled) {
      // Show order cancelled modal
      setOrderCancelledModalVisible(true);
      return;
    }
    
    // For other payment failures
    showToast(error.message || 'Payment failed. Please try again.');
  };

  const confirmOrderCOD = async () => {
    setModalVisible(false);

    // Check user limit again before final order placement
    if (!checkUserLimit()) {
      return;
    }

    setLoading(true);

    const payload = {
      total_amount: finalTotal,
      address_id: selectedAddress.id,
      payment_method: 'COD',
      order_pay_type: 'COD',
      product: cartItems.map(item => ({
        product_id: item.product_id,
        size_id: item.size_id,
        quantity: item.quantity,
      })),
    };

    try {
      console.log("Place order payload (COD):", payload);
      
      const result = await fetchData.placeOrder(payload);
      setLoading(false);

      if (result.success) {
        setOrderSuccessModalVisible(true);
        dispatch(setCartCount(0));
      } else {
        showToast(result.message || 'Order failed. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      showToast('Something went wrong. Please try again.');
    }
  };

  const handleOrderCancelledOk = () => {
    setOrderCancelledModalVisible(false);
    setPendingOrderId(null);
    // Optionally navigate back or refresh
  };

  if (userLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D45500" />
        <Text style={styles.loadingText}>Loading order details...</Text>
      </View>
    );
  }

  const isLimitExceeded = userData?.user_limit_available_amount !== undefined && 
                          finalTotal > userData.user_limit_available_amount;

  return (
    <>
      {userData?.user_limit_available_amount !== undefined && (
        <View style={[
          styles.userLimitHeader,
          isLimitExceeded && styles.userLimitHeaderExceeded
        ]}>
          <View style={styles.limitContainer}>
            <View style={styles.limitLabelContainer}>
              <Icon name="credit-card" size={20} color={isLimitExceeded ? "#ff4444" : "#D45500"} />
              <Text style={[
                styles.limitLabel,
                isLimitExceeded && styles.limitLabelExceeded
              ]}>
                Available Limit
              </Text>
            </View>
            <Text style={[
              styles.limitAmount,
              isLimitExceeded && styles.limitAmountExceeded
            ]}>
              ₹{userData.user_limit_available_amount.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>
      )}

      <ScrollView 
        style={[styles.container, userData?.user_limit_available_amount !== undefined && styles.containerWithHeader]} 
        showsVerticalScrollIndicator={false}
      >
        {cartItems.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.product?.product_name}
            </Text>
            <View style={styles.cardContent}>
              <Image
                source={{
                  uri: item.product?.product_image || 'https://www.gstatic.com/webp/gallery/4.jpg',
                }}
                style={styles.productImg}
              />
              <View style={styles.productInfo}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Size:</Text>
                  <Text style={styles.value}>{item.size?.size || 'N/A'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Price:</Text>
                  <Text style={styles.price}>₹{item.product?.product_price || '0'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Qty:</Text>
                  <Text style={styles.value}>{item.quantity}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Total:</Text>
                  <Text style={styles.price}>
                    ₹{(item.product?.product_price * item.quantity).toFixed(2)}
                  </Text>
                </View>
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
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax ({tax}%):</Text>
            <Text style={styles.summaryPrice}>₹{taxAmount.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryDivider]}>
            <Text style={styles.summaryTotalLabel}>Grand Total:</Text>
            <Text style={styles.summaryTotalPrice}>₹{finalTotal.toFixed(2)}</Text>
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
          <Text style={styles.sectionTitle}>Payment Option</Text>

          <View style={styles.paymentOptionsContainer}>
            <TouchableOpacity 
              style={[
                styles.paymentOption,
                selectedPayment === 'online' && styles.selectedPaymentOption
              ]} 
              onPress={() => setSelectedPayment('online')}
            >
              <View style={styles.paymentOptionContent}>
                <RadioButton
                  value="online"
                  status={selectedPayment === 'online' ? 'checked' : 'unchecked'}
                  onPress={() => setSelectedPayment('online')}
                  color="#D45500"
                />
                <View style={styles.paymentOptionTextContainer}>
                  <Text style={styles.paymentOptionLabel}>Online Payment</Text>
                  <Text style={styles.paymentOptionSubtext}>Pay instantly via UPI, Card, Net Banking</Text>
                </View>
              </View>
              <Icon name="credit-card" size={22} color={selectedPayment === 'online' ? '#D45500' : '#999'} />
            </TouchableOpacity>

            {isUserCredit ? (
              <TouchableOpacity 
                style={[
                  styles.paymentOption,
                  selectedPayment === 'COD' && styles.selectedPaymentOption
                ]} 
                onPress={() => setSelectedPayment('COD')}
              >
                <View style={styles.paymentOptionContent}>
                  <RadioButton
                    value="COD"
                    status={selectedPayment === 'COD' ? 'checked' : 'unchecked'}
                    onPress={() => setSelectedPayment('COD')}
                    color="#D45500"
                  />
                  <View style={styles.paymentOptionTextContainer}>
                    <Text style={styles.paymentOptionLabel}>Cash on Delivery</Text>
                    <Text style={styles.paymentOptionSubtext}>Pay when you receive your order</Text>
                  </View>
                </View>
                <Icon name="truck" size={22} color={selectedPayment === 'COD' ? '#D45500' : '#999'} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <TouchableOpacity
          style={styles.placeOrderBtn}
          onPress={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.placeOrderText}>
              {isLimitExceeded ? 'Limit Exceeded - Cannot Place Order' : 'Place Order'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* COD Confirmation Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon name="shopping-bag" size={50} color="#D45500" />
            <Text style={styles.modalTitle}>Confirm Your Order</Text>
            <View style={styles.modalDetailsContainer}>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Total Items:</Text>
                <Text style={styles.modalDetailValue}>{totalQuantity}</Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Net Amount:</Text>
                <Text style={styles.modalDetailValue}>₹{totalAmount.toFixed(2)}</Text>
              </View>
              <View style={styles.modalDetailRow}>
                <Text style={styles.modalDetailLabel}>Tax ({tax}%):</Text>
                <Text style={styles.modalDetailValue}>₹{taxAmount.toFixed(2)}</Text>
              </View>
              <View style={[styles.modalDetailRow, styles.modalTotalRow]}>
                <Text style={styles.modalTotalLabel}>Grand Total:</Text>
                <Text style={styles.modalTotalValue}>₹{finalTotal.toFixed(2)}</Text>
              </View>
              <View style={[styles.modalDetailRow, styles.modalPaymentRow]}>
                <Text style={styles.modalDetailLabel}>Payment:</Text>
                <Text style={styles.modalPaymentValue}>Cash on Delivery</Text>
              </View>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#ccc' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#D45500' }]}
                onPress={confirmOrderCOD}
              >
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>Confirm Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Modal for Online Payment */}
      <PaymentModal
        visible={paymentModalVisible}
        onClose={() => {
          console.log("Payment Modal Closed by user");
          setPaymentModalVisible(false);
          setOrderCancelledModalVisible(true);
        }}
        amount={finalTotal}
        userOrderId={pendingOrderId}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentFailure={handlePaymentFailure}
        userDetails={{
          name: userData?.name || '',
          email: userData?.email || '',
          phone: userData?.phone || '',
        }}
      />

      {/* Order Success Modal */}
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
            <Text style={styles.successTitle}>Order Placed {'\n'}Successfully!</Text>
            <Text style={styles.successMessage}>
              Thank you for your purchase!{'\n'}
              Your order is confirmed and will be delivered soon.
            </Text>
            <TouchableOpacity
              style={styles.backToShoppingBtn}
              onPress={() => {
                setOrderSuccessModalVisible(false);
                setPendingOrderId(null);
                navigation.popToTop();
                navigation.navigate('MainDrawer', {
                  screen: 'Tabs',
                  params: {
                    screen: 'Home',
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

      {/* Order Cancelled Modal */}
      <Modal
        transparent
        visible={orderCancelledModalVisible}
        animationType="fade"
        onRequestClose={handleOrderCancelledOk}
      >
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalContent}>
            <View style={styles.cancelledIconContainer}>
              <Icon name="x-circle" size={80} color="#ff4444" />
            </View>
            <Text style={[styles.successTitle, { color: '#ff4444' }]}>
              Order Cancelled
            </Text>
            <Text style={styles.successMessage}>
              Your payment was cancelled.{'\n'}
              The order has been cancelled.
            </Text>
            <TouchableOpacity
              style={[styles.backToShoppingBtn, { backgroundColor: '#ff4444' }]}
              onPress={handleOrderCancelledOk}
            >
              <Text style={styles.backToShoppingText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Address Selection Modal */}
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

      <Modal 
        visible={addressFormModalVisible} 
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddressFormModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <TouchableOpacity 
            style={styles.modalOverlayDismiss}
            activeOpacity={1}
            onPress={() => setAddressFormModalVisible(false)}
          >
            <TouchableOpacity 
              activeOpacity={1} 
              style={styles.formModalContent}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </Text>
                <TouchableOpacity onPress={() => setAddressFormModalVisible(false)}>
                  <Icon name="x" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.formContainer}
                contentContainerStyle={styles.formContentContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
              >
                <Text style={styles.inputLabel}>Name *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Enter your name"
                  autoFocus={false}
                  returnKeyType="next"
                />

                <Text style={styles.inputLabel}>Phone *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  returnKeyType="next"
                />

                <Text style={styles.inputLabel}>Address *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                  placeholder="Enter your address"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  returnKeyType="next"
                />

                 <Text style={styles.inputLabel}>State *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.state}
                  onChangeText={(text) => setFormData({ ...formData, state: text })}
                  placeholder="Enter state"
                  returnKeyType="next"
                />

                <Text style={styles.inputLabel}>City *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.city}
                  onChangeText={(text) => setFormData({ ...formData, city: text })}
                  placeholder="Enter city"
                  returnKeyType="next"
                />

                <Text style={styles.inputLabel}>Pincode *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.pincode}
                  onChangeText={(text) => setFormData({ ...formData, pincode: text })}
                  placeholder="Enter pincode"
                  keyboardType="number-pad"
                  maxLength={6}
                  returnKeyType="done"
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
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  containerWithHeader: { 
    marginTop: 70,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#555',
    fontFamily: Nunito.medium,
  },
  userLimitHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF3E0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#D45500',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userLimitHeaderExceeded: {
    backgroundColor: '#FFE5E5',
    borderBottomColor: '#ff4444',
  },
  limitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  limitLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  limitLabel: {
    fontSize: 15,
    color: '#666',
    fontFamily: Nunito.semiBold,
  },
  limitLabelExceeded: {
    color: '#ff4444',
  },
  limitAmount: {
    fontSize: 20,
    color: '#D45500',
    fontFamily: Nunito.bold,
  },
  limitAmountExceeded: {
    color: '#ff4444',
  },
  cancelledIconContainer: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 12,
    padding: 15,
    elevation: 3,
  },
  productName: {
    fontSize: 16,
    color: '#000',
    fontFamily: Nunito.bold,
    marginBottom: 12,
    lineHeight: 22,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImg: { 
    width: 120, 
    height: 120, 
    borderRadius: 10, 
    marginRight: 15,
    resizeMode: 'cover',
  },
  productInfo: { 
    flex: 1, 
    justifyContent: 'center',
  },
  infoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  label: { 
    fontSize: 15, 
    color: '#666',
    fontFamily: Nunito.medium,
    flex: 0.4,
  },
  value: { 
    fontSize: 15, 
    color: '#000',
    fontFamily: Nunito.semiBold,
    flex: 0.6,
    textAlign: 'right',
    flexWrap: 'wrap',
  },
  price: { 
    fontSize: 16, 
    color: '#D45500',
    fontFamily: Nunito.bold,
    flex: 0.6,
    textAlign: 'right',
  },
  summaryBox: {
    backgroundColor: '#FFF3E0',
    margin: 15,
    padding: 15,
    borderRadius: 12,
  },
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginVertical: 5 
  },
  summaryLabel: { 
    fontSize: 16, 
    color: '#555',
    fontFamily: Nunito.medium,
  },
  summaryValue: { 
    fontSize: 16, 
    color: '#000',
    fontFamily: Nunito.bold,
  },
  summaryPrice: { 
    fontSize: 16, 
    color: '#D45500',
    fontFamily: Nunito.bold,
  },
  summaryDivider: {
    borderTopWidth: 2,
    borderTopColor: '#D45500',
    paddingTop: 10,
    marginTop: 5,
  },
  summaryTotalLabel: {
    fontSize: 18,
    color: '#333',
    fontFamily: Nunito.bold,
  },
  summaryTotalPrice: {
    fontSize: 20,
    color: '#D45500',
    fontFamily: Nunito.bold,
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
    fontFamily: Nunito.semiBold,
    marginBottom: 12,
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
    fontFamily: Nunito.semiBold,
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
    fontFamily: Nunito.semiBold,
  },
  addressText: { 
    fontSize: 14, 
    color: '#555', 
    marginBottom: 3,
    fontFamily: Nunito.regular,
  },
  noAddressText: { 
    fontSize: 14, 
    color: '#999', 
    fontStyle: 'italic',
    fontFamily: Nunito.regular,
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
    fontFamily: Nunito.semiBold,
  },
  paymentOptionsContainer: {
    gap: 12,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  selectedPaymentOption: {
    borderColor: '#D45500',
    backgroundColor: '#FFF3E0',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentOptionTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  paymentOptionLabel: {
    fontSize: 16,
    color: '#333',
    fontFamily: Nunito.semiBold,
    marginBottom: 2,
  },
  paymentOptionSubtext: {
    fontSize: 12,
    color: '#666',
    fontFamily: Nunito.regular,
  },
  placeOrderBtn: {
    backgroundColor: '#D45500',
    marginHorizontal: 15,
    marginBottom: "15%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeOrderText: { 
    color: '#fff', 
    fontSize: 18,
    fontFamily: Nunito.semiBold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlayDismiss: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    width: '100%',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
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
    fontFamily: Nunito.bold,
    textAlign: 'center',
  },
  modalDetailsContainer: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    marginVertical: 15,
  },
  modalDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  modalDetailLabel: {
    fontSize: 15,
    color: '#666',
    fontFamily: Nunito.medium,
  },
  modalDetailValue: {
    fontSize: 15,
    color: '#000',
    fontFamily: Nunito.semiBold,
  },
  modalTotalRow: {
    borderTopWidth: 2,
    borderTopColor: '#D45500',
    paddingTop: 12,
    marginTop: 8,
  },
  modalTotalLabel: {
    fontSize: 17,
    color: '#333',
    fontFamily: Nunito.bold,
  },
  modalTotalValue: {
    fontSize: 18,
    color: '#D45500',
    fontFamily: Nunito.bold,
  },
  modalPaymentRow: {
    backgroundColor: '#FFF3E0',
    marginHorizontal: -15,
    marginTop: 10,
    marginBottom: -15,
    padding: 15,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  modalPaymentValue: {
    fontSize: 15,
    color: '#D45500',
    fontFamily: Nunito.semiBold,
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
    fontFamily: Nunito.semiBold,
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
    fontFamily: Nunito.bold,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    padding: 10,
    lineHeight: 24,
    fontFamily: Nunito.regular,
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
    fontFamily: Nunito.semiBold,
  },
  addressModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '70%',
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
    fontFamily: Nunito.semiBold,
  },
  formModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
    width: '100%',
  },
  formContainer: { 
    flex: 1,
    padding: 20,
  },
  formContentContainer: {
    paddingBottom: 40,
  },
  inputLabel: { 
    fontSize: 15, 
    color: '#333', 
    marginBottom: 8, 
    marginTop: 10,
    fontFamily: Nunito.semiBold,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#fff',
    fontFamily: Nunito.regular,
  },
  textArea: { 
    height: 80, 
    textAlignVertical: 'top',
  },
  saveBtn: {
    backgroundColor: '#D45500',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  saveBtnText: { 
    color: '#fff', 
    fontSize: 16,
    fontFamily: Nunito.semiBold,
  },
});

export default ConfirmOrderScreen;