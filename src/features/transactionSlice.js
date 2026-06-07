import { createSlice } from "@reduxjs/toolkit";
import {
    getTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
} from "./transectionThunk";
import { JapaneseYen } from "lucide-react";

const transactionSlice = createSlice({
    name: "transaction",
    initialState: {
        transactions: [],
        loading: false,
        error: null,
    },
    reducers: {
        isLoading: (state) => { state.loading = !state.loading }
    },
    extraReducers: (builder) => {
        builder

            // GET Transactions
            .addCase(getTransactions.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload;
            })
            .addCase(getTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // ADD Transaction
            .addCase(addTransaction.pending, (state) => {
                state.loading = true;
            })
            .addCase(addTransaction.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions.data.push(action.meta.arg);
            })
            .addCase(addTransaction.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // UPDATE Transaction
            .addCase(updateTransaction.fulfilled, (state, action) => {
                const index = state.transactions.data.findIndex(
                    (item) => item._id === action.meta?.arg?.data?.id
                );
                if (index !== -1) {
                    state.transactions.data[index] = action.meta?.arg?.data;
                }
            })

            // DELETE Transaction
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.transactions.data = state.transactions.data.filter(
                    (item) => item._id !== action.meta?.arg
                );
            });
    },
});
export const { isLoading } = transactionSlice.actions;
export default transactionSlice.reducer;