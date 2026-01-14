import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  page: 1,
  hasMore: true,
  filterLoadings: false,
  cartCount: 0,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductsList: (state, action) => {
      const newProducts = Array.isArray(action.payload) ? action.payload : [];
      state.products = [...state.products, ...newProducts];
    },
    setFilterLoadings: (state, action) => {
      state.filterLoadings = action.payload;
    },
    incrementPage(state) {
      state.page += 1;
    },
    setHasMore(state, action) {
      state.hasMore = action.payload;
    },
    resetProducts(state) {
      state.products = [];
      state.page = 1;
      state.hasMore = true;
    },
    setCartCount(state, action) {
      state.cartCount = action.payload;
    },
    incrementCartCount(state) {
      state.cartCount += 1;
    },
    decrementCartCount(state) {
      state.cartCount = Math.max(0, state.cartCount - 1);
    },
    resetCartCount(state) {
      state.cartCount = 0;
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const { 
  setProductsList, 
  incrementPage, 
  setHasMore, 
  resetProducts,
  setFilterLoadings,
  setCartCount,
  incrementCartCount,
  decrementCartCount,
  resetCartCount,
} = productSlice.actions;

export default productSlice.reducer;