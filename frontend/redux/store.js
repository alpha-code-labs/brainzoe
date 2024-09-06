import { configureStore } from "@reduxjs/toolkit";
import Coinreducer from "./features/coinSlice";

export const store = configureStore({
    reducer: Coinreducer,
    
})