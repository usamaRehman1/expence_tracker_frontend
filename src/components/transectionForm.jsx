import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlusCircle, CheckCircle2, XCircle, Type, DollarSign, MapPin } from "lucide-react";
import { addTransaction, updateTransaction } from "../features/transectionThunk";
import { isLoading } from "../features/transactionSlice";

export default function TransactionForm({ editData, setEditData }) {
    const { transactions, loading } = useSelector(
        (state) => state.transactions
    );
    const dispatch = useDispatch();

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("expense");
    const [location, setLocation] = useState(""); // Theme extension

    useEffect(() => {
        if (editData) {
            setTitle(editData.title);
            setAmount(editData.amount);
            setType(editData.type);
            setLocation(editData.location || "");
        }
    }, [editData]);

    const handleSubmit = (e) => {
        console.log(editData, "==> editData")
        e.preventDefault();
        dispatch(isLoading())

        setTimeout(() => {
            const transaction = {
                id: editData ? editData._id : Date.now(),
                title,
                amount: parseFloat(amount),
                type,
                location: location.trim() || "Online Checkout", // Theme element saving
                date: new Date().toISOString().split("T")[0],
            };

            if (editData) {
                console.log("edit ====>")
                dispatch(updateTransaction({ id: transaction.id, data: transaction }));
                setEditData(null);
            } else {
                dispatch(addTransaction(transaction));
            }
            dispatch(isLoading())
        }, 2000)

        // Clean Reset
        setTitle("");
        setAmount("");
        setType("expense");
        setLocation("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`bg-white border p-6 rounded-2xl transition-all duration-300 mb-8 ${editData
                ? "border-amber-200 shadow-amber-100/50 shadow-xl ring-1 ring-amber-400/20"
                : "border-gray-100 shadow-lg shadow-gray-100/40"
                }`}
        >
            {/* Header Status Flag */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                        {editData ? "Modify Transaction Record" : "Log New Transaction"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {editData ? "Altering existing historical ledger inputs" : "Fill out details to sync ledger state"}
                    </p>
                </div>

                {editData && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditData(null);
                            setTitle("");
                            setAmount("");
                            setType("expense");
                            setLocation("");
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all"
                    >
                        <XCircle size={14} />
                        Cancel Edit
                    </button>
                )}
            </div>

            {/* Input Grid Area */}
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">

                {/* 1. Title Input Group */}
                <div className="relative">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                        Title / Merchant
                    </label>
                    <div className="relative group">
                        <Type size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Amazon, Starbucks..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-gray-50/50 border border-gray-200 pl-10 pr-3 py-3 rounded-xl outline-none text-gray-900 font-medium placeholder-gray-400 transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                            required
                        />
                    </div>
                </div>

                {/* 2. Amount Input Group */}
                <div className="relative">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                        Amount
                    </label>
                    <div className="relative group">
                        <DollarSign size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-gray-50/50 border border-gray-200 pl-10 pr-3 py-3 rounded-xl outline-none text-gray-900 font-bold placeholder-gray-400 transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                            required
                        />
                    </div>
                </div>

                {/* 3. Location Input Group (From Theme Requirements) */}
                <div className="relative">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                        Seller Location
                    </label>
                    <div className="relative group">
                        <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="San Francisco, CA"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-gray-50/50 border border-gray-200 pl-10 pr-3 py-3 rounded-xl outline-none text-gray-900 font-medium placeholder-gray-400 transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        />
                    </div>
                </div>

                {/* 4. Custom Interactive Segmented Toggle (Replaces clunky drop-down select) */}
                <div className="relative">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                        Flow Type
                    </label>
                    <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 rounded-xl h-[48px] items-center">
                        <button
                            type="button"
                            onClick={() => setType("expense")}
                            className={`py-2 text-xs font-bold rounded-lg transition-all ${type === "expense"
                                ? "bg-white text-rose-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => setType("income")}
                            className={`py-2 text-xs font-bold rounded-lg transition-all ${type === "income"
                                ? "bg-white text-emerald-600 shadow-sm"
                                : "text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            Income
                        </button>
                    </div>
                </div>

            </div>

            {/* Dynamic Action Submission Controller */}
            <div className="mt-5 flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-md transition-all active:scale-[0.98] ${loading
                        ? "bg-slate-400 cursor-not-allowed text-white shadow-none"
                        : editData
                            ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20 text-white"
                            : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20 text-white"
                        }`}
                >
                    {loading ? (
                        <>
                            {/* Simple Tailwind Loading Spinner */}
                            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Loading...
                        </>
                    ) : editData ? (
                        <>
                            <CheckCircle2 size={16} />
                            Save Modifications
                        </>
                    ) : (
                        <>
                            <PlusCircle size={16} />
                            Post Transaction
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}