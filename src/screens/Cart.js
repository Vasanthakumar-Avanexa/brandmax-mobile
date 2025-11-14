// import React from 'react';
// import { View, Text } from 'react-native';

// const Cart = () => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff000' }}>
//     <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 18 }}>Cart Screen</Text>
//   </View>
// );
// export default Cart;


import { View, Text, Image,TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { RadioButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Entypo';

const screenwidth=Dimensions.get('window').width;
const screenHeight=Dimensions.get('window').height;

const Cart=({navigation})=> {

    const [selectedValue, setSelectedValue] = useState('');

    const handlleConfirmOrder = () => {
      navigation.navigate('ConfirmOrderScreen');
    };
  return (
    <View >
     <View style={styles.container}>
      <View style={styles.row}>
        
        {/* Left section */}
        <View style={{ width: '50%'}}>
           <View style={styles.row}>
      <Text style={styles.text}>BC1303</Text>

      <TouchableOpacity style={styles.textButton}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
    </View>

       <View style={[styles.row, { alignItems: 'center' }]}>
  <Text style={styles.text}>Color:</Text>
  
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    {/* <RadioButton value="first" onPress={setSelectedValue}/> */}
    <Text style={styles.text}>Red</Text>
  </View>
</View>

           <View style={styles.row}>
            <Text style={styles.text}>Total:</Text>
            <Text style={[styles.text,{color:'red'}]}>Rs.905</Text>
          </View>
           <View style={styles.row}>
            <Text style={styles.text}>Quantity:</Text>
            <Text style={[styles.text,{color:'red'}]}>5</Text>
          </View>
        </View>

        {/* Right section (Image) */}
        <View style={styles.imageContainer}>
  <Image
    source={{
      uri: 'https://www.gstatic.com/webp/gallery/4.jpg',
    }}
    style={styles.image}
    resizeMode="cover"
  />
</View>


      </View>
      <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
       {Array.from({ length: 5 }).map((_, index) => (
  <TouchableOpacity
    key={index} // ✅ unique key added here
    style={{
      width: '15%',
      backgroundColor: 'white',
      padding: 7,
      borderRadius: 5,
      borderWidth: 1,
      alignItems: 'center',
    }}
  >
    <Text style={{ color: 'black' }}>{index + 1} / 1</Text>
  </TouchableOpacity>
))}

         </View>
    </View>
<View style={{ alignItems: 'flex-end', marginRight: 20 }}>
  <View style={styles.priceContainer}>
    <View style={styles.summaryRow}>
      <Text style={styles.label}>Total Quantity:</Text>
      <Text style={styles.value}>5</Text>
    </View>

    <View style={styles.summaryRow}>
      <Text style={styles.label}>Net Amount:</Text>
      <Text style={styles.value}>₹2715</Text>
    </View>
  </View>
</View>

<View style={{ alignItems: 'flex-end', marginRight: 20,marginTop:20 }}>
  <View style={styles.priceContainer}>
    <TouchableOpacity onPress={handlleConfirmOrder} style={[styles.textButton,{flexDirection:'row',justifyContent:'center',alignItems:'center'}]}>
      <Text style={[styles.label,{color:'#ffff'}]}>Confirm Order  <Icon name="forward" size={18} color="#ffff" /></Text>
      
    </TouchableOpacity>
  </View>
</View>

    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    width: screenwidth*0.9,
    marginLeft:screenwidth*0.05,
    marginTop: 20,
    padding: 15,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 10,
    
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5
  },
    textbutton: {
    fontSize: 16,
    marginRight: 5,
    backgroundColor:'#D45500',
    padding: 7,
    borderRadius: 5
  },
  text: {
    fontSize: 16,
    marginRight: 5,
  },
  box: {
    height: 10,
    backgroundColor: 'lightgray',
    marginVertical: 4,
    borderRadius: 4,
  },
  imageContainer: {
    backgroundColor: '#F4F0EC',
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 145,
    width: 145,
    borderRadius:5
  },
  textButton: {
    backgroundColor: '#D45500',
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  priceContainer: {
    marginTop: screenwidth * 0.03,
    backgroundColor: '#fff',
    elevation: 4,
    borderRadius: 8,
    padding: 10,
    width: screenwidth*0.5, // or '60%' depending on design
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: {
    fontSize: 15,
    color: '#444',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#D45500',
  },
});
export default Cart