import {api} from './api';

const api_name = 'api/';

export default {

  // New APIs
createUser:async (data) => {
  let url = 'users';
  return api.postMethod(url, data,false);
},
  Logins: (data, isForm = false) => {
  let url = 'auth/login';
  return api.postMethod(url, data, isForm);
},
  OTPVerify: (data, isForm = false) => {
  let url = 'auth/verify';
  return api.postMethod(url, data, isForm);
},
    Register: data => {
    let url = 'user/register';
    return api.postMethod(url, data);
  },

  getProducts: data => {
    let url = 'products?page='+data.page+'&limit='+data.limit+'&search='+data.search;
    return api.getMethod(url,data);
  },
  getProductById: (id) => {
    let url = `products/${id}`;
    return api.getMethod(url); 
},
  getCart: (page, limit) => {
    console.log('Fetching cart with page:', page, 'and limit:', limit);
    
    let url = `cart?page=${page}&limit=${limit}`;
    return api.getMethod(url);
  },
  getOrders: (page, limit) => {
  console.log('Fetching orders with page:', page, 'and limit:', limit);
  let url = `orders?page=${page}&limit=${limit}`;
  return api.getMethod(url);
},
addToCart: (payload) => {
  const url = 'cart';                     
  return api.postMethod(url, payload, false);
},
updateCartItem: async (cartItemId, payload) => {
    const url = `cart/${cartItemId}`;
    return api.putMethod(url, payload);
  },
deleteCartItem: async (cartItemId, productId, sizeId) => {
    const url = `cart/${cartItemId}?product_id=${productId}&size_id=${sizeId}`;
    return api.deleteMethod(url);
  },
 placeOrder: async (orderData) => {
  const url = 'orders';

  try {
    const response = await api.postMethod(url, orderData, false);
    if (response.success) {
      return { success: true, data: response.data };
    } else {
      throw new Error(response.message || 'Order failed');
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to place order'
    };
  }
},
getAddresses: () => {
  let url = 'addresses';
  return api.getMethod(url);
},

addAddress: (data) => {
  let url = 'addresses';
  return api.postMethod(url, data, false);
},

updateAddress: (addressId, data) => {
  let url = `addresses/${addressId}`;
  return api.putMethod(url, data);
},

deleteAddress: (addressId) => {
  let url = `addresses/${addressId}`;
  return api.deleteMethod(url);
},
getOrderDetails: (orderId) => {
    let url = `orders/${orderId}`;  
    return api.getMethod(url);
  },
  raiseIssue: (data) => {
    let url = 'complaint';
    return api.postMethod(url, data, false);
  },


  // Old APIs
  products: data => {
    let url = api_name + 'product/list_products';
    return api.postMethod(url, data);
  },
  category: data => {
    let url = api_name + 'product/list_category';
    return api.postMethod(url, data);
  },
  brands: data => {
    let url = api_name + 'product/list_brands';
    return api.postMethod(url, data);
  },
  models: data => {
    let url = api_name + 'product/list_models';
    return api.postMethod(url, data);
  },
  search: data => {
    let url = api_name + 'product/searchProduct?search=';
    return api.postMethod(url, data);
  },
  orderList: data => {
    let url = api_name + 'order/list_order';
    return api.postMethod(url, data);
  },
  orderStatus: data => {
    let url = api_name + 'order/list_order_status';
    return api.postMethod(url, data);
  },
  PlaceOrder: data => {
    let url = api_name + 'order/add_order';
    return api.postMethod(url, data);
  },
  currentMonth: data => {
    let url = api_name + 'order/this_month_target';
    return api.postMethod(url, data);
  },
  monthTargetList: data => {
    let url = api_name + 'order/list_month_target';
    return api.postMethod(url, data);
  },
  last_order: data => {
    let url = api_name + 'order/last_order';
    return api.postMethod(url, data);
  },
  faq: data => {
    let url = api_name + 'faq/list_faq';
    return api.postMethod(url, data);
  },
  faqCategory: data => {
    let url = api_name + 'faq/list_faq_category';
    return api.postMethod(url, data);
  },
  login: data => {
    let url = api_name + 'users/login';
    return api.postMethod(url, data);
  },
  verify_otp: data => {
    let url = api_name + 'users/validate_otp';
    return api.postMethod(url, data);
  },
  request_demo: data => {
    let url = api_name + 'users/request_demo';
    return api.postMethod(url, data);
  },
  contact_us: data => {
    let url = api_name + 'users/contact_us';
    return api.postMethod(url, data);
  }
};
