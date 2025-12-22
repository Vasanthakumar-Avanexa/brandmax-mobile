import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  page: 1,
  hasMore: true,
  filterLoadings: false,
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
    }
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const { setProductsList, incrementPage, setHasMore, resetProducts } = productSlice.actions;
export default productSlice.reducer;