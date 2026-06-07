import { configureStore } from "@reduxjs/toolkit";
import transectionReducer from "../features/transactionSlice.js"

export const store = configureStore({
    reducer: {
        transactions: transectionReducer
    }
})