import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
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
  Alert,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setLoggedIn, setGuestUser } from '../store/authSlice';
import poppins from '../utils/fonts';

import Home from '../screens/Home';
import Cart from '../screens/Cart';
import Profile from '../screens/Profile';
import AboutUsScreen from '../screens/AboutUsScreen';
import TermsAndConditions from '../screens/TermsAndConditions';
import MyOrders from '../screens/MyOrders';
import MyProfile from '../screens/MyProfile';
import ConfirmOrderScreen from '../screens/ConfirmOrderScreen';
import FAQScreen from '../screens/FAQScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import CustomerSupportScreen from '../screens/CustomerSupportScreen';
import OrderSummaryScreen from '../screens/OrderSummaryScreen';
import SingleProperty from '../screens/SingleProperty';
import TrackPayments from '../screens/TrackPayments';
import LoginScreen from '../login/LoginScreen';
import RequestRegister from '../login/Register';
import OtpVerifyScreen from '../login/OtpVerifyScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function CustomDrawerContent(props) {
  const { navigation } = props;
  const dispatch = useDispatch();
  const [isGuestUser, setIsGuestUser] = useState(false);

  useEffect(() => {
    checkGuestUser();
  }, []);

  const checkGuestUser = async () => {
    try {
      const guestUser = await AsyncStorage.getItem('isGuestUser');
      setIsGuestUser(guestUser === 'true');
    } catch (error) {
      console.log('Error checking guest user:', error);
    }
  };

  const goToTab = screen => {
    navigation.navigate('Tabs', { screen });
    navigation.closeDrawer();
  };

  const navigateAndClose = screenName => {
    navigation.navigate(screenName);
    navigation.closeDrawer();
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('UserData');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('isGuestUser');
      dispatch(setLoggedIn(false));
      dispatch(setGuestUser(false));
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  const navigateToLogin = () => {
    navigation.closeDrawer();
    navigation.navigate('Login');
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
        }}
      >
        <Image
          source={require('../../assets/images/logo_back.png')}
          resizeMode="contain"
          style={{ width: '100%', height: '100%' }}
        />
      </View>

      {isGuestUser ? (
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={navigateToLogin}
        >
          <Feather name="log-in" size={22} color="#D45500" />
          <Text style={styles.drawerLabel}>Login</Text>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => goToTab('Home')}
          >
            <Feather name="home" size={22} color="#D45500" />
            <Text style={styles.drawerLabel}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigateAndClose('MyOrders')}
          >
            <Feather name="shopping-bag" size={22} color="#D45500" />
            <Text style={styles.drawerLabel}>Order</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigateAndClose('TrackPayments')}
          >
            <Feather name="pie-chart" size={22} color="#D45500" />
            <Text style={styles.drawerLabel}>Track Payments</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigateAndClose('CustomerSupport')}
          >
            <Feather name="phone" size={22} color="#D45500" />
            <Text style={styles.drawerLabel}>Customer Support</Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigateAndClose('FAQ')}
          >
            <Feather name="help-circle" size={22} color="#D45500" />
            <Text style={styles.drawerLabel}>FAQ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigateAndClose('PrivacyPolicy')}
          >
            <Feather name="lock" size={22} color="#D45500" />
            <Text style={styles.drawerLabel}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigateAndClose('TermsAndConditions')}
          >
            <Feather name="file-text" size={22} color="#D45500" />
            <Text style={styles.drawerLabel}>Terms & Conditions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => navigateAndClose('AboutBrandMax')}
          >
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
              Alert.alert(
                'Logout',
                'Are you sure you want to logout?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: handleLogout,
                  },
                ],
                { cancelable: true },
              );
            }}
          >
            <Feather name="log-out" size={22} color="#D45500" />
            <Text style={styles.logoutLabel}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

function TabNavigator({ navigation }) {
  const [isGuestUser, setIsGuestUser] = useState(false);

  useEffect(() => {
    checkGuestUser();
  }, []);

  const checkGuestUser = async () => {
    try {
      const guestUser = await AsyncStorage.getItem('isGuestUser');
      setIsGuestUser(guestUser === 'true');
    } catch (error) {
      console.log('Error checking guest user:', error);
    }
  };

  const handleLoginPress = () => {
    console.log('Navigating to Login Screen');
    navigation.navigate('Login');
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: isGuestUser ? 'Guest' : route.name,
        headerTintColor: '#fff',
        headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
        headerStyle: {
          backgroundColor: '#D45500',
        },

        headerLeft: () => {
          if (isGuestUser) {
            return (
              <TouchableOpacity
                onPress={handleLoginPress}
                style={{ marginLeft: 15 }}
              >
                <Feather name="menu" size={24} color="#fff" />
              </TouchableOpacity>
            );
          }

          if (route.name === 'Home') {
            return (
              <TouchableOpacity
                onPress={() => navigation.openDrawer()}
                style={{ marginLeft: 15 }}
              >
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
              style={{ marginLeft: 15 }}
            >
              <Feather name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
          );
        },

        headerRight: () => {
          if (isGuestUser) {
            return null;
          }

          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('Tabs', { screen: 'Cart' })}
              style={{ marginRight: 15 }}
            >
              <Feather name="shopping-cart" size={24} color="#fff" />
            </TouchableOpacity>
          );
        },

        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (isGuestUser) {
            iconName = 'log-in';
          } else {
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Cart') iconName = 'shopping-cart';
            else if (route.name === 'Profile') iconName = 'user';
          }

          return <Feather name={iconName} size={size} color={color} />;
        },

        tabBarLabel: ({ color }) => {
          if (isGuestUser) {
            return <Text style={{ color, fontSize: 12 }}>Login</Text>;
          }
          return <Text style={{ color, fontSize: 12 }}>{route.name}</Text>;
        },
      })}
    >
      {isGuestUser ? (
        <Tab.Screen
          name="Login"
          component={Home}
          listeners={({ navigation }) => ({
            tabPress: e => {
              e.preventDefault();
              handleLoginPress();
            },
          })}
        />
      ) : (
        <>
          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Cart" component={Cart} />
          <Tab.Screen name="Profile" component={Profile} />
        </>
      )}
    </Tab.Navigator>
  );
}

function MainDrawer() {
  return (
    <>
      <StatusBar backgroundColor="#D45500" />
      <Drawer.Navigator
        drawerContent={props => <CustomDrawerContent {...props} />}
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
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="TrackPayments"
    >
      <Stack.Screen
        name="TrackPayments"
        component={TrackPayments}
        options={{
          headerShown: false,
        }}
      />
      
      <Stack.Screen
        name="MainDrawer"
        component={MainDrawer}
      />
      <Stack.Screen
        name="AboutBrandMax"
        component={AboutUsScreen}
        options={{
          headerShown: true,
          headerTitle: 'About Us',
          headerStyle: { backgroundColor: '#D45500' },
          headerTintColor: '#fff',
        }}
      />
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
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="RequestRegister"
        component={RequestRegister}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="OtpVerify"
        component={OtpVerifyScreen}
        options={{
          headerShown: false,
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
        name="MyProfile"
        component={MyProfile}
        options={{
          headerShown: true,
          headerTitle: 'My Profile',
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
        name="SingleProperty"
        component={SingleProperty}
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
    color: '#D45500',
    fontFamily: poppins.bold,
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
    fontFamily: poppins.semiBold,
  },
  versionContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#888',
    fontFamily: poppins.regular,
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
    fontFamily: poppins.semiBold,
  },
});