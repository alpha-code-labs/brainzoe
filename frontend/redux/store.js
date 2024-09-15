import { configureStore } from "@reduxjs/toolkit";
import coinReducer from "./features/coinSlice";
import userAuthReducer from "../redux/features/userSlice"; // Ensure correct path and naming

export const store = configureStore({
  reducer: {
    coin: coinReducer,        // 'coin' is the key for your coin state slice
    userAuth: userAuthReducer, // 'userAuth' is the key for your user/auth state slice
  },
});
