// Home.js
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation

const { width } = Dimensions.get('window');

// Dummy Categories
const CATEGORIES = ['Boys', 'Ladies', 'Gents', 'Kids'];

// Dummy Product Data
const PRODUCTS = [
  {
    id: '1',
    productCode: 'BC1303',
    color: 'Red',
    total: 'Rs.905',
    quantity: 5,
    image: 'https://www.gstatic.com/webp/gallery/4.jpg',
    sizes: [
      { label: '1 / 1' },
      { label: '2 / 1' },
      { label: '3 / 1' },
      { label: '4 / 1' },
      { label: '5 / 1' },
    ],
  },
  {
    id: '2',
    productCode: 'BC1420',
    color: 'Blue',
    total: 'Rs.1250',
    quantity: 3,
    image: 'https://www.gstatic.com/webp/gallery/5.jpg',
    sizes: [
      { label: '1 / 1' },
      { label: '2 / 1' },
      { label: '3 / 1' },
      { label: '4 / 1' },
      { label: '5 / 1' },
    ],
  },
  {
    id: '3',
    productCode: 'BC1501',
    color: 'Black',
    total: 'Rs.750',
    quantity: 7,
    image: 'https://www.gstatic.com/webp/gallery/2.jpg',
    sizes: [
      { label: '1 / 1' },
      { label: '2 / 1' },
      { label: '3 / 1' },
      { label: '4 / 1' },
      { label: '5 / 1' },
    ],
  },
  {
    id: '4',
    productCode: 'BC1602',
    color: 'White',
    total: 'Rs.1100',
    quantity: 4,
    image: 'https://www.gstatic.com/webp/gallery/1.jpg',
    sizes: [
      { label: '1 / 1' },
      { label: '2 / 1' },
      { label: '3 / 1' },
      { label: '4 / 1' },
    ],
  },
];

// Reusable Category Chip
const CategoryChip = ({ title }) => (
  <TouchableOpacity style={styles.categoryChip}>
    <Text style={styles.categoryText}>{title}</Text>
  </TouchableOpacity>
);

// Reusable Product Card
const ProductCard = ({ product }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('SingleProperty', { product });
  };

  return (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.9}
      onPress={handlePress}
    >
      <View style={styles.productRow}>
        {/* Left: Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.row}>
            <Text style={styles.productCode}>{product.productCode}</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Color:</Text>
            <Text style={styles.value}>{product.color}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Total:</Text>
            <Text style={[styles.value, styles.price]}>{product.total}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Quantity:</Text>
            <Text style={[styles.value, styles.quantity]}>{product.quantity}</Text>
          </View>
        </View>

        {/* Right: Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Size Tags */}
      <View style={styles.sizeTagsContainer}>
        {product.sizes.map((size, index) => (
          <View key={index} style={styles.sizeTag}>
            <Text style={styles.sizeText}>{size.label}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

const Home = () => {
  return (
    <View style={styles.container}>
      {/* Categories */}
      <View style={styles.categorySection}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <CategoryChip title={item} />}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={styles.sectionTitle}>Featured Products</Text>
      </View>

      {/* Products */}
      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

export default Home;

// Styles
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
    backgroundColor: '#D45500',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  categoryText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  titleSection: {
    paddingLeft: width * 0.06,
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  productCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D45500',
  },
  price: {
    color: 'red',
  },
  quantity: {
    color: 'red',
  },
  editButton: {
    backgroundColor: '#D45500',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
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
    height: 145,
  },
  sizeTagsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  sizeTag: {
    width: '18%',
    backgroundColor: '#fff',
    padding: 7,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginVertical: 3,
  },
  sizeText: {
    color: '#000',
    fontSize: 14,
  },
});