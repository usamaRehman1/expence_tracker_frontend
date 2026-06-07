import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getTransactionsAPI,
    addTransactionAPI,
    updateTransactionAPI,
    deleteTransactionAPI,
} from "./transactionAPI.js";

export const getTransactions = createAsyncThunk(
    "transactions/getTransactions",
    async () => {
        return await getTransactionsAPI();
    }
);

export const addTransaction = createAsyncThunk(
    "transactions/addTransaction",
    async (data) => {
        return await addTransactionAPI(data);
    }
);

export const updateTransaction = createAsyncThunk(
    "transactions/updateTransaction",
    async ({ id, data }) => {
        console.log("api ==>", id, data)

        return await updateTransactionAPI(id, data);
    }
);

export const deleteTransaction = createAsyncThunk(
    "transactions/deleteTransaction",
    async (id) => {
        return await deleteTransactionAPI(id);
    }
);