import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  ActivityIndicator,
  Modal,
  BackHandler,
  ToastAndroid,
  Pressable,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { setProductsList, resetProducts, setCartCount } from '../store/ProductSlice';
import fetchData from '../config/fetchData';
import { Dropdown } from 'react-native-element-dropdown';
import Nunito from '../utils/fonts';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CATEGORIES = [
  { display: 'All', value: 'ALL' },
  { display: 'Boys', value: 'BOYS' },
  { display: 'Ladies', value: 'LADIES' },
  { display: 'Gents', value: 'GENTS' },
  { display: 'Kids', value: 'KIDS' }
];

const ITEMS_PER_PAGE = 10;

const getColorCode = (colorName) => {
  if (!colorName) return '#FFFFFF';
  
  const colorMap = {
    'BLACK': '#000000',
    'WHITE': '#FFFFFF',
    'RED': '#FF0000',
    'BLUE': '#0000FF',
    'GREEN': '#008000',
    'YELLOW': '#FFFF00',
    'GREY': '#808080',
    'GRAY': '#808080',
    'BROWN': '#8B4513',
    'PINK': '#FFC0CB',
    'PURPLE': '#800080',
    'ORANGE': '#FFA500',
    'NAVY': '#000080',
    'BEIGE': '#F5F5DC',
    'CREAM': '#FFFDD0',
    'MAROON': '#800000',
    'BLKWHT': '#000000',
  };
  
  const normalizedColor = colorName.toUpperCase().trim();
  return colorMap[normalizedColor] || '#FFFFFF';
};

const CategoryChip = React.memo(({ title, onPress, isActive }) => (
  <TouchableOpacity 
    style={[
      styles.categoryChip, 
      isActive && styles.categoryChipActive
    ]} 
    onPress={() => onPress(title)}
  >
    <Text style={[
      styles.categoryText,
      isActive && styles.categoryTextActive
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
));

const ProductCard = React.memo(({ product, isGuestUser }) => {
  const navigation = useNavigation();
  const [selectedSize, setSelectedSize] = useState(null);
  
  const isOutOfStock = product?.totalStock === 0;
  
  const sizes = (product?.productSizes || []).filter(sizeItem => sizeItem?.quantity > 0);
  const hasSizes = sizes.length > 0;
  const hasMultipleSizes = sizes.length > 1;

  const dropdownData = sizes.map((sizeItem, index) => ({
    label: `${sizeItem?.size?.size}`,
    value: sizeItem?.size?.size || `size-${index}`,
  }));

  const showLoginToast = () => {
    ToastAndroid.show('Login First', ToastAndroid.SHORT);
  };

  const showOutOfStockToast = () => {
    ToastAndroid.show('This item is currently out of stock', ToastAndroid.SHORT);
  };

  const handlePress = () => {
    if (isOutOfStock) {
      showOutOfStockToast();
      return;
    }

    if (isGuestUser) {
      showLoginToast();
      return;
    }

    navigation.navigate('SingleProperty', { 
      productId: product._id || product.id  
    });
  };

  const handleSizeChange = (item) => {
    if (isGuestUser) {
      showLoginToast();
      return;
    }
    if (isOutOfStock) {
      showOutOfStockToast();
      return;
    }
    setSelectedSize(item.value);
  };

  const handleDropdownOpen = () => {
    if (isGuestUser) {
      showLoginToast();
    } else if (isOutOfStock) {
      showOutOfStockToast();
    }
  };

  useEffect(() => {
    if (hasSizes && !selectedSize && !isOutOfStock) {
      setSelectedSize(dropdownData[0]?.value);
    }
  }, [hasSizes, selectedSize, dropdownData, isOutOfStock]);

  const colorName = product?.colour?.color || '';
  const colorCode = getColorCode(colorName);

  return (
    <TouchableOpacity
      style={[styles.productCard, isOutOfStock && styles.productCardOutOfStock]}
      activeOpacity={0.9}
      onPress={handlePress}
    >
      <View style={styles.productRow}>
        <View style={styles.detailsContainer}>
          <View style={styles.row}>
            <Text style={styles.productCode}>
              {product?.category?.name} {product?.article?.code}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Color:</Text>
            <View style={styles.colorValueContainer}>
              <View style={[styles.colorCircle, { backgroundColor: colorCode }]} />
              <Text style={styles.value}>{colorName || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.sizeContainer}>
            <Text style={styles.label}>Size:</Text>
            <View style={styles.dropdownWrapper}>
             {isOutOfStock ? (
               <View style={styles.singleSizeContainer}>
                 <Text style={[styles.value, { color: '#999' }]}>
                   Size
                 </Text>
               </View>
             ) : hasMultipleSizes ? (
               <Dropdown
                data={dropdownData}
                labelField="label"
                valueField="value"
                placeholder={hasSizes ? sizes[0]?.size?.size : 'Size'}
                value={selectedSize}
                onChange={(item) => {
                  if (!isGuestUser) {
                    handleSizeChange(item);
                  }
                }}
                onFocus={() => {
                  if (isGuestUser) {
                    handleDropdownOpen();
                  }
                }}
                style={[
                  styles.dropdown,
                  isGuestUser && styles.dropdownDisabled
                ]}
                placeholderStyle={styles.dropdownPlaceholder}
                selectedTextStyle={styles.dropdownSelectedText}
                containerStyle={styles.dropdownContainer}
                itemTextStyle={styles.dropdownItemText}
                activeColor="#F5F5F5"
                disable={isGuestUser || !hasMultipleSizes}
                renderRightIcon={() => (
                  hasMultipleSizes ? (
                    <Text style={styles.dropdownArrow}>▼</Text>
                  ) : null
                )}
              />
             ) : (
              <View style={styles.singleSizeContainer}>
                 <Text style={[styles.value, { color: '#333' }]}>
                {sizes[0]?.size?.size || 'Size'}
              </Text>
              </View>
             )}
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>MRP:</Text>
            <Text style={[styles.value, styles.price]}>
               ₹{product?.product_price || '0'} 
            </Text>
          </View>

         {!isGuestUser &&<View style={styles.row}>
            <Text style={styles.label}>Margin:</Text>
            <Text style={[styles.value, styles.quantity]}>
              {product?.product_margin || '0'}%
            </Text>
          </View> } 
        </View>
{console.log("-------image---->",product?.product_image)
}
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: product?.product_image || 'https://www.gstatic.com/webp/gallery/4.jpg',
            }}
            style={[styles.productImage, isOutOfStock && styles.productImageOutOfStock]}
            resizeMode="cover"
          />
          {isOutOfStock && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const ProductEmptyComponent = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>No Products Available</Text>
  </View>
);

const Home = () => {
  const products = useSelector((state) => state.product.products);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isGuestUser, setIsGuestUser] = useState(false);
  const [exitModalVisible, setExitModalVisible] = useState(false);

  const isFetchingRef = useRef(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const guestUser = await AsyncStorage.getItem('isGuestUser');
        if (guestUser === 'true') {
          setIsGuestUser(true);
        } else {
          const userData = await AsyncStorage.getItem('UserData');
          setIsGuestUser(!userData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);

  const getCount = async () => {
    try {
      const response = await fetchData.getCartCount();
      if (response && response.success) {
        dispatch(setCartCount(response.count || 0));
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const fetchProducts = useCallback(async (currentPage, filterCategory = '') => {
    if (isFetchingRef.current) return;
    
    isFetchingRef.current = true;
    setLoading(true);

    try {
      const payload = { 
        search: filterCategory, 
        page: currentPage, 
        limit: ITEMS_PER_PAGE 
      };

      const response = await fetchData.getProducts(payload);
      console.log("Data loaded After Every page",response);
      
      const newProducts = Array.isArray(response?.data) ? response.data : [];

      if (newProducts.length > 0) {
        dispatch(setProductsList(newProducts));
        
        if (newProducts.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        } else {
          setPage(currentPage + 1);
        }
      } else {
        setHasMore(false);
      }

    } catch (err) {
      console.error('Error fetching products:', err);
      setHasMore(false);
    } finally {
      setLoading(false);
      setInitialLoading(false);
      isFetchingRef.current = false;
    }
  }, [dispatch]);

  const handleCategoryPress = useCallback((categoryValue) => {
    if (selectedCategory === categoryValue) return;

    setSelectedCategory(categoryValue);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
    dispatch(resetProducts());
    
    const searchTerm = categoryValue === 'ALL' ? '' : categoryValue;
    fetchProducts(1, searchTerm);
  }, [selectedCategory, dispatch, fetchProducts]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore && !isFetchingRef.current) {
      const searchTerm = selectedCategory === 'ALL' ? '' : selectedCategory;
      fetchProducts(page, searchTerm);
    }
  }, [loading, hasMore, page, selectedCategory, fetchProducts]);

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      setHasMore(true);
      setInitialLoading(true);
      dispatch(resetProducts());
      
      getCount();
      const searchTerm = selectedCategory === 'ALL' ? '' : selectedCategory || '';
      fetchProducts(1, searchTerm);

      const onBackPress = () => {
        setExitModalVisible(true);
        return true; 
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        subscription.remove();
      };
    }, [selectedCategory, dispatch, fetchProducts])
  );

  const handleExitConfirm = () => {
    setExitModalVisible(false);
    BackHandler.exitApp();
  };

  const handleExitCancel = () => {
    setExitModalVisible(false);
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <ActivityIndicator 
        size="large" 
        color="#D45500" 
        style={styles.footerLoader} 
      />
    );
  };

  const getSelectedCategoryDisplay = () => {
    const category = CATEGORIES.find(cat => cat.value === selectedCategory);
    return category ? category.display : 'All';
  };

  return (
    <View style={styles.container}>
      <View style={styles.categorySection}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => (
            <CategoryChip
              title={item.display}
              onPress={() => handleCategoryPress(item.value)}
              isActive={
                (item.value === 'ALL' && !selectedCategory) ||
                item.value === selectedCategory
              }
            />
          )}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.sectionTitle}>
          {selectedCategory ? `${getSelectedCategoryDisplay()} Products` : 'All Products'}
        </Text>
      </View>

      {initialLoading ? (
        <ActivityIndicator 
          size="large" 
          color="#D45500" 
          style={styles.centerLoader} 
        />
      ) : products.length === 0 ? (
        <ProductEmptyComponent />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item, index) => `${item?._id || index}-${index}`}
          renderItem={({ item }) => <ProductCard product={item} isGuestUser={isGuestUser} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productList}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          removeClippedSubviews
          maxToRenderPerBatch={10}
          windowSize={10}
        />
      )}

      <Modal
        transparent={true}
        visible={exitModalVisible}
        animationType="fade"
        onRequestClose={handleExitCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Exit Application?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to exit the app?
            </Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleExitCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.modalButton, styles.exitButton]}
                onPress={handleExitConfirm}
              >
                <Text style={styles.exitButtonText}>Exit</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  categorySection: {
    paddingLeft: SCREEN_WIDTH * 0.04,
    marginTop: SCREEN_HEIGHT * 0.012,
  },
  categoryList: {
    paddingRight: SCREEN_WIDTH * 0.04,
  },
  categoryChip: {
    backgroundColor: '#fff',
    height: SCREEN_HEIGHT * 0.045,
    width: SCREEN_WIDTH * 0.19,
    borderRadius: 10,
    marginHorizontal: SCREEN_WIDTH * 0.013,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryChipActive: {
    backgroundColor: '#D45500',
    borderColor: '#D45500',
  },
  categoryText: {
    color: '#333',
    fontSize: SCREEN_HEIGHT * 0.017,
    fontFamily: Nunito.semiBold,
  },
  categoryTextActive: {
    color: '#fff',
    fontFamily: Nunito.semiBold,
  },
  titleSection: {
    paddingVertical: SCREEN_HEIGHT * 0.006,
    marginLeft: SCREEN_WIDTH * 0.05,
  },
  sectionTitle: {
    fontSize: SCREEN_HEIGHT * 0.023,
    fontFamily: Nunito.bold,
  },
  productList: {
    paddingBottom: SCREEN_HEIGHT * 0.025,
  },
  productCard: {
    width: SCREEN_WIDTH * 0.9,
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: SCREEN_WIDTH * 0.038,
    paddingVertical: SCREEN_HEIGHT * 0.018,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: SCREEN_HEIGHT * 0.018,
  },
  productCardOutOfStock: {
    opacity: 0.85,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  detailsContainer: {
    flex: 1,
    marginRight: SCREEN_WIDTH * 0.025,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SCREEN_HEIGHT * 0.004,
  },
  label: {
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#333',
    fontFamily: Nunito.regular,
  },
  value: {
    fontSize: SCREEN_HEIGHT * 0.018,
    fontFamily: Nunito.medium,
  },
  colorValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorCircle: {
    width: SCREEN_WIDTH * 0.03,
    height: SCREEN_WIDTH * 0.03,
    borderRadius: (SCREEN_WIDTH * 0.05) / 2,
    borderWidth: 1,
    borderColor: '#999',
  },
  productCode: {
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#D45500',
    fontFamily: Nunito.semiBold,
  },
  price: {
    color: 'red',
    fontFamily: Nunito.medium,
  },
  quantity: {
    color: 'red',
    fontFamily: Nunito.medium,
  },
  imageWrapper: {
    backgroundColor: '#F4F0EC',
    borderRadius: 5,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH * 0.36,
    height: SCREEN_HEIGHT * 0.18,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productImageOutOfStock: {
    opacity: 0.5,
  },
  outOfStockBadge: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.01,
    right: 0,
    backgroundColor: '#FF0000',
    paddingHorizontal: SCREEN_WIDTH * 0.02,
    paddingVertical: SCREEN_HEIGHT * 0.006,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  outOfStockText: {
    color: '#FFFFFF',
    fontSize: SCREEN_HEIGHT * 0.012,
    fontFamily: Nunito.bold,
    letterSpacing: 0.5,
  },
  emptyContainer: {
    padding: SCREEN_HEIGHT * 0.025,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyText: {
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#777',
    fontFamily: Nunito.regular,
  },
  centerLoader: {
    marginTop: SCREEN_HEIGHT * 0.06,
  },
  footerLoader: {
    marginVertical: SCREEN_HEIGHT * 0.025,
  },
  sizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SCREEN_HEIGHT * 0.004,
  },
  dropdownWrapper: {
    flex: 1,
    marginLeft: SCREEN_WIDTH * 0.05,
  },
  dropdown: {
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: SCREEN_WIDTH * 0.03,
    paddingVertical: SCREEN_HEIGHT * 0.006,
    height: SCREEN_HEIGHT * 0.042,
    flex: 1,
    width: SCREEN_WIDTH * 0.3,
  },
  dropdownDisabled: {
    opacity: 0.7,
  },
  dropdownPlaceholder: {
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#333',
    fontFamily: Nunito.medium,
  },
  dropdownSelectedText: {
    fontSize: SCREEN_HEIGHT * 0.018,
    color: '#333',
    fontFamily: Nunito.medium,
  },
  dropdownContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  dropdownItemText: {
    fontSize: SCREEN_HEIGHT * 0.016,
    color: '#333',
    fontFamily: Nunito.regular,
  },
  dropdownArrow: {
    fontSize: SCREEN_HEIGHT * 0.012,
    color: '#666',
    fontFamily: Nunito.regular,
  },
  singleSizeContainer: {
    borderWidth: 1, 
    borderColor: '#ddd', 
    paddingVertical: SCREEN_HEIGHT * 0.005,
    paddingHorizontal: SCREEN_WIDTH * 0.02,
    borderRadius: 5, 
    backgroundColor: '#F5F5F5', 
    width: SCREEN_WIDTH * 0.3, 
    alignItems: 'center',
    justifyContent:"center"
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: SCREEN_WIDTH * 0.85,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: SCREEN_WIDTH * 0.06,
    paddingVertical: SCREEN_HEIGHT * 0.03,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  modalTitle: {
    fontSize: SCREEN_HEIGHT * 0.026,
    fontFamily: Nunito.bold,
    color: '#D45500',
    marginBottom: SCREEN_HEIGHT * 0.015,
  },
  modalMessage: {
    fontSize: SCREEN_HEIGHT * 0.018,
    fontFamily: Nunito.regular,
    color: '#555',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.035,
    lineHeight: SCREEN_HEIGHT * 0.026,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: SCREEN_HEIGHT * 0.017,
    borderRadius: 10,
    marginHorizontal: SCREEN_WIDTH * 0.02,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  exitButton: {
    backgroundColor: '#D45500',
  },
  cancelButtonText: {
    fontSize: SCREEN_HEIGHT * 0.018,
    fontFamily: Nunito.semiBold,
    color: '#333',
  },
  exitButtonText: {
    fontSize: SCREEN_HEIGHT * 0.018,
    fontFamily: Nunito.semiBold,
    color: '#fff',
  },
});