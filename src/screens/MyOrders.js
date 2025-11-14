import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const orders = [
  { id: '1', date: '11-11-2025', price: 2715, status: 'Placed' },
  { id: '2', date: '12-11-2025', price: 1899, status: 'Delivered' },
  { id: '3', date: '13-11-2025', price: 999, status: 'In Progress' },
  { id: '4', date: '14-11-2025', price: 549, status: 'Cancelled' },
  { id: '5', date: '15-11-2025', price: 99, status: 'Delivered' },
];

const MyOrders = ({navigation}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Placed':
        return '#FF8C00';
      case 'Delivered':
        return '#28A745';
      case 'In Progress':
        return '#D4A017';
      case 'Cancelled':
        return '#DC3545';
      default:
        return 'gray';
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.statusRow}>
        <Icon
          name="checkbox-marked-circle-outline"
          size={22}
          color={getStatusColor(item.status)}
        />
        <Text style={[styles.statusText, { color: '#000' }]}>
          {item.status}
        </Text>
      </View>

      <View style={styles.details}>
        <View style={styles.row}>
          <Text style={styles.label}>Order ID</Text>
          <Text style={[styles.value,{color:'orange'}]}>#{item.id}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{item.date}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Price</Text>
          <Text style={[styles.value,{color:'red'}]}>₹{item.price}</Text>
        </View>
      </View>

      <TouchableOpacity 
      onPress={() => navigation.navigate('OrderSummaryScreen')}
      activeOpacity={0.8} style={styles.button}>
        <Text style={styles.buttonText}>Order Summary</Text>
      </TouchableOpacity>
    </View>
  );

  return (
<View style={{flex:1}}>
    <FlatList
      data={orders}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={{ marginTop: '1%', }}
      showsVerticalScrollIndicator={false}
    />
    </View>
  );
};

const styles = StyleSheet.create({

  card: {
    marginLeft: '5%',
    backgroundColor: '#FFF',
    width: '90%',
    marginVertical:6,
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 5,
  },
  details: {
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    fontSize: 15,
    color: '#444',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  button: {
    backgroundColor: '#D45500',
    marginTop: 14,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default MyOrders;
