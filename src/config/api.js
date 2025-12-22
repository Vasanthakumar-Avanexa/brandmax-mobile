import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {baseUrl} from './base_url';

export const api = {
  header: async (isJson = false) => {
    let header = {
      'Content-Type': isJson ? 'application/json' : 'multipart/form-data',
    };
    
    try {
      const token = await AsyncStorage.getItem('token');
      console.log("Token---->", token);
      
      
      if (token) {
        header['Authorization'] = `Bearer ${token}`;
        console.log('Token added to header');
      } else {
        console.warn('No token found in storage');
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    
    return header;
  },

  getMethod: async (url) => {
  const headers = await api.header();
  const fullUrl = baseUrl + url;
  console.log('GET Request →', fullUrl);  // ← ADD THIS LINE

  return axios.get(fullUrl, { headers })
    .then(res => res.data)
    .catch(err => {
      console.log('Request failed:', fullUrl);  // ← AND THIS
      throw err;
    });
},

  postMethod: async (url, data, isForm = true) => {
    let headers = await api.header(!isForm); 
    let payload = data;

    if (isForm) {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (Array.isArray(data[key])) {
          data[key].forEach((item, index) => {
            Object.keys(item).forEach(itemKey => {
              formData.append(`${key}[${index}][${itemKey}]`, item[itemKey]);
            });
          });
        } else {
          formData.append(key, data[key]);
        }
      });
      payload = formData;
    } else {
      payload = data; 
    }

    console.log('Sending payload →', payload);
    console.log('Headers →', headers);
    
    return axios.post(baseUrl + url, payload, { headers })
      .then(res => res.data)
      .catch(err => {
        console.error('POST Error:', err.response?.data || err.message);
        throw err;
      });
  },

  putMethod: async (url, data) => {
    const headers = await api.header(true);
    return new Promise((resolve, reject) => {
      axios
        .put(baseUrl + url, data, {
          headers: headers,
        })
        .then(res => {
          if (res.status == 200) {
            resolve(res.data);
          }
        })
        .catch(err => reject(err));
    });
  },

  deleteMethod: async (url) => {
    const headers = await api.header();
    return new Promise((resolve, reject) => {
      axios
        .delete(baseUrl + url, {
          headers: headers,
        })
        .then(res => {
          if (res.status == 200) {
            resolve(res.data);
          }
        })
        .catch(err => reject(err));
    });
  },
};