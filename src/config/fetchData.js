import {api} from './api';

const api_name = 'api/';

export default {
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
  },
};
