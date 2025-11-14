import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList, Dimensions, StatusBar } from 'react-native';
import React, { useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const SingleProperty = ({navigation}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
   const [selectedColor, setSelectedColor] = useState("#ffffff");
  const flatListRef = useRef();

  const arr = [
    { id: 1, num1: require('../../assets/images/logo_back.png') },
    { id: 2, num1: require('../../assets/images/logo_back.png') },
    { id: 3, num1: require('../../assets/images/logo_back.png') },
  ];

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity
        onPress={() => {navigation.goBack();}}
         style={styles.backButton}>
          <Icon name="arrow-back" size={30} color="black" />
        </TouchableOpacity>

        <FlatList
          ref={flatListRef}
          data={arr}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Image source={item.num1} style={styles.image} resizeMode="contain" />
          )}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
        />

        <View style={styles.dotContainer}>
          {arr.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, currentIndex === index && styles.activeDot]}
            />
          ))}
        </View>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.productCode}>BC1303</Text>
        <View style={styles.stockRow}>
          <Entypo name="check" size={25} color="green" />
          <Text style={styles.stockText}>In Stock</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>Color:</Text>
          <Text style={styles.cardText}>Red</Text>

        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>MRP:</Text>
          <Text style={styles.priceText}>Rs.905</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>Price:</Text>
          <Text style={styles.priceText}>Rs.905</Text>
        </View>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>Margin:</Text>
          <Text style={styles.cardText}>0%</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Text style={styles.cardText}>Size Available:</Text>
          <Text style={styles.cardText}>(1,2,3,4,5)</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.actionRow}>
        <Text style={styles.cardText}>Set Order</Text>
        <TouchableOpacity style={styles.orangeButton}>
          <Text style={styles.buttonText}>Set</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.actionRow}>
        <Text style={styles.cardText}>Cut Size</Text>
        <TouchableOpacity style={styles.orangeButton}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomInfoRow}>
        <View style={styles.infoCard}>
          <Text style={styles.orangeText}>Quantity: 0</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.orangeText}>Total Rate: Rs.0</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.addToCartButton}>
        <Text style={styles.buttonText}>Add to Cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SingleProperty;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    top:StatusBar.currentHeight 
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F0EC',
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 5,
    left: 10,
    zIndex: 10,
  },
  image: {
    width: screenWidth,
    height: screenHeight * 0.32,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    paddingBottom:15
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: '#D45500',
    width: 10,
    height: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  productCode: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '92%',
    borderWidth: 1,
    borderColor: 'grey',
    marginTop: 15,
    padding: 10,
    marginLeft: 15,
    borderRadius: 5,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'red',
    marginLeft: 5,
  },
  divider: {
    width: '92%',
    borderWidth: 0.8,
    borderColor: 'lightgrey',
    marginTop: 20,
    marginLeft: 15,
    borderRadius: 5,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '92%',
    marginTop: 15,
    padding: 10,
    marginLeft: 15,
    borderRadius: 5,
  },
  orangeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D45500',
    paddingHorizontal: 15,
    borderRadius: 5,
    paddingVertical: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  bottomInfoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    marginLeft: 15,
    marginRight: 10,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginLeft: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    paddingVertical: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  orangeText: {
    color: '#D45500',
    fontSize: 16,
    fontWeight: '600',
  },
  addToCartButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '92%',
    backgroundColor: '#D45500',
    marginTop: 15,
    padding: 10,
    marginLeft: 15,
    borderRadius: 5,
  },
});
