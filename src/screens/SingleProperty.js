import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Modal,
  TextInput,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import fetchData from '../config/fetchData';
import showToast from '../utils/common_fn';
import poppins from '../utils/fonts';

const { width } = Dimensions.get('window');

const SingleProperty = ({ route, navigation }) => {
  const { productId } = route.params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [setOrderQuantity, setSetOrderQuantity] = useState(0);
  const [cutSizeModalVisible, setCutSizeModalVisible] = useState(false);
  const [cutSizeQuantities, setCutSizeQuantities] = useState({});
  const [outOffStock, setOutOffStock] = useState(false);

  const flatListRef = useRef(null);
  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const fallbackImages = [
    require('../../assets/images/logo_back.png'),
    require('../../assets/images/logo_back.png'),
    require('../../assets/images/logo_back.png'),
  ];

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetchData.getProductById(productId);
      console.log('Fetched product:', response);
      
      const allZero = response?.data?.productSizes?.every(
        item => item.quantity === 0,
      );
      setOutOffStock(allZero);
      setProduct(response.data || response);
    } catch (error) {
      console.error('Error fetching product:', error);
      showToast('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  // Calculate remaining quantity based on available stock and cart quantity
  const getRemainingQuantity = (sizeItem) => {
    const available = sizeItem.quantity;
    const inCart = sizeItem.cartQuantity || 0;
    return available - inCart;
  };

  // Check if size is already in cart
  const isItemAlreadyInCart = (sizeItem) => {
    return sizeItem.cartQuantity && sizeItem.cartQuantity > 0;
  };

  const handleCutSizeQuantityChange = (sizeId, value) => {
    const size = product.productSizes.find(s => s.id === sizeId);
    const numValue = parseInt(value) || 0;
    const remaining = getRemainingQuantity(size);

    if (numValue > remaining) {
      const cartQty = size.cartQuantity || 0;
      if (isItemAlreadyInCart(size)) {
        showToast(
          `Item already in cart (${cartQty}). You can only add ${remaining} more.`
        );
      } else {
        showToast(`Only ${size.quantity} items available for size ${size.size.size}`);
      }
      setCutSizeQuantities(prev => ({
        ...prev,
        [sizeId]: remaining,
      }));
    } else {
      setCutSizeQuantities(prev => ({
        ...prev,
        [sizeId]: numValue,
      }));
    }
  };

  const handleCutSizeIncrease = sizeId => {
    const size = product.productSizes.find(s => s.id === sizeId);
    const currentQty = cutSizeQuantities[sizeId] || 0;
    const remaining = getRemainingQuantity(size);

    if (currentQty >= remaining) {
      const cartQty = size.cartQuantity || 0;
      if (isItemAlreadyInCart(size)) {
        showToast(
          `Item already in cart (${cartQty}). You can only add ${remaining} more.`
        );
      } else {
        showToast(`Only ${size.quantity} items available for size ${size.size.size}`);
      }
    } else {
      setCutSizeQuantities(prev => ({
        ...prev,
        [sizeId]: currentQty + 1,
      }));
    }
  };

  const handleCutSizeDecrease = sizeId => {
    const currentQty = cutSizeQuantities[sizeId] || 0;
    if (currentQty > 0) {
      setCutSizeQuantities(prev => ({
        ...prev,
        [sizeId]: currentQty - 1,
      }));
    }
  };

  const getTotalCutSizeQuantity = () => {
    return Object.values(cutSizeQuantities).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalAmount = () => {
    const totalQty = getTotalCutSizeQuantity();
    const price = parseFloat(product?.product_price) || 0;
    return totalQty * price;
  };

  const handleAddToCart = async () => {
    const totalQty = getTotalCutSizeQuantity();

    if (totalQty === 0) {
      showToast('Please select at least one size with quantity');
      setCutSizeModalVisible(true);
      return;
    }

    const varient = Object.entries(cutSizeQuantities)
      .filter(([_, quantity]) => quantity > 0)
      .map(([productSizeId, quantity]) => {
        const productSize = product.productSizes.find(
          ps => ps.id === parseInt(productSizeId),
        );
        return {
          size_id: productSize.size_id,
          quantity: quantity,
        };
      });

    const payload = {
      product_id: product.id,
      varient: varient,
    };

    try {
      setAddingToCart(true);
      const response = await fetchData.addToCart(payload);
      console.log('Add to cart response:', response);

      if (response.success) {
        showToast('Product added to cart successfully!');
        setCutSizeQuantities({}); 
        navigation.navigate('MainDrawer', {
          screen: 'Tabs',
          params: {
            screen: 'Cart',
            params: { refreshCart: true },
          },
        });
      } else {
        showToast(response.message || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast(error.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#D45500" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loader}>
        <Text style={styles.loaderText}>Product not found</Text>
      </View>
    );
  }

  const images = product.product_image
    ? [{ uri: product.product_image }]
    : fallbackImages.map(src => ({ source: src }));

  const sizes = product.productSizes || [];
  const sizeText =
    sizes.length > 0
      ? sizes
          .filter(s => s.quantity > 0)
          .map(s => s.size?.size)
          .join(', ') || 'N/A'
      : 'N/A';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.imageContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={30} color="black" />
        </TouchableOpacity>

        <FlatList
          ref={flatListRef}
          data={
            images.length > 0
              ? images
              : fallbackImages.map((_, i) => ({ id: i }))
          }
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Image
              source={
                item.uri ? { uri: item.uri } : item.source || fallbackImages[0]
              }
              style={styles.image}
              resizeMode="contain"
            />
          )}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
        />

        <View style={styles.dotContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.productCode}>
          {product.category?.name} {product.article?.code}
        </Text>
        {outOffStock ? (
          <View style={styles.stockRow}>
            <Entypo name="cross" size={25} color="red" />
            <Text style={styles.stockText}>Not In Stock</Text>
          </View>
        ) : (
          <View style={styles.stockRow}>
            <Entypo name="check" size={25} color="green" />
            <Text style={styles.stockText}>In Stock</Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>Color:</Text>
          <Text style={styles.cardText}>{product.colour?.color || 'N/A'}</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>MRP:</Text>
          <Text style={styles.priceText}>
            Rs. {product.product_mrp || product.product_price || 'N/A'}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>Price:</Text>
          <Text style={styles.priceText}>
            Rs. {product.product_price || 'N/A'}
          </Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>Margin:</Text>
          <Text style={styles.cardText}>{product.product_margin || '0'}%</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>Size Available:</Text>
          <Text style={styles.cardText}>({sizeText})</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.actionRow}>
        <Text style={styles.cardText}>Cut Size</Text>
        <TouchableOpacity
          style={styles.orangeButton}
          onPress={() => setCutSizeModalVisible(true)}
        >
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomInfoRow}>
        <View style={styles.infoCard}>
          <Text style={styles.orangeText}>
            Quantity: {setOrderQuantity + getTotalCutSizeQuantity()}
          </Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.orangeText}>
            Total Rate: Rs.{getTotalAmount().toFixed(2)}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.addToCartButton, addingToCart && styles.disabledButton]}
        onPress={handleAddToCart}
        disabled={addingToCart}
      >
        {addingToCart ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Add to Cart</Text>
        )}
      </TouchableOpacity>

      <Modal
        visible={cutSizeModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCutSizeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Cut Sizes</Text>
              <TouchableOpacity onPress={() => setCutSizeModalVisible(false)}>
                <Icon name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {sizes.map(sizeItem => {
                const remaining = getRemainingQuantity(sizeItem);
                const inCart = sizeItem.cartQuantity || 0;

                return (
                  <View key={sizeItem.id} style={styles.sizeRow}>
                    <View style={styles.sizeInfo}>
                      <Text style={styles.sizeText}>{sizeItem.size.size}</Text>
                      <Text style={styles.availableText}>
                        Available: {sizeItem.quantity}
                      </Text>
                      {inCart > 0 && (
                        <Text style={styles.cartQtyText}>
                          Already in cart: {inCart}
                        </Text>
                      )}
                    </View>
                    <View style={styles.quantityControl}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleCutSizeDecrease(sizeItem.id)}
                      >
                        <Icon name="remove" size={18} color="#fff" />
                      </TouchableOpacity>
                      <TextInput
                        style={styles.quantityInput}
                        value={String(cutSizeQuantities[sizeItem.id] || 0)}
                        onChangeText={value =>
                          handleCutSizeQuantityChange(sizeItem.id, value)
                        }
                        keyboardType="numeric"
                        maxLength={3}
                      />
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => handleCutSizeIncrease(sizeItem.id)}
                        // disabled={remaining <= 0}
                      >
                        <Icon name="add" size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalConfirmButton}
              onPress={() => setCutSizeModalVisible(false)}
            >
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default SingleProperty;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    top: StatusBar.currentHeight,
  },
  loader: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  loaderText: {
    fontSize: 16,
    color: '#333',
    fontFamily: poppins.regular,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F0EC',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    padding: 5,
  },
  image: { width, height: width * 0.9 },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: { backgroundColor: '#D45500', width: 12, height: 8 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  productCode: { 
    fontSize: 20, 
    color: '#D45500',
    fontFamily: poppins.bold,
  },
  stockRow: { flexDirection: 'row', alignItems: 'center' },
  stockText: { 
    marginLeft: 8, 
    fontSize: 16,
    fontFamily: poppins.semiBold,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  cardText: { 
    fontSize: 16, 
    fontFamily: poppins.semiBold,
  },
  priceText: { 
    fontSize: 16, 
    color: 'red',
    fontFamily: poppins.semiBold,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
    marginHorizontal: 15,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  orangeButton: {
    backgroundColor: '#D45500',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16,
    fontFamily: poppins.bold,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityButton: {
    backgroundColor: '#D45500',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    minWidth: 40,
    textAlign: 'center',
    fontFamily: poppins.bold,
  },
  bottomInfoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 15,
    marginTop: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    elevation: 3,
    marginLeft: 10,
  },
  orangeText: { 
    color: '#D45500', 
    fontSize: 16,
    fontFamily: poppins.bold,
  },
  addToCartButton: {
    backgroundColor: '#D45500',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: '30%',
  },
  disabledButton: {
    backgroundColor: '#E89674',
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    color: '#333',
    fontFamily: poppins.bold,
  },
  modalBody: {
    padding: 20,
  },
  sizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sizeInfo: {
    flex: 1,
  },
  sizeText: {
    fontSize: 18,
    color: '#333',
    fontFamily: poppins.semiBold,
  },
  availableText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontFamily: poppins.regular,
  },
  cartQtyText: {
    fontSize: 13,
    color: '#D45500',
    marginTop: 2,
    fontFamily: poppins.semiBold,
  },
  remainingText: {
    fontSize: 12,
    color: '#FF6B6B',
    marginTop: 2,
    fontFamily: poppins.medium,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    width: 50,
    height: width * 0.1,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: poppins.semiBold,
  },
  modalConfirmButton: {
    backgroundColor: '#D45500',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
});