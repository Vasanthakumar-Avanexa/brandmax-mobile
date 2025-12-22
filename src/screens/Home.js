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
  ScrollView,
  ToastAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { setProductsList, resetProducts } from '../store/ProductSlice';
import fetchData from '../config/fetchData';
import { Dropdown } from 'react-native-element-dropdown';
import poppins from '../utils/fonts';

const { width } = Dimensions.get('window');

const CATEGORIES = ['ALL', 'BOYS', 'LADIES', 'GENTS', 'KIDS'];
const ITEMS_PER_PAGE = 10;

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
  
  const sizes = product?.productSizes || [];
  const hasSizes = sizes.length > 0;
  const hasMultipleSizes = sizes.length > 1;

  const dropdownData = sizes.map((sizeItem, index) => ({
    label: `${sizeItem?.size?.size}`,
    value: sizeItem?.size?.size || `size-${index}`,
  }));

  const showLoginToast = () => {
    ToastAndroid.show('Login First', ToastAndroid.SHORT);
  };

  const handlePress = () => {
    if (isGuestUser) {
      showLoginToast();
      return;
    }

    console.log('Navigating to SingleProperty with product ID:', product._id || product.id);

    navigation.navigate('SingleProperty', { 
      productId: product._id || product.id  
    });
  };

  const handleSizeChange = (item) => {
    if (isGuestUser) {
      showLoginToast();
      return;
    }
    setSelectedSize(item.value);
  };

  const handleDropdownOpen = () => {
    if (isGuestUser) {
      showLoginToast();
    }
  };

  useEffect(() => {
    if (hasSizes && !selectedSize) {
      setSelectedSize(dropdownData[0]?.value);
    }
  }, []);

  return (
    <TouchableOpacity
      style={styles.productCard}
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
            <Text style={styles.value}>{product?.colour?.color}</Text>
          </View>

          <View style={styles.sizeContainer}>
            <Text style={styles.label}>Size:</Text>
            <View style={styles.dropdownWrapper}>
             { hasMultipleSizes ? (
               <Dropdown
                data={dropdownData}
                labelField="label"
                valueField="value"
                placeholder={hasSizes ? sizes[0]?.size?.size : 'N/A'}
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
             
              <View style={{borderWidth: 1, borderColor: '#ddd', padding: 5, borderRadius: 5, backgroundColor: '#F5F5F5', width: width * 0.3, alignItems: 'center', }}>
                 <Text style={[styles.value, { color: '#333' }]}>
                {sizes[0]?.size?.size || 'N/A'}
              </Text>
              </View>
             )}
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Mrp:</Text>
            <Text style={[styles.value, styles.price]}>
              {product?.product_price || 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Margin:</Text>
            <Text style={[styles.value, styles.quantity]}>
              {product?.product_margin || 'N/A'}
            </Text>
          </View>
        </View>

        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri: product?.product_image || 'https://www.gstatic.com/webp/gallery/4.jpg',
            }}
            style={styles.productImage}
            resizeMode="cover"
          />
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

  const isFetchingRef = useRef(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const guestUser = await AsyncStorage.getItem('isGuestUser');
        if (guestUser === 'true') {
          setIsGuestUser(true);
          console.log('Guest user detected');
        } else {
          const userData = await AsyncStorage.getItem('UserData');
          if (userData) {
            console.log('Logged-in user data loaded');
            setIsGuestUser(false);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUserData();
  }, []);

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
      
      console.log('📦 Fetching products:', payload);

      const response = await fetchData.getProducts(payload);
      const newProducts = Array.isArray(response?.data) ? response.data : [];

      console.log(`✅ Received ${newProducts.length} products for page ${currentPage}`);

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

  useEffect(() => {
    fetchProducts(1, '');
  }, []);

  const handleCategoryPress = useCallback((category) => {
    if (selectedCategory === category) return;

    console.log('Filtering by category:', category);
    
    setSelectedCategory(category);
    setPage(1);
    setHasMore(true);
    setInitialLoading(true);
    
    dispatch(resetProducts());
    
    const searchTerm = category === 'ALL' ? '' : category;
    fetchProducts(1, searchTerm);
  }, [selectedCategory, dispatch, fetchProducts]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore && !isFetchingRef.current) {
      console.log(`Loading page ${page}...`);
      const searchTerm = selectedCategory === 'ALL' ? '' : selectedCategory;
      fetchProducts(page, searchTerm);
    }
  }, [loading, hasMore, page, selectedCategory, fetchProducts]);

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

  return (
    <View style={styles.container}>
      <View style={styles.categorySection}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <CategoryChip
              title={item}
              onPress={handleCategoryPress}
              isActive={
                (item === 'ALL' && !selectedCategory) ||
                item === selectedCategory
              }
            />
          )}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.sectionTitle}>
          {selectedCategory ? `${selectedCategory} Products` : 'Featured Products'}
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
    paddingLeft: 15,
    marginTop: 10,
  },
  categoryList: {
    paddingRight: 15,
  },
  categoryChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryChipActive: {
    backgroundColor: '#D45500',
    borderColor: '#D45500',
  },
  categoryText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 15,
    fontFamily: poppins.semiBold,
  },
  categoryTextActive: {
    color: '#fff',
    fontFamily: poppins.semiBold,
  },
  titleSection: {
    marginTop: 10,
    paddingLeft: width * 0.06,
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: poppins.bold,
  },
  productList: {
    paddingBottom: 20,
  },
  productCard: {
    width: width * 0.9,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsContainer: {
    width: '50%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontFamily: poppins.regular,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: poppins.medium,
  },
  productCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D45500',
    fontFamily: poppins.semiBold,
  },
  price: {
    color: 'red',
    fontFamily: poppins.medium,
  },
  quantity: {
    color: 'red',
    fontFamily: poppins.medium,
  },
  imageWrapper: {
    backgroundColor: '#F4F0EC',
    borderRadius: 5,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: 145,
    height: 155,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    fontFamily: poppins.regular,
  },
  centerLoader: {
    marginTop: 50,
  },
  footerLoader: {
    marginVertical: 20,
  },
  sizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  dropdownWrapper: {
    flex: 1,
    marginLeft: "10%",
  },
  dropdown: {
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 20,
    paddingVertical: 5,
    height: 35,
    flex: 1,
    width: width * 0.3,
  },
  dropdownDisabled: {
    opacity: 0.7,
  },
  dropdownPlaceholder: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    fontFamily: poppins.medium,
  },
  dropdownSelectedText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    fontFamily: poppins.medium,
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
    fontSize: 14,
    color: '#333',
    fontFamily: poppins.regular,
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#666',
    fontFamily: poppins.regular,
  },
});