import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import fetchData from '../config/fetchData';
import poppins from '../utils/fonts';
import showToast from '../utils/common_fn';

const CustomerSupportModal = ({ visible, onClose }) => {
  const [userData, setUserData] = useState(null);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!visible) return;

    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('UserData');

        if (userDataString) {
          const user = JSON.parse(userDataString);
          setUserData(user);
          setName(user?.owner_name || user?.shop_name || '');
          setMobile(user?.phone || '');
        } else {
          setUserData(null);
          setName('');
          setMobile('');
        }

        setComment('');
        setErrors({});
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    loadUserData();
  }, [visible]);

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!mobile.trim()) newErrors.mobile = 'Mobile number is required';
    if (!comment.trim()) newErrors.comment = 'Issue description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const RaiseTicket = async () => {
    if (!validate()) return;

    const payload = {
      name,
      mobile,
      comment,
    };

    console.log('Raise Issue Payload:', payload);

    try {
      const res=await fetchData.raiseIssue(payload);
      console.log('Raise Issue Response:', res);
      
      if(res.success)
      {
        showToast('Your issue has been raised. Our support team will contact you soon.');
        setName('');
        setMobile('');
        setComment(''); 
      } else {
        showToast(res.message || 'Failed to raise issue. Please try again later.');
      }
      onClose();
    } catch (error) {
      console.error('Error raising ticket:', error);
    }
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Customer Support</Text>

          {!userData?.owner_name && !userData?.shop_name && (
            <>
              <TextInput
                placeholder="Your Name"
                style={[styles.input, errors.name && styles.errorInput]}
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </>
          )}

          {!userData?.phone && (
            <>
              <TextInput
                placeholder="Mobile Number"
                keyboardType="phone-pad"
                style={[styles.input, errors.mobile && styles.errorInput]}
                value={mobile}
                onChangeText={(t) => {
                  setMobile(t);
                  if (errors.mobile) setErrors({ ...errors, mobile: '' });
                }}
              />
              {errors.mobile && (
                <Text style={styles.errorText}>{errors.mobile}</Text>
              )}
            </>
          )}

          <>
            <TextInput
              placeholder="Describe your issue"
              multiline
              style={[
                styles.input,
                styles.textArea,
                errors.comment && styles.errorInput,
              ]}
              value={comment}
              onChangeText={(t) => {
                setComment(t);
                if (errors.comment) setErrors({ ...errors, comment: '' });
              }}
            />
            {errors.comment && (
              <Text style={styles.errorText}>{errors.comment}</Text>
            )}
          </>

          <TouchableOpacity style={styles.raiseBtn} onPress={RaiseTicket}>
            <Text style={styles.raiseText}>Raise Issue</Text>
          </TouchableOpacity>

          <View style={styles.iconRow}>
            <TouchableOpacity onPress={() => Linking.openURL('tel:+919876543210')}>
              <Icon name="phone" size={26} color="#4CAF50" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://wa.me/919876543210?text=Hi%20Support')
              }
            >
              <Icon name="whatsapp" size={26} color="#25D366" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Linking.openURL('mailto:support@yourapp.com')}
            >
              <Icon name="email" size={26} color="#FF5722" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomerSupportModal;


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 6,
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
    fontFamily: poppins.bold,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 4,
    fontFamily: poppins.regular,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: '#FF4D4F',
  },
  errorText: {
    color: '#FF4D4F',
    fontSize: 12,
    marginBottom: 6,
    marginLeft: 4,
    fontFamily: poppins.regular,
  },
  raiseBtn: {
    backgroundColor: '#F58502',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  raiseText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: poppins.semiBold,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  closeBtn: {
    alignItems: 'center',
  },
  closeText: {
    color: 'red',
    fontSize: 16,
    fontFamily: poppins.regular,
  },
});