import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { Avatar } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { setLoggedIn } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import poppins from '../utils/fonts';

const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);

  const UserHeading = [
    {
      id: 1,
      title: 'My Profile',
      iconName: 'user',
      function: () => handleMyProfile(),
    },
    {
      id: 2,
      title: "My Orders",
      iconName: 'shopping-cart',
      function: () => handleMyOrders(),
    },
  ];

  const call = [
    { id: 1, title: 'Call Us', iconName: 'phone', number: '+91 8925208494' },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('UserData');
        if (userDataStr) {
          const user = JSON.parse(userDataStr);
          setUserData(user);
        }
      } catch (e) {
        console.log('Error fetching user data in profile screen ===>', e);
      }
    };
    fetchUserData();
  }, []);

  const handleMyProfile = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('UserData');
      const user = JSON.parse(userDataStr);
      navigation.navigate('MyProfile', { userDetails: user });
    } catch (e) {
      console.log('Error navigating to MyProfile ===>', e);
    }
  };

  const handleMyOrders = () => {
    navigation.navigate('MyOrders');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(['UserData', 'token']);
              dispatch(setLoggedIn(false));
            } catch (error) {
              console.log('Logout error ===>', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* User Info Section */}
      <View style={styles.topContainer}>
        <Avatar.Image
          size={100}
          source={{
            uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJkAAACUCAMAAAC3HHtWAAABHVBMVEX/wgBmcHn/6b+KW0L////u7u/63aTexJLx8fL29vf/wAD5+fr/xAD+57v8/Pz/xgBBR1OHWENvb25ze4BZZXCEVUTNyML/8sff4OClqKpHTlmDUTphbnumnYqdbTyBUkX/xy+SYkD4vwtVXWe3hDP/+e18TUaZaD5Yan7W19f6147/zlnmrhv+467/9d7/1XvIkyvx7OT+4J68nHOuj3T/0WXp1a/+yz3+y0z814TFso/76sru056OjIT4zm3NojyUlpmsejfTnia8iy7cpiLxtRKkczmXgG6sh2a4kWbZwp/RtI2gel2Ublfr8Pt7RC26pIrs4s7EuKOujUuVhF+rqJ6FfWjh1bq6l0d6dmyjilncrDu3ubcxO0pQUVFk7iDTAAAPIUlEQVR4nLWcCVvayhqAg5BAQkJMDQUElUUqokFRiwvUWoW216qnVrsde+7//xl3MtlmzUw83q9PWxKSzMu3zkwmUQpQyiqUCtyoBBtldEMPjiupakmdHrSVLNIeTsFZ5fgKQErohhps6ChDWVUYe1PJxsMdxcgEpoDjd4bjZ5KV8b08sv79TkaoRHZG/WxkJSh6GYoebFSQjVL8ja57O1m1hSrO2PF0PbxcGb12mcVQVkg3Sn6Qjm6U1fFBV6J90xc+nTYu0A5TYDLIkuneiUhfpmnbttJd7Hb5aMqJ98JkUxGXaZvdxeXmh/Wt/GYamWKcTF+QbLRnpIIBZXUvN7c2NqrVqnOZYk2IZuyNXois4rUFXN3dzY7jOHlfLu1ULsjWtmTIwrioQNEZGyNBQJrKfGujmg+kui8G89l2RjrSEsYQbQjzmVhhW3kn5Mo769CUfnzaobBj1Wh7wnzG2Iuoun+erjC7u+nEXEBluzZg9eNzfnkVyHy+21VsGs4472evAQnZiKOwUA2mvbu+kXABlXVtG0Tox46zAcLB/wv+6ax/uAL7STjjePR8Mo9nwu4i+O/qDaIwQLY/38y/2ahiO8Fup/pma39BK857LtkBx5LAhAvQir34SCDkO/lqni1OtXNF5TljePcMstKY52L2ouOnBmBJHgZLqtXOR/qC52M+mc6Wcv8tB8zsdjq+xnY7GcCq1Q+XDHMqxttxmUPAy7R9XhYzF+sbm7Zizx3SlHxx8h8WJoPLR9vpZ6sBvKAE4fixWr20gcakwZw3H+Y2NwEb7VEWstEx70L2ZjVfndu7eXmNrV/y8m0gJ315sj63Z2HPfaeZL7YymHLzan//cr7wUxrHoGNZMm5UghrpI1XnVLpIRQPZ1smDfLvPcTYQBnJkJX4JtzeDlJ8FDAF8s87Kt77WKDK9oKD9ilIZfCzwEqwfl51nIGF0nf0uIxiMgwLGUKmUS3Sm5YMBlT1HWbiAyFYYee1AXANGKZ0LM0vS5+rNYXXHjZGIbNTmg9n7G+KGJcg+7DJ8rT0SkB3zVWYq6//emHkHFF1mgJ6UmWQRb4qTKebuv+cCYAtOOTCGJZwMHSbr07TBrn31Em4259ap7lRHR+pYPquk2BL0MV7AmM4mfwRjHFe4mXaY1um3BcZ0moGkH8Vy/hhtyCMbpU5c2PM33PaaQJtbn44OgRx9cnxIzoFb7L5QKN0Rm6ySPrC0mcWy2XQ+/+fL9cSrJWJNrr8c3VQZeM5W6nDU2KkwyTzBAI7uXzSbnaPryRJbJmc3DskmIFMMj0XWb6eeROcM5/ZwslSrccCWlmpL1tlnHE5EprT7CVkYpLqelsqUsGeG6uv2esKniuEmR5hRO6nzRH79DLNGWY9rwL1oGmofNWbz5jpFWxjc5AhVGj+dhWj3ZA24O81C1jyy5LigFBOTOqIZGeO0gJOV70VTneZmUgGc6wxcQCafI7TqpqCZIHMgZBWRylAy54wDZsX/kF/chGjOusDRwnSbkAkCE6tNzS9sLGvJ/xP8T30Zaa26EJD54YmSCQITI+vUCCCfCIOxKM3VJuHZ/jyWQGkHIRlMHqpIZf6cQXjt5mENY+AL+mUtVJrEpGQb8PgjFEjGm45CyJLBSZz0LYqLVBZi2VBpG1fi6VIPqQF7EmQOQWahPImbLRHGjcluA519EJPtJWT3woMBWZ7SGaI42s0otpsgOD9KTDHfR2R3Qv/3yeKkcY2hpHiaZaFHyJMZBxGZ3pbQWTfqajSP0iOAVF9kzZswozFGm6Qc34X3A0QlMyBL8llEFntTohwr3oHqy/93Eqlcgsy4D+8HpHayY7KPSaatMeyJqMqyAjL0i9pRmGo7MmTDINNW3orBsOp0y3cthl1D5Nu8PJnytgLJhJWJJEM9zcL+Iz4m9q6dRYVTJjZBhYJkS1I3etFeUJONFTgXO1hD/5fKZ8CcS5CMN4mNiz1PyP6a0ABYQbDQGPC/uY5OrUrUAH+uD5Jx52QxQVItJEPVxE5viApj/5e9mXfs3w8YS4GhY6fm5xjCIoEsRvZP6rlMLyiQcVlRLcn1BPZVOEfVvJ0w9UT3fWKJyUDPUaoxwyood6dyYL45odKaHcrFGGQWVpuS0JS4ZQzJhqAGnEuSRdF5O4kTrYVzMQFDCbrbzrpMNvPJ9grKWHbVink687Nl82uNtiUelyyxApV9kTOmn2uVcVvu0LamaTDC8JaJ8sjgDavTITjXOfS8HTmltUeKcDgXiDn0NK34V775Ccv/FktbFoMMVvQbcA1PLkl1R4oldaByDi6qebf5ZjE0JuJL7MGchR8GekHNIriGNpRTmqUIZoBCMff8iwJzOkTGoMaY8TZxyPRT0/F/nSa5eE1TNCmy7hCSfWneWJzml+jBHf7tUfMGXkOTIjOGinBwHkhAdu3ccNplDUpw9sPmkSavM+Nc2ZMjO4dXnd0eLdHCnC+gdh42z+A1hnIhd66cSB2nHEMf8W4Pw1YtPNMmaSNx/OQv3DwMAkATjyChtMEfKTEO4GUPv+KTLbRqkNEBoTMHkklmDcAlF8P+kjYYAkkFsDB34gIlfgYDwJP0a1mN+XIK0VjzxaxOZJzk4i+PZhlyRibpHsBki3oWqTZOSQi6bIGjCtckPkeOPS8gI9ulFZjER7If/i6pYVp2afu1E2nZWkKjk+lfiFYBl/b81bgiNGBQdkJFO2nEyCAm8w4kM1Qosh0mKObJAaYowobM6hSe4Gl7mZpqK5LpJZYTCyfj+xm+eyd9VeILkCka6UtcGPQHSEyE4XKsCBYy0vI2MlGcNyzCtmjSjT5mDkrpip7IsYcpjNZeQpfEp9eWrTWhgL5GZjUrQ9JsqKYYhRRI7duDkQ3NOJXs06JyjM/sMVGSL+C/tZXBo+jmCUGmKeIJd1zM7sPPRDdJ7wcjIqu7NcgNXgnvUWDiKdOMYMbj4Hu6lhj6/N7K5Vo/smitO5Ueb4Zg3R+DXO4naS0GHbr/Z86X1g/pLhccb2YiM+1HAOau1VAy3PUZXaLamgvRBr/kyU76iio9rwEEggG0KZ5HLQwL7YvDHZMADKC9l3U147yg3En2yyHY+1ZgF66nMeV7KyRr/ZZ1NeO0oOiy82f+4uNB2EQOv48S243YGXz+FoEBpf0tqTTDqiiFviyZ2X2M21iJzEZQYJ9D1JWELJeTnHI0Rv48bVuSzP6VNOGekRPvmN+hqvzmImCtB8mpIDiDLPl4FUgY6I9HhyrUHWFErnO4SCnN2Kn4ZJL1yX4/QH/8O4oK5UsMveZiYINfUrPuHtRZ+hKqhOwRVVnO/Y6MBNjq8wdNszVCZ69kSnt3FNzdkeqem7tEE0F84uaj/GxWJMlaolUuvuz04RN/utTstvlEkrnYqJjokIU7izSZTAyc6npFUdWS3I2nhxbRxuDMIp0/4QpAiwyyR7HzGNO74J5wqS1D9kiSuWczLHFRJdMrssh+i6OzHd9HlxkLdFlkRWosjia3Ioss10pb6hjI+V1IVppK3OFvv6KtqRWLrE5PIJMim2wwF5EZ02S9hnhUby5IMJ9sVix6CAxq1Fnx2WQ7avLE34GEzigy90zz0WZUqvA3IrDiO0rVQrID5Im/vjBezAVlzdaapml+46jaCC4W2ZOArNtH11IJY4ComlDeaSFarLcgUIuoDMizBoIIAJ1GlGwk0hkjNnMrcLo7AJjNJp7ledZkNsPAvrjESeKsMcLX7Ilvpv9Nk8H5Ta2YJms9kuxHuucY5xV8neNEaM5fFFnuWhOi/SbPaYmGKUvECsySKHHQdTMIAcSiDDkjjSlMtDvx2tBopa8o29rGKwotNxOgzdaogBaMBIxpBJSsjk71NNPefaTB3DNNS2WbUacMnlJXuxtvK/S67ZQOpKk8PQ5oN0OUxmTTNEplAO0xja07Yq11582kmfbiscXkyrW+aojMkIwBPmvahHlO7pfBs6ixx1yFz1m5ZC8e2PqCUtT4Mlvh/J7enDPD0e6zn6lgTljZT7/5XGCgwgfzGLaMTntgW9TjPO3BSLem8pBLAUMyBy1nKScOHhmzacD9UTL0dRvkEiHTfnqk6h4pX58BBtByTxRad6wjbwPBnhEjVvyaynuO52Na+/IMsBwcqhAW1dKeXkP7HKZBl0pmE98YYF/Fpw4esJkh47yURtZHNSa2ZIh2RnLRuT9HVnb/vAcsRMdqGllhGh1rmg9ssB5VCnPu2gwDu16hjlmlz/K1lqCZU/YTf8ne6P5ANItHyyrj179D0Lw1Opx7jJP88+JJSOOAen6TfBq3EMyOmk9cR3GX6d/fGkQWnZ0xoqa3zL5UKxclj/MC/jQu8cQfzCXjYJqD7sKmK6D1DpaDM6rfD8EYXgYlmoQ8GUs8Ww0fY8CnpEhZZXlNq7U2u/7tMsBWuWDRfHebYOA9jz5tK920kpTLLcdoLsLoriAOluxfXWY7WfB7/M53eypJVhqZXPcPm12O1ND4s8I84OLPRfgpTWM5OBNv3DMYOO898FK8DEovRGuUy39Y+aBX1uvBBwGYf2fFu5MnK2yng8EW/SYbJfU1i+yVrtZ9Za4uC8DACGzKeVcE+7UblddMIyECrLS82muoaWS9VBcLZZvz6g/e21L0bRGar4/lCy5ZvS6jsNzKtp71PS4AjdUkKkAlF8CarNZfVdR6b5lZklBxIVjWd9+UVCGaC8j0P//QldRdLqh1V3Q6AFOhV2UkUyvlhujSfgT8+cd3uATD7YHA/acQREA6WEMP3D0rWbnAzggYmQrJfFkNBW78V4LM/VMJYaTJkDdmiZytUSq97vV6IU+I2Ou5r8oiMuBizPdSlcg3AKJv+Col/Y+yepEaXnHWcCEesGrgdFE+44NdqOWoIc5bxtiZNvkN6THKz7T1NDLXfV2OzFJ4/jvj6g2+2viZtpRC1ruo6+oLkKV5W0MtZdaZu/I6gvn37yYsNXJsNlHdZHCBc170fY7qBUdnGf0MeD6WmFLIRG/nDL6plCvbF4xRU3pFp7B6F9uFiuzbOdMyLbIBflBlm7apn89kyVy3sV35f70Ftt5YwauhvM7clUadcpjnvwGQJCuU668xtkapLkPmgnhUGa78gmQlVa/UGxexVWWyhpu7aNQrpZd4c27624ZV4J/11xfBRAWfLMy0vdzFn21whpr5bcP/A6BU+aZU+jfHAAAAAElFTkSuQmCC',
          }}
        />
        <Text style={styles.userName}>{userData?.owner_name || 'User Name'}</Text>
        <Text style={styles.userEmail}>
          {userData?.email && userData.email.length > 28
            ? `${userData.email.substring(0, 28)}...`
            : userData?.email || 'No email available'}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Menu Items */}
      <View style={styles.menuCard}>
        {UserHeading.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.function}
          >
            <Icon name={item.iconName} size={28} color="#333" />
            <Text style={styles.menuText}>{item.title}</Text>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Call Support */}
      <View style={styles.supportCard}>
        <Text style={styles.supportTitle}>Need Help?</Text>
        {call.map((item) => (
          <View key={item.id} style={styles.callRow}>
            <View>
              <Text style={styles.callTitle}>{item.title}</Text>
              <Text style={styles.phoneNumber}>{item.number}</Text>
            </View>
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${item.number.replace(/[^0-9]/g, '')}`)}
              style={styles.callButton}
            >
              <Icon name={item.iconName} size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
        <Icon name="log-out" size={24} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  topContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  userName: {
    fontSize: 26,
    marginTop: 16,
    color: '#000',
    fontFamily: poppins.bold,
  },
  userEmail: {
    fontSize: 16,
    marginTop: 6,
    color: '#666',
    fontFamily: poppins.regular,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 40,
    marginVertical: 20,
  },
  menuCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  menuText: {
    flex: 1,
    marginLeft: 20,
    fontSize: 18,
    color: '#333',
    fontFamily: poppins.medium,
  },
  supportCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  supportTitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
    fontFamily: poppins.semiBold,
  },
  callRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  callTitle: {
    fontSize: 17,
    color: '#333',
    fontFamily: poppins.medium,
  },
  phoneNumber: {
    fontSize: 18,
    color: '#D45500',
    marginTop: 4,
    fontFamily: poppins.semiBold,
  },
  callButton: {
    backgroundColor: '#D45500',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D45500',
    marginHorizontal: 60,
    marginTop: 40,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 4,
  },
  logoutText: {
    color: '#fff',
    fontSize: 20,
    marginRight: 12,
    fontFamily: poppins.semiBold,
  },
});

export default Profile;