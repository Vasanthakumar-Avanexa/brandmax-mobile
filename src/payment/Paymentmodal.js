import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import RazorpayCheckout from 'react-native-razorpay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import fetchData from '../config/fetchData';
import showToast from '../utils/common_fn';
import Nunito from '../utils/fonts';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const COLORS = {
  primary: '#D45500',
  success: '#27ae60',
  error: '#e74c3c',
  warning: '#F39C12',
  dark: '#2c3e50',
  light: '#ecf0f1',
  white: '#ffffff',
  gray: '#95a5a6',
  lightGray: '#bdc3c7',
};

const PaymentModal = ({
  visible,
  onClose,
  amount,
  userOrderId,
  onPaymentSuccess,
  onPaymentFailure,
  userDetails = {},
  showAmountInput = false,
  remainingBalance = 0,
}) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('confirm');
  const [paymentResult, setPaymentResult] = useState(null);
  const [manualAmount, setManualAmount] = useState('');
  const [amountError, setAmountError] = useState('');

  useEffect(() => {
    if (visible) {
      console.log(
        'Payment Modal opened | amount:',
        amount,
        'remainingBalance:',
        remainingBalance,
        'showAmountInput:',
        showAmountInput,
      );
      setPaymentResult(null);
      setLoading(false);
      setStep('confirm');
      setManualAmount('');
      setAmountError('');
    } else {
      console.log('Payment Modal closing → reset');
      setStep('confirm');
      setPaymentResult(null);
      setLoading(false);
      setManualAmount('');
      setAmountError('');
    }
  }, [visible, amount, userOrderId, showAmountInput, remainingBalance]);

  const validateAmount = () => {
    if (showAmountInput) {
      const numAmount = parseFloat(manualAmount);
      const remaining = parseFloat(remainingBalance) || 0;

      if (!manualAmount || manualAmount.trim() === '') {
        setAmountError('Please enter an amount');
        return false;
      }

      if (isNaN(numAmount) || numAmount <= 0) {
        setAmountError('Please enter a valid amount');
        return false;
      }

      if (numAmount < 1) {
        setAmountError('Minimum amount is ₹1');
        return false;
      }

      if (numAmount > remaining) {
        setAmountError(`Amount cannot exceed ₹${remaining.toFixed(2)}`);
        showToast(`Maximum payment amount is ₹${remaining.toFixed(2)}`);
        return false;
      }

      setAmountError('');
      return true;
    }
    return true;
  };

  const getPaymentAmount = () => {
    if (showAmountInput) {
      return parseFloat(manualAmount) || 0;
    }
    return parseFloat(amount) || 0;
  };

  const updateRemainingBalance = async paidAmount => {
    try {
      const currentRemaining = parseFloat(remainingBalance) || 0;
      const newRemaining = Math.max(0, currentRemaining - paidAmount);

      await AsyncStorage.setItem('RemainingBalance', newRemaining.toString());
      console.log('Updated remaining balance:', newRemaining);

      return newRemaining;
    } catch (error) {
      console.error('Error updating remaining balance:', error);
    }
  };

  const createRazorpayOrder = async () => {
    try {
      setLoading(true);
      const paymentAmount = getPaymentAmount();
      const response = await fetchData.createOrder(paymentAmount);

      if (response?.success && response?.data) {
        return response.data;
      } else {
        throw new Error(response?.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Create Order Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async paymentData => {
    try {
      setLoading(true);
      const paymentAmount = getPaymentAmount();

      const verificationData = {
        order_id: paymentData.razorpay_order_id,
        payment_id: paymentData.razorpay_payment_id,
        amount: paymentAmount,
        order_pay_type: showAmountInput ? 'COD' : 'Online',
        user_order_id: userOrderId,
      };

      const headers = {
        'x-razorpay-signature': paymentData.razorpay_signature,
      };

      console.log('Verifying payment with payload:', verificationData);

      const response = await fetchData.verifyOrder(verificationData, headers);

      if (response?.success) {
        await updateRemainingBalance(paymentAmount);
        return true;
      } else {
        throw new Error(response?.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Verify Payment Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!validateAmount()) {
      return;
    }

    try {
      setLoading(true);
      setPaymentResult(null);

      const orderData = await createRazorpayOrder();

      if (!orderData || !orderData.order_id) {
        throw new Error('Invalid order data received');
      }

      const paymentAmount = getPaymentAmount();

      const options = {
        description:
          orderData.description || `Payment for Order #${userOrderId || 'N/A'}`,
        image: orderData.image,
        currency: orderData.currency || 'INR',
        key: orderData.key,
        amount: paymentAmount * 100,
        order_id: orderData.order_id,
        name: orderData.name,
        prefill: {
          email: orderData.prefill?.email || userDetails.email || '',
          contact: orderData.prefill?.contact || userDetails.phone || '',
          name: orderData.prefill?.name || userDetails.name || '',
        },
        theme: {
          color: orderData.theme?.color || COLORS.primary,
        },
      };

      setLoading(false);

      RazorpayCheckout.open(options)
        .then(async data => {
          try {
            setLoading(true);
            const isVerified = await verifyPayment(data);

            if (isVerified) {
              const successData = {
                ...data,
                amount: paymentAmount,
                userOrderId,
                verified: true,
              };

              setPaymentResult({ type: 'success', data: successData });
              onPaymentSuccess?.(successData);
            }
          } catch (verifyError) {
            const failureData = {
              error: verifyError,
              paymentData: data,
              verified: false,
              message: 'Payment verification failed',
              paymentId: data.razorpay_payment_id,
            };

            setPaymentResult({ type: 'failed', data: failureData });
            onPaymentFailure?.(failureData);
          } finally {
            setLoading(false);
          }
        })
        .catch(error => {
          console.log('Razorpay error:', error);

          if (error.code === '2' || error.code === 2) {
            const cancelData = {
              error,
              message: 'Payment cancelled by user',
              cancelled: true,
            };
            onPaymentFailure?.(cancelData);
          } else {
            const failureData = {
              error,
              message:
                error.description ||
                error.message ||
                'Payment could not be completed',
              cancelled: false,
            };

            setPaymentResult({ type: 'failed', data: failureData });
            onPaymentFailure?.(failureData);
          }
        });
    } catch (error) {
      setLoading(false);

      const failureData = {
        error,
        message: error.message || 'Failed to process payment',
      };

      setPaymentResult({ type: 'failed', data: failureData });
      onPaymentFailure?.(failureData);
    }
  };

  const handleClose = useCallback(() => {
    if (loading) return;

    console.log('Closing payment modal');
    onClose();
  }, [loading, onClose]);

  const handleSuccessDone = useCallback(() => {
    console.log('Success → Done clicked');
    setTimeout(() => {
      handleClose();
    }, 80);
  }, [handleClose]);

  const handleTryAgain = useCallback(() => {
    setPaymentResult(null);
    setStep('confirm');
    setManualAmount('');
    setAmountError('');
  }, []);

  const handleAmountChange = text => {
    const cleanedText = text.replace(/[^0-9.]/g, '');

    const parts = cleanedText.split('.');
    if (parts.length > 2) {
      return;
    }

    if (parts[1] && parts[1].length > 2) {
      return;
    }

    setManualAmount(cleanedText);
    setAmountError('');
  };

  const renderCurrentStep = () => {
    if (paymentResult?.type === 'success') {
      return renderSuccessStep();
    }

    if (paymentResult?.type === 'failed') {
      return renderFailedStep();
    }

    return renderConfirmStep();
  };

  const renderConfirmStep = () => {
    const displayAmount = showAmountInput
      ? parseFloat(manualAmount || 0)
      : parseFloat(amount || 0);
    const remaining = parseFloat(remainingBalance) || 0;

    return (
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: '#e8f5e9' }]}>
          <MIcon
            name="check-circle"
            size={SCREEN_HEIGHT * 0.05}
            color={COLORS.success}
          />
        </View>

        <Text style={styles.title}>Confirm Payment</Text>
        <Text style={styles.subtitle}>Please review the payment details</Text>

        {remaining > 0 && (
          <View style={styles.balanceCard}>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Remaining Balance:</Text>
              <Text style={styles.balanceAmount}>
                ₹
                {remaining.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.amountCard}>
          {showAmountInput ? (
            <>
              <Text style={styles.amountLabel}>Enter Amount to Pay</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={[
                    styles.amountInput,
                    amountError ? styles.inputError : null,
                  ]}
                  value={manualAmount}
                  onChangeText={handleAmountChange}
                  placeholder="0.00"
                  placeholderTextColor="#bbb"
                  keyboardType="decimal-pad"
                  maxLength={10}
                  editable={!loading}
                />
              </View>
              {amountError ? (
                <Text style={styles.errorText}>{amountError}</Text>
              ) : (
                <Text style={styles.helperText}>
                  Maximum: ₹
                  {remaining.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.amountLabel}>Amount to Pay</Text>
              <Text style={styles.amountValue}>
                ₹
                {displayAmount.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </>
          )}

          {userOrderId && (
            <View style={styles.orderIdContainer}>
              <Text style={styles.orderIdLabel}>Order ID:</Text>
              <Text style={styles.orderIdValue}>#{userOrderId}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <MIcon
                name="lock"
                size={SCREEN_HEIGHT * 0.024}
                color={COLORS.white}
              />
              <Text
                style={[styles.buttonText, { marginLeft: SCREEN_WIDTH * 0.02 }]}
              >
                Pay Now
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleClose}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <View style={styles.securityNote}>
          <MIcon
            name="shield-check"
            size={SCREEN_HEIGHT * 0.018}
            color={COLORS.gray}
          />
          <Text style={styles.securityText}>
            Secured by Razorpay. Your payment information is encrypted.
          </Text>
        </View>
      </View>
    );
  };

  const renderSuccessStep = () => {
    const paymentAmount = paymentResult?.data?.amount || getPaymentAmount();

    return (
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: '#e8f5e9' }]}>
          <MIcon
            name="check-circle"
            size={SCREEN_HEIGHT * 0.08}
            color={COLORS.success}
          />
        </View>

        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.subtitle}>
          Your payment has been completed successfully
        </Text>

        <View
          style={[
            styles.amountCard,
            { backgroundColor: '#e8f5e9', borderColor: COLORS.success + '20' },
          ]}
        >
          <Text style={styles.amountLabel}>Amount Paid</Text>
          <Text style={[styles.amountValue, { color: COLORS.success }]}>
            ₹
            {parseFloat(paymentAmount).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
          {paymentResult?.data?.razorpay_payment_id && (
            <View style={styles.paymentIdContainer}>
              <Text style={styles.paymentIdLabel}>Payment ID:</Text>
              <Text style={styles.paymentIdValue}>
                {paymentResult.data.razorpay_payment_id}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.success }]}
          onPress={handleSuccessDone}
        >
          <MIcon
            name="check"
            size={SCREEN_HEIGHT * 0.024}
            color={COLORS.white}
          />
          <Text
            style={[styles.buttonText, { marginLeft: SCREEN_WIDTH * 0.02 }]}
          >
            Done
          </Text>
        </TouchableOpacity>

        <View style={styles.securityNote}>
          <MIcon
            name="shield-check"
            size={SCREEN_HEIGHT * 0.018}
            color={COLORS.success}
          />
          <Text style={[styles.securityText, { color: COLORS.success }]}>
            Payment verified and secured
          </Text>
        </View>
      </View>
    );
  };

  const renderFailedStep = () => (
    <View style={styles.content}>
      <View style={[styles.iconContainer, { backgroundColor: '#ffebee' }]}>
        <MIcon
          name="close-circle"
          size={SCREEN_HEIGHT * 0.08}
          color={COLORS.error}
        />
      </View>

      <Text style={styles.title}>Payment Failed</Text>
      <Text style={styles.subtitle}>
        {'Your payment could not be completed'}
      </Text>

      {paymentResult?.data?.paymentId && (
        <View
          style={[
            styles.amountCard,
            { backgroundColor: '#ffebee', borderColor: COLORS.error + '20' },
          ]}
        >
          <Text style={styles.paymentIdLabel}>Payment ID:</Text>
          <Text style={styles.paymentIdValue}>
            {paymentResult.data.paymentId}
          </Text>
          <Text style={styles.contactSupportText}>
            Please contact support with this ID
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: COLORS.primary }]}
        onPress={handleTryAgain}
      >
        <MIcon
          name="refresh"
          size={SCREEN_HEIGHT * 0.024}
          color={COLORS.white}
        />
        <Text style={[styles.buttonText, { marginLeft: SCREEN_WIDTH * 0.02 }]}>
          Try Again
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const canClose = !paymentResult && !loading;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={canClose ? handleClose : undefined}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={canClose ? handleClose : undefined}
          disabled={!canClose}
        />
        <View style={styles.modalContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {canClose && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleClose}
                disabled={loading}
              >
                <MIcon
                  name="close"
                  size={SCREEN_HEIGHT * 0.028}
                  color={COLORS.dark}
                />
              </TouchableOpacity>
            )}

            {renderCurrentStep()}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    width: SCREEN_WIDTH * 0.9,
    maxHeight: SCREEN_HEIGHT * 0.85,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  scrollContent: {
    flexGrow: 1,
  },
  closeButton: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.02,
    right: SCREEN_WIDTH * 0.04,
    zIndex: 10,
    padding: SCREEN_HEIGHT * 0.01,
  },
  content: {
    padding: SCREEN_WIDTH * 0.06,
    paddingTop: SCREEN_HEIGHT * 0.05,
  },
  iconContainer: {
    width: SCREEN_HEIGHT * 0.1,
    height: SCREEN_HEIGHT * 0.1,
    borderRadius: SCREEN_HEIGHT * 0.05,
    backgroundColor: '#fff5f0',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  title: {
    fontSize: SCREEN_HEIGHT * 0.028,
    color: COLORS.dark,
    fontFamily: Nunito.bold,
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  subtitle: {
    fontSize: SCREEN_HEIGHT * 0.016,
    color: COLORS.gray,
    fontFamily: Nunito.regular,
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
  },
  balanceCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: SCREEN_HEIGHT * 0.015,
    marginBottom: SCREEN_HEIGHT * 0.02,
    borderWidth: 1,
    borderColor: COLORS.warning + '30',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: SCREEN_HEIGHT * 0.016,
    color: COLORS.dark,
    fontFamily: Nunito.semiBold,
  },
  balanceAmount: {
    fontSize: SCREEN_HEIGHT * 0.02,
    color: COLORS.warning,
    fontFamily: Nunito.bold,
  },
  amountCard: {
    backgroundColor: '#fff5f0',
    borderRadius: 16,
    padding: SCREEN_HEIGHT * 0.025,
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.03,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  amountLabel: {
    fontSize: SCREEN_HEIGHT * 0.016,
    color: COLORS.gray,
    fontFamily: Nunito.medium,
    marginBottom: SCREEN_HEIGHT * 0.01,
  },
  amountValue: {
    fontSize: SCREEN_HEIGHT * 0.038,
    color: COLORS.primary,
    fontFamily: Nunito.bold,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: SCREEN_WIDTH * 0.04,
    borderWidth: 2,
    borderColor: COLORS.primary + '30',
    width: '100%',
    marginTop: SCREEN_HEIGHT * 0.01,
  },
  currencySymbol: {
    fontSize: SCREEN_HEIGHT * 0.032,
    color: COLORS.primary,
    fontFamily: Nunito.bold,
    marginRight: SCREEN_WIDTH * 0.02,
  },
  amountInput: {
    flex: 1,
    fontSize: SCREEN_HEIGHT * 0.032,
    color: COLORS.dark,
    fontFamily: Nunito.bold,
    paddingVertical: SCREEN_HEIGHT * 0.015,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    fontSize: SCREEN_HEIGHT * 0.014,
    color: COLORS.error,
    fontFamily: Nunito.medium,
    marginTop: SCREEN_HEIGHT * 0.008,
    alignSelf: 'flex-start',
  },
  helperText: {
    fontSize: SCREEN_HEIGHT * 0.013,
    color: COLORS.gray,
    fontFamily: Nunito.regular,
    marginTop: SCREEN_HEIGHT * 0.008,
  },
  orderIdContainer: {
    marginTop: SCREEN_HEIGHT * 0.015,
    alignItems: 'center',
  },
  orderIdLabel: {
    fontSize: SCREEN_HEIGHT * 0.014,
    color: COLORS.gray,
    fontFamily: Nunito.medium,
    marginBottom: SCREEN_HEIGHT * 0.005,
  },
  orderIdValue: {
    fontSize: SCREEN_HEIGHT * 0.016,
    color: COLORS.dark,
    fontFamily: Nunito.bold,
  },
  paymentIdContainer: {
    marginTop: SCREEN_HEIGHT * 0.015,
    alignItems: 'center',
  },
  paymentIdLabel: {
    fontSize: SCREEN_HEIGHT * 0.014,
    color: COLORS.gray,
    fontFamily: Nunito.medium,
    marginBottom: SCREEN_HEIGHT * 0.005,
  },
  paymentIdValue: {
    fontSize: SCREEN_HEIGHT * 0.013,
    color: COLORS.dark,
    fontFamily: Nunito.semiBold,
  },
  contactSupportText: {
    fontSize: SCREEN_HEIGHT * 0.013,
    color: COLORS.gray,
    fontFamily: Nunito.regular,
    marginTop: SCREEN_HEIGHT * 0.01,
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: SCREEN_HEIGHT * 0.02,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: SCREEN_HEIGHT * 0.02,
    color: COLORS.white,
    fontFamily: Nunito.bold,
  },
  cancelButton: {
    paddingVertical: SCREEN_HEIGHT * 0.015,
    alignItems: 'center',
    marginTop: SCREEN_HEIGHT * 0.01,
  },
  cancelButtonText: {
    fontSize: SCREEN_HEIGHT * 0.016,
    color: COLORS.gray,
    fontFamily: Nunito.medium,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SCREEN_HEIGHT * 0.02,
    paddingTop: SCREEN_HEIGHT * 0.02,
    borderTopWidth: 1,
    borderTopColor: COLORS.light,
  },
  securityText: {
    fontSize: SCREEN_HEIGHT * 0.013,
    color: COLORS.gray,
    fontFamily: Nunito.regular,
    marginLeft: SCREEN_WIDTH * 0.015,
    flex: 1,
  },
});

export default PaymentModal;
