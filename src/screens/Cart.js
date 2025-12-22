import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Alert,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import fetchData from '../config/fetchData';
import showToast from '../utils/common_fn';
import poppins from '../utils/fonts';

const { width, height } = Dimensions.get('window');

const Cart = ({ navigation }) => {
  console.log('Cart Screen Loaded');
  
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const [refreshing, setRefreshing] = useState(false);
  const [updatingItems, setUpdatingItems] = useState({});
  const [outOfStockItems, setOutOfStockItems] = useState(new Set());
  const updateTimers = useRef({});

  useEffect(() => {
    fetchCartItems(1);
    return () => {
      Object.values(updateTimers.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  const fetchCartItems = async (page = 1) => {
    try {
      setLoading(page === 1);
      const response = await fetchData.getCart(page, pagination.limit);
      console.log('Cart Response:', response);
      
      if (response.success) {
        if (page === 1) {
          setCartItems(response.data || []);
        } else {
          setCartItems(prev => [...prev, ...(response.data || [])]);
        }
        setPagination(response.pagination || { page: 1, limit: 10, total: 0 });
      } else {
        showToast(response.message || 'Failed to load cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      showToast('Failed to load cart items');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (cartItems.length < pagination.total && !loading) {
      fetchCartItems(pagination.page + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchCartItems(1);
  };

  const handleConfirmOrder = () => {
    if (cartItems.length === 0) {
      showToast('Your cart is empty');
      return;
    }

    const outOfStock = cartItems.filter(item => item.available_qty === 0);
    
    if (outOfStock.length > 0) {
      setOutOfStockItems(new Set(outOfStock.map(item => item.id)));
      showToast('Please remove out-of-stock items before confirming');
      return;
    }

    const itemsExceedingStock = cartItems.filter(item => item.quantity > item.available_qty);
    
    if (itemsExceedingStock.length > 0) {
      setOutOfStockItems(new Set(itemsExceedingStock.map(item => item.id)));
      const itemNames = itemsExceedingStock.map(item => item.product?.product_name || 'Product').join(', ');
      showToast(`Selected quantity exceeds available stock for: ${itemNames}`);
      return;
    }

    setOutOfStockItems(new Set());

    const totalAmount = getNetAmount();
    const totalQuantity = getTotalQuantity();

    navigation.navigate('ConfirmOrderScreen', {
      cartItems,
      totalAmount,
      totalQuantity,
    });
  };

  const handleDeleteItem = async (item) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to remove this item from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await fetchData.deleteCartItem(
                item.id,
                item.product_id,
                item.size_id
              );
              setCartItems(prev => prev.filter(i => i.id !== item.id));
              showToast('Item removed from cart');
            } catch (error) {
              console.error('Delete error:', error.response || error);
              showToast(
                error.response?.data?.message || 'Failed to delete item'
              );
            }
          }
        }
      ]
    );
  };

  const handleQuantityUpdate = async (item, newQuantity) => {
    if (newQuantity < 1) {
      showToast('Quantity must be at least 1');
      return;
    }

    const originalQuantity = item.quantity;

    setCartItems(prev =>
      prev.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: newQuantity }
          : cartItem
      )
    );

    if (updateTimers.current[item.id]) {
      clearTimeout(updateTimers.current[item.id]);
    }

    setUpdatingItems(prev => ({ ...prev, [item.id]: true }));

    updateTimers.current[item.id] = setTimeout(async () => {
      try {
        await fetchData.updateCartItem(item.id, {
          product_id: item.product_id,
          size_id: item.size_id,
          quantity: newQuantity
        });

        console.log('Quantity updated successfully');
      } catch (error) {
        console.error('Update failed:', error.response || error);
        showToast(
          error.response?.data?.message || 'Could not update quantity'
        );

        setCartItems(prev =>
          prev.map(cartItem =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: originalQuantity }
              : cartItem
          )
        );
      } finally {
        setUpdatingItems(prev => {
          const updated = { ...prev };
          delete updated[item.id];
          return updated;
        });
        delete updateTimers.current[item.id];
      }
    }, 800);
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  };

  const getNetAmount = () => {
    return cartItems.reduce((sum, item) => {
      const price = parseFloat(item.product?.product_price) || 0;
      const quantity = item.quantity || 0;
      return sum + (price * quantity);
    }, 0);
  };

  const renderCartItem = ({ item }) => {
    const isOutOfStock = item.available_qty === 0;
    const exceedsStock = item.quantity > item.available_qty;
    const hasRedBorder = outOfStockItems.has(item.id);

    return (
      <TouchableOpacity 
        style={[
          styles.container,
          hasRedBorder && styles.outOfStockBorder
        ]}
        onPress={() => navigation.navigate('SingleProperty', { productId: item.product_id })}
        activeOpacity={0.7}
      >
        <View style={styles.availableStockTopLeft}>
          <Text style={[
            styles.availableStockText,
            (isOutOfStock || exceedsStock) && styles.outOfStockTopLeftText
          ]}>
            {isOutOfStock ? 'Out of Stock' : `Available: ${item.available_qty}`}
          </Text>
        </View>

        <View style={styles.deleteIconContainer}>
          <TouchableOpacity 
            onPress={() => handleDeleteItem(item)}
            style={styles.deleteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons name="delete" size={width * 0.06} color="#D45500" />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <View style={styles.detailsContainer}>
            <View style={[styles.row, { marginBottom: height * 0.006 }]}>
              <Text style={styles.text} numberOfLines={2}>
                {item.product?.product_name || 'Product'}
              </Text>
            </View>

            <View style={[styles.row, { alignItems: 'center' }]}>
              <Text style={styles.text}>Size:</Text>
              <Text style={styles.text}>{item.size?.size || 'N/A'}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.text}>Price:</Text>
              <Text style={[styles.text, styles.priceText]}>
                Rs.{item.product?.product_price || 0}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.text}>Quantity:</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity 
                  style={[
                    styles.quantityButton,
                    (isOutOfStock || item.quantity <= 1) && styles.disabledButton
                  ]}
                  onPress={() => !isOutOfStock && item.quantity > 1 && handleQuantityUpdate(item, item.quantity - 1)}
                  disabled={isOutOfStock || item.quantity <= 1}
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                
                <View style={styles.quantityDisplay}>
                  <Text style={styles.quantityText}>{item.quantity || 0}</Text>
                  {updatingItems[item.id] && (
                    <ActivityIndicator size="small" color="#D45500" style={styles.quantityLoader} />
                  )}
                </View>
                
                <TouchableOpacity 
                  style={[
                    styles.quantityButton,
                    (isOutOfStock || item.quantity >= item.available_qty) && styles.disabledButton
                  ]}
                  onPress={() => {
                    if (isOutOfStock) return;
                    if (item.quantity >= item.available_qty) {
                      showToast(`Only ${item.available_qty} items available in stock`);
                      return;
                    }
                    handleQuantityUpdate(item, item.quantity + 1);
                  }}
                  disabled={isOutOfStock || item.quantity >= item.available_qty}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.text}>Total:</Text>
              <Text style={[styles.text, styles.totalText]}>
                Rs.{((item.product?.product_price || 0) * (item.quantity || 0)).toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: item.product?.product_image || 'https://via.placeholder.com/150'
              }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!loading || pagination.page === 1) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#D45500" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Icon name="shopping-cart" size={width * 0.2} color="#ccc" />
        <Text style={styles.emptyText}>Your cart is empty</Text>
      </View>
    );
  };

  if (loading && pagination.page === 1) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#D45500" />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {cartItems.length > 0 && (
        <View style={styles.bottomFixed}>
          <View style={styles.priceContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Total Quantity:</Text>
              <Text style={styles.value}>{getTotalQuantity()}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.label}>Net Amount:</Text>
              <Text style={styles.value}>₹{getNetAmount().toFixed(2)}</Text>
            </View>
          </View>

          <TouchableOpacity 
            onPress={handleConfirmOrder} 
            style={styles.confirmButton}
          >
            <Text style={styles.confirmButtonText}>
              Confirm Order
            </Text>
            <Icon name="forward" size={width * 0.045} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContainer: {
    paddingBottom: height * 0.22, 
    paddingTop: height * 0.012,
  },
  container: {
    width: width * 0.9,
    marginLeft: width * 0.05,
    marginTop: height * 0.012,
    marginBottom: height * 0.012,
    padding: width * 0.04,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: width * 0.025,
  },
  deleteIconContainer: {
    position: 'absolute',
    top: height * 0.012,
    right: width * 0.025,
    zIndex: 1,
  },
  deleteButton: {
    padding: width * 0.013,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: height * 0.006,
  },
  detailsContainer: {
    width: '50%',
    marginTop: '6%',
  },
  text: {
    fontSize: width * 0.04,
    marginRight: width * 0.013,
    color: '#333',
    fontFamily: poppins.regular,
  },
  priceText: {
    color: 'red',
    fontFamily: poppins.medium,
  },
  totalText: {
    color: 'red', 
    fontFamily: poppins.bold,
  },
  imageContainer: {
    backgroundColor: '#F4F0EC',
    marginLeft: width * 0.07,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.025,
  },
  image: {
    height: width * 0.36,
    width: width * 0.36,
    borderRadius: width * 0.013,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.02,
  },
  quantityButton: {
    backgroundColor: '#D45500',
    width: width * 0.07,
    height: width * 0.07,
    borderRadius: width * 0.013,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: width * 0.042,
    fontFamily: poppins.bold,
  },
  quantityDisplay: {
    minWidth: width * 0.1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: width * 0.04,
    color: '#D45500',
    fontFamily: poppins.bold,
  },
  quantityLoader: {
    marginLeft: width * 0.013,
  },
  bottomFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.05,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderTopLeftRadius: width * 0.05,
    borderTopRightRadius: width * 0.05,
  },
  priceContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: width * 0.02,
    padding: width * 0.04,
    marginBottom: height * 0.012,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: height * 0.005,
  },
  label: {
    fontSize: width * 0.04,
    color: '#444',
    fontFamily: poppins.medium,
  },
  value: {
    fontSize: width * 0.04,
    color: '#D45500',
    fontFamily: poppins.bold,
  },
  confirmButton: {
    backgroundColor: '#D45500',
    paddingVertical: height * 0.018,
    borderRadius: width * 0.025,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: width * 0.025,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontFamily: poppins.bold,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  footerLoader: {
    paddingVertical: height * 0.025,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.12,
  },
  emptyText: {
    fontSize: width * 0.045,
    color: '#999',
    marginTop: height * 0.025,
    fontFamily: poppins.regular,
  },
  outOfStockBorder: {
    borderWidth: 2,
    borderColor: '#FF0000',
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.7,
  },
  availableStockTopLeft: {
    position: 'absolute',
    top: height * 0.012,
    left: width * 0.025,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: width * 0.02,
    paddingVertical: height * 0.005,
    borderRadius: width * 0.015,
    zIndex: 1,
    elevation: 3,
  },
  availableStockText: {
    fontSize: width * 0.033,
    color: '#D45500',
    fontFamily: poppins.bold,
  },
  outOfStockTopLeftText: {
    color: '#FF0000',
    fontFamily: poppins.bold,
  },
});

export default Cart;