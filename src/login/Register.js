import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  Dimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import fetchData from '../config/fetchData';
import showToast from '../utils/common_fn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setLoggedIn, setGuestUser } from '../store/authSlice';
import { useNavigation } from '@react-navigation/native';
import poppins from '../utils/fonts';

const { width, height } = Dimensions.get('window');

const RequestRegister = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [form, setForm] = useState({
    phone: '',
    email: '',
    shop_name: '',
    owner_name: '',
    gst_no: '',
    aadhaar: '',
    pancard: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onChange = (key, value) => {
    setForm({ ...form, [key]: value });
    if (errors[key]) {
      setErrors({ ...errors, [key]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(form.phone.trim())) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!form.shop_name.trim()) {
      newErrors.shop_name = 'Shop name is required';
    }

    if (!form.owner_name.trim()) {
      newErrors.owner_name = 'Owner name is required';
    }

    if (!form.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!form.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!form.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(form.pincode.trim())) {
      newErrors.pincode = 'Pincode must be 6 digits';
    }

    if (!form.state.trim()) {
      newErrors.state = 'State is required';
    }

    return newErrors;
  };

  const submitRequest = async () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    const payload = {
      phone: form.phone,
      email: form.email,
      user_type: 'user',
      shop_name: form.shop_name,
      owner_name: form.owner_name,
      gst_no: form.gst_no || null,
      aadhaar: form.aadhaar || null,
      pancard: form.pancard || null,
      address: form.address,
      city: form.city,
      pincode: form.pincode,
      state: form.state,
      is_active: false,
    };

    console.log('Request Payload:', payload);

    try {
      const response = await fetchData.createUser(payload);
      console.log('API Response:', response);

      if (response?.success) {
        showToast('Registration request submitted successfully!');
        
        // Clear form
        setForm({
          phone: '',
          email: '',
          shop_name: '',
          owner_name: '',
          gst_no: '',
          aadhaar: '',
          pancard: '',
          address: '',
          city: '',
          pincode: '',
          state: '',
        });
        setErrors({});

        await AsyncStorage.setItem('isGuestUser', 'true');
        await AsyncStorage.removeItem('token'); 
        await AsyncStorage.removeItem('UserData'); 
        
        dispatch(setGuestUser(true));
        dispatch(setLoggedIn(false));
        
        console.log('Guest user mode activated - waiting for navigator switch');

      } else {
        showToast(
          response?.message || 'Failed to submit request. Please try again.',
        );
      }
    } catch (error) {
      console.log('Error submitting request:', error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        'An error occurred. Please try again.';
      showToast(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (
    label,
    key,
    keyboardType = 'default',
    isRequired = false,
  ) => {
    const hasError = errors[key];

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>
          {label}
          {isRequired && <Text style={styles.asterisk}>*</Text>}
        </Text>
        <TextInput
          style={[styles.input, hasError && styles.inputError]}
          placeholder={label}
          maxLength={key === 'pincode' ? 6 : key === 'phone' ? 10 : 1000}
          keyboardType={keyboardType}
          onChangeText={v => onChange(key, v)}
          value={form[key]}
          placeholderTextColor="#999"
          editable={!loading}
        />
        {hasError && <Text style={styles.errorText}>{hasError}</Text>}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -70}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          
          <Text style={styles.title}>Request Registration</Text>
          
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={!loading}
          >
            <View style={styles.disclaimerBox}>
              <Text style={styles.disclaimerText}>
                ⚠️ You can submit this request only once.{'\n'}
                After admin approval, you will be activated as a user and can access
                all pages.{'\n'}
                Please wait for admin review.
              </Text>
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Required Information</Text>
              {renderInputField('Phone', 'phone', 'number-pad', true)}
              {renderInputField('Email', 'email', 'email-address', true)}
              {renderInputField('Shop Name', 'shop_name', 'default', true)}
              {renderInputField('Owner Name', 'owner_name', 'default', true)}
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Business Details (Optional)</Text>
              {renderInputField('GST No', 'gst_no', 'default', false)}
              {renderInputField('Aadhaar', 'aadhaar', 'number-pad', false)}
              {renderInputField('PAN Card', 'pancard', 'default', false)}
            </View>

            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Address Information</Text>
              {renderInputField('Address', 'address', 'default', true)}
              {renderInputField('City', 'city', 'default', true)}
              {renderInputField('Pincode', 'pincode', 'number-pad', true)}
              {renderInputField('State', 'state', 'default', true)}
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={submitRequest}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Send Request</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RequestRegister;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    paddingHorizontal: width * 0.04,
    paddingTop: height * 0.02,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: height * 0.03,
  },
  title: {
    fontSize: width * 0.065,
    fontWeight: '700',
    marginBottom: height * 0.015,
    color: '#000',
    fontFamily: poppins.bold,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#333',
    marginBottom: height * 0.012,
    fontFamily: poppins.semiBold,
  },
  sectionContainer: {
    marginBottom: height * 0.02,
  },
  disclaimerBox: {
    backgroundColor: '#FFF3CD',
    padding: width * 0.03,
    borderRadius: width * 0.02,
    marginBottom: height * 0.025,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  disclaimerText: {
    color: '#856404',
    fontSize: width * 0.035,
    lineHeight: height * 0.022,
    fontWeight: '500',
    fontFamily: poppins.medium,
  },
  fieldContainer: {
    marginBottom: height * 0.018,
  },
  label: {
    fontSize: width * 0.038,
    fontWeight: '600',
    color: '#333',
    marginBottom: height * 0.008,
    fontFamily: poppins.semiBold,
  },
  asterisk: {
    color: '#FF0000',
    fontWeight: '700',
    fontFamily: poppins.bold,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: width * 0.025,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.015,
    fontSize: width * 0.038,
    color: '#000',
    backgroundColor: '#f9f9f9',
    fontFamily: poppins.regular,
  },
  inputError: {
    borderColor: '#FF0000',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    color: '#FF0000',
    fontSize: width * 0.032,
    fontWeight: '500',
    marginTop: height * 0.006,
    marginLeft: width * 0.02,
    fontFamily: poppins.medium,
  },
  button: {
    backgroundColor: '#D45500',
    paddingVertical: height * 0.018,
    borderRadius: width * 0.025,
    alignItems: 'center',
    marginTop: height * 0.015,
    marginBottom: height * 0.02,
    shadowColor: '#D45500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: width * 0.042,
    fontFamily: poppins.semiBold,
  },
});