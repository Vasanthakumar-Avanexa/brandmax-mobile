import React from 'react';
import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import {
  TouchableOpacity,
  View,
  Text,
  StatusBar,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Home from '../screens/Home';
import Cart from '../screens/Cart';
import Profile from '../screens/Profile';
import AboutUsScreen from '../screens/AboutUsScreen';
import TermsAndConditions from '../screens/TermsAndConditions';
import MyOrders from '../screens/MyOrders';
import ConfirmOrderScreen from '../screens/ConfirmOrderScreen';
import FAQScreen from '../screens/FAQScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import CustomerSupportScreen from '../screens/CustomerSupportScreen';
import OrderSummaryScreen from '../screens/OrderSummaryScreen';
import SingleProperty from '../screens/SingleProperty';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function CustomDrawerContent(props) {
  const { navigation } = props;

  const goToTab = (screen) => {
    navigation.navigate('Tabs', { screen });
    navigation.closeDrawer(); 
  };

  const navigateAndClose = (screenName) => {
    navigation.navigate(screenName);
    navigation.closeDrawer();
  };

  return (
    <View style={{ flex: 1, top: StatusBar.currentHeight }}>
      <View
        style={{
          alignItems: 'center',
          padding: 30,
          borderBottomWidth: 1,
          borderColor: '#eee',
          height: 150,
        }}>
        <Image
          source={require('../../assets/images/logo_back.png')}
          resizeMode="contain"
          style={{ width: '100%', height: '100%' }}
        />
      </View>

      {/* <DrawerContentScrollView contentContainerStyle={{ flexGrow: 1 }}> */}
        <TouchableOpacity style={styles.drawerItem} onPress={() => goToTab('Home')}>
          <Feather name="home" size={22} color="#D45500" />
          <Text style={styles.drawerLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={() => navigateAndClose('MyOrders')}>
          <Feather name="shopping-bag" size={22} color="#D45500" />
          <Text style={styles.drawerLabel}>Order</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={() => navigateAndClose('CustomerSupport')}>
          <Feather name="phone" size={22} color="#D45500" />
          <Text style={styles.drawerLabel}>Customer Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={() => navigateAndClose('FAQ')}>
          <Feather name="help-circle" size={22} color="#D45500" />
          <Text style={styles.drawerLabel}>FAQ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={() => navigateAndClose('PrivacyPolicy')}>
          <Feather name="lock" size={22} color="#D45500" />
          <Text style={styles.drawerLabel}>Privacy Policy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={() => navigateAndClose('TermsAndConditions')}>
          <Feather name="file-text" size={22} color="#D45500" />
          <Text style={styles.drawerLabel}>Terms & Conditions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={() => navigateAndClose('AboutBrandMax')}>
          <Feather name="info" size={22} color="#D45500" />
          <Text style={styles.drawerLabel}>About Us</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0</Text>
        </View>

        <TouchableOpacity
          style={styles.logoutItem}
          onPress={() => {
            navigation.closeDrawer();
            alert('Logged out!');
          }}>
          <Feather name="log-out" size={22} color="#D45500" />
          <Text style={styles.logoutLabel}>Logout</Text>
        </TouchableOpacity>
      {/* </DrawerContentScrollView> */}
    </View>
  );
}

function TabNavigator({ navigation }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: route.name,
        headerTintColor: '#fff',
        headerTitleStyle: { fontSize: 20,fontWeight:'bold' },
        headerStyle: {
          backgroundColor: '#D45500',
        },

        headerLeft: () => {
          if (route.name === 'Home') {
            return (
              <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={{ marginLeft: 15 }}>
                <Feather name="menu" size={24} color="#fff" />
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Tabs', { screen: 'Home' });
                navigation.goBack();
              }}
              style={{ marginLeft: 15 }}>
              <Feather name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
          );
        },

        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Cart') iconName = 'shopping-cart';
          else if (route.name === 'Profile') iconName = 'user';
          return <Feather name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Cart" component={Cart} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

function MainDrawer() {
  return (
    <>
      <StatusBar backgroundColor="#D45500" />
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: { width: '75%', backgroundColor: '#fff' },
          headerShown: false,
        }}
      >
        <Drawer.Screen name="Tabs" component={TabNavigator} />
      </Drawer.Navigator>
    </>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainDrawer" component={MainDrawer} />
      <Stack.Screen name="AboutBrandMax" 
      
      options={{
        headerShown: true,
        headerTitle: 'About Us',
        headerStyle: { backgroundColor: '#D45500' },
        headerTintColor: '#fff',
      }}
      component={AboutUsScreen} />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
        options={{
          headerShown: true,
          headerTitle: 'Terms & Conditions',
          headerStyle: { backgroundColor: '#D45500' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="MyOrders"
        component={MyOrders}
        options={{
          headerShown: true,
          headerTitle: 'My Orders',
          headerStyle: { backgroundColor: '#D45500' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="ConfirmOrderScreen"
        component={ConfirmOrderScreen}
        options={{
          headerShown: true,
          headerTitle: 'Confirm Order',
          headerStyle: { backgroundColor: '#D45500' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="CustomerSupport"
        component={CustomerSupportScreen}
        options={{
          headerShown: true,
          headerTitle: 'Customer Support',
          headerStyle: { backgroundColor: '#D45500' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="FAQ"
        component={FAQScreen}
        options={{
          headerShown: true,
          headerTitle: 'FAQ',
          headerStyle: { backgroundColor: '#D45500' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{
          headerShown: true,
          headerTitle: 'Privacy Policy',
          headerStyle: { backgroundColor: '#D45500' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name="OrderSummaryScreen"
        component={OrderSummaryScreen}
        options={{
          headerShown: true,
          headerTitle: 'Order Summary',
          headerStyle: { backgroundColor: '#D45500' },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen
        name='SingleProperty'
        // getComponent={() => require('../screens/SingleProperty').default}
        component={SingleProperty}
        // options={{
        //   headerShown: true,
        //   headerTitle: 'Property Details',
        //   headerStyle: { backgroundColor: '#D45500' },
        //   headerTintColor: '#fff',
        // }}
      />
    </Stack.Navigator>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    width: 70,
    height: 70,
  },
  logoText: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D45500',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  drawerLabel: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
  versionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#888',
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 30,
  },
  logoutLabel: {
    marginLeft: 16,
    fontSize: 16,
    color: '#D45500',
  }
});