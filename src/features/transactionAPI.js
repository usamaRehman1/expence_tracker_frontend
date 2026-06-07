import api from "../services/axios";

// GET Transactions
export const getTransactionsAPI = async () => {
    const response = await api.get("/transection");
    return response.data;
};

// POST Transaction
export const addTransactionAPI = async (data) => {
    const response = await api.post("/transection", data);
    return response.data;
};

// UPDATE Transaction
export const updateTransactionAPI = async (id, data) => {

    const response = await api.put(`/transection/${id}`, data);
    return response.data;
};

// DELETE Transaction
export const deleteTransactionAPI = async (id) => {
    const response = await api.delete(`/transection/${id}`);
    return response.data;
}; 