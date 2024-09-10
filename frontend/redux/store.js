import { configureStore } from "@reduxjs/toolkit";
import Coinreducer from "./features/coinSlice";
import  Auth from './features/userSlice'
export const store = configureStore({
    reducer: Coinreducer,
    googleauth: Auth,
    
})