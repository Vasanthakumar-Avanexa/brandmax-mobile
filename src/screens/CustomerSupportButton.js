import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomerSupportScreen from './CustomerSupportScreen';

const CustomerSupportButton = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <Icon name="headset" size={26} color="#fff" />
      </TouchableOpacity>

      <CustomerSupportScreen
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </>
  );
};

export default CustomerSupportButton;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 15,
    bottom: "11%",
    backgroundColor: '#F58502',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
});
