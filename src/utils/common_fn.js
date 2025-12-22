import { Modal, ToastAndroid } from 'react-native';
import { Platform } from 'react-native';


export default function showToast(message){
    if (Platform.OS === 'android') {
        ToastAndroid.show(message,ToastAndroid.SHORT);
    } else {
        // For iOS, you can use a third-party library like 'react-native-simple-toast'
        // or implement a custom toast component.
        console.log('Toast message:', message);
    }
}
