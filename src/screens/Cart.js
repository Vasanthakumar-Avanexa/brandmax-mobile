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
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import fetchData from '../config/fetchData';
import showToast from '../utils/common_fn';
import Nunito from '../utils/fonts';
import { useDispatch } from 'react-redux';
import { decrementCartCount, setCartCount } from '../store/ProductSlice';

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
  const [tax,setTax]=useState()
  const updateTimers = useRef({});
  const isFocused = useRef(true);
  const dispatch=useDispatch();

  useFocusEffect(
    useCallback(() => {
      isFocused.current = true;
      fetchCartItems(1);

      return () => {
        isFocused.current = false;
      };
    }, [])
  );

  useEffect(() => {
    return () => {
      Object.values(updateTimers.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  const fetchCartItems = async (page = 1) => {
  try {
    setLoading(page === 1);
    const response = await fetchData.getCart(page, pagination.limit);
    console.log('Cart Response:', response);
    if (isFocused.current) {
      if (response.success) {
        setTax(response?.tax);
        if (page === 1) {
          setCartItems(response.data || []);
        } else {
          setCartItems(prev => [...prev, ...(response.data || [])]);
        }
        setPagination(response.pagination || { page: 1, limit: 10, total: 0 });
        
        dispatch(setCartCount(response.pagination?.total || response.data?.length || 0));
      } else {
        showToast(response.message || 'Failed to load cart');
      }
    }
  } catch (error) {
    console.error('Error fetching cart:', error);
    if (isFocused.current) {
      showToast('Failed to load cart items');
    }
  } finally {
    if (isFocused.current) {
      setLoading(false);
      setRefreshing(false);
    }
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
      tax,
      totalAmount,
      totalQuantity,
    });
  };

  const handleContinuePurchase=()=>{
    navigation.navigate('MainDrawer', {
                  screen: 'Tabs',
                  params: {
                    screen: 'Home'
                  },
                });
  }

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
            
            dispatch(decrementCartCount());
            
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
    <View 
      style={[
        styles.container,
        hasRedBorder && styles.outOfStockBorder
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.availableStockBadge}>
          <Text style={[
            styles.availableStockText,
            (isOutOfStock || exceedsStock) && styles.outOfStockText
          ]}>
            {isOutOfStock ? 'Out of Stock' : `Available: ${item.available_qty}`}
          </Text>
        </View>

        <TouchableOpacity 
          onPress={() => handleDeleteItem(item)}
          style={styles.deleteButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="delete" size={width * 0.06} color="red" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.contentRow}
        onPress={() => navigation.navigate('SingleProperty', { productId: item.product_id })}
        activeOpacity={0.7}
      >
        <View style={styles.detailsContainer}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.product?.product_name || 'Product'}
          </Text>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Size:</Text>
            <Text style={styles.value}>{item.size?.size || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Price:</Text>
            <Text style={[styles.value, styles.priceText]}>
              ₹{item.product?.product_price || 0}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Quantity:</Text>
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
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Total:</Text>
            <Text style={[styles.value, styles.totalText]}>
              ₹{((item.product?.product_price || 0) * (item.quantity || 0)).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: item.product?.product_image || 'https://www.gstatic.com/webp/gallery/4.jpg'
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
    </View>
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
            
            <View style={styles.summaryRow}>
              <Text style={styles.label}>Tax:</Text>
              <Text style={styles.value}>{tax || 0}%</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              onPress={handleContinuePurchase} 
              style={styles.continuePurchaseButton}
            >
              <Icon name="reply" size={width * 0.05} color="#D45500" />
              <Text style={styles.continuePurchaseButtonText}>
                Continue Purchase
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleConfirmOrder} 
              style={styles.confirmButton}
            >
              <Text style={styles.confirmButtonText}>
                Confirm Order
              </Text>
              <Icon name="forward" size={width * 0.05} color="#fff" />
            </TouchableOpacity>
          </View>
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
    alignSelf: 'center',
    marginVertical: height * 0.008,
    padding: width * 0.038,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderRadius: width * 0.025,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.012,
  },
  availableStockBadge: {
    backgroundColor: 'rgba(212, 85, 0, 0.1)',
    paddingHorizontal: width * 0.025,
    paddingVertical: height * 0.005,
    borderRadius: width * 0.015,
  },
  availableStockText: {
    fontSize: width * 0.032,
    color: '#D45500',
    fontFamily: Nunito.bold,
  },
  outOfStockText: {
    color: '#FF0000',
  },
  deleteButton: {
    padding: width * 0.015,
    backgroundColor: 'rgba(212, 85, 0, 0.1)',
    borderRadius: width * 0.015,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsContainer: {
    flex: 1,
    marginRight: width * 0.025,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: width * 0.04,
    color: '#333',
    fontFamily: Nunito.semiBold,
    marginBottom: height * 0.008,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: height * 0.006,
  },
  label: {
    fontSize: width * 0.037,
    color: '#555',
    fontFamily: Nunito.regular,
  },
  value: {
    fontSize: width * 0.037,
    color: '#333',
    fontFamily: Nunito.semiBold,
  },
  priceText: {
    color: 'red',
    fontFamily: Nunito.semiBold,
  },
  totalText: {
    color: 'red', 
    fontFamily: Nunito.bold,
  },
  imageContainer: {
    backgroundColor: '#F4F0EC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: width * 0.02,
    overflow: 'hidden',
    width: width * 0.35,
    height: width * 0.42,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.015,
  },
  quantityButton: {
    backgroundColor: '#D45500',
    width: width * 0.065,
    height: width * 0.065,
    borderRadius: width * 0.013,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontFamily: Nunito.bold,
  },
  quantityDisplay: {
    minWidth: width * 0.08,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: width * 0.037,
    color: '#D45500',
    fontFamily: Nunito.bold,
  },
  quantityLoader: {
    marginLeft: width * 0.01,
  },
  bottomFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: height * 0.015,
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
    padding: width * 0.035,
    marginBottom: height * 0.03,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: height * 0.001,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: width * 0.025,
  },
  continuePurchaseButton: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: height * 0.016,
    borderRadius: width * 0.025,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: width * 0.02,
    borderWidth: 2,
    borderColor: '#D45500',
  },
  continuePurchaseButtonText: {
    color: '#D45500',
    fontSize: width * 0.038,
    fontFamily: Nunito.bold,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#D45500',
    paddingVertical: height * 0.016,
    borderRadius: width * 0.025,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: width * 0.02,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: width * 0.038,
    fontFamily: Nunito.bold,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  footerLoader: {
    paddingVertical: height * 0.02,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.12,
  },
  emptyText: {
    fontSize: width * 0.042,
    color: '#999',
    marginTop: height * 0.02,
    fontFamily: Nunito.regular,
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
});

export default Cart;