import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productReducer from './ProductSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
  },
});

export default store;
