import { Pencil, Trash2, Heart, MapPin, Calendar, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
// import { getTransactions } from "../features/transectionSlice.js";
import { useEffect, useState } from "react";
import { deleteTransaction, getTransactions } from "../features/transectionThunk";

export default function TransactionCard({ item, setEditData }) {
    const { transactions, loading } = useSelector(
        (state) => state.transactions
    );
    const dispatch = useDispatch();
    const [isFavorite, setIsFavorite] = useState(false);
    const isIncome = item.type === "income";

    return (
        <div className="group relative bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300 hover:shadow-xl hover:border-gray-200 hover:-translate-y-0.5">

            {/* LEFT SECTION: Icon Status Indicator, Title, & Location Metadata */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Visual Accent Circle Indicators */}
                <div className={`flex items-center justify-center p-3 rounded-xl shrink-0 transition-colors ${isIncome ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    }`}>
                    {isIncome ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-lg font-bold text-gray-900 tracking-tight truncate max-w-[180px] sm:max-w-xs group-hover:text-indigo-600 transition-colors">
                            {item.title}
                        </h2>

                        {/* Dynamic Clean Status Pill */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isIncome ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                            }`}>
                            {item.type}
                        </span>
                    </div>

                    {/* Integrated Subtext Metadata Block */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-400 font-medium">
                        <span className="flex items-center gap-1">
                            <MapPin size={13} className="text-gray-300" />
                            {item.location || "Online Checkout"}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={13} className="text-gray-300" />
                            {item.date}
                        </span>
                    </div>
                </div>
            </div>

            {/* RIGHT SECTION: Interactive Values, Liking State, and Hidden Tools */}
            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 pt-3 sm:pt-0 border-t border-gray-50 sm:border-t-0">

                {/* Financial Value Indicator aligned cleanly */}
                <div className="sm:text-right">
                    <span className={`text-xl font-extrabold tracking-tight ${isIncome ? "text-emerald-600" : "text-rose-600"
                        }`}>
                        {isIncome ? "+" : "-"}${Number(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                </div>

                {/* Quick Action Interactive Panel Container */}
                <div className="flex items-center gap-1.5">
                    {/* Thematic Heart Interaction Module */}
                    <button
                        onClick={() => setIsFavorite(!isFavorite)}
                        className="p-2 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-100 transition-all active:scale-90"
                        aria-label="Favorite Transaction"
                    >
                        <Heart
                            size={16}
                            className={`transition-all duration-300 ${isFavorite ? "fill-rose-500 text-rose-500 scale-110" : "text-gray-400 hover:text-rose-400"
                                }`}
                        />
                    </button>

                    {/* Utility Edit Option — Illuminates smoothly on row engagement */}
                    <button
                        onClick={() => setEditData(item)}
                        className="p-2 rounded-xl text-gray-400 hover:text-amber-600 hover:bg-amber-50 border border-transparent hover:border-amber-100 transition-all active:scale-95 sm:opacity-0 group-hover:opacity-100"
                        title="Edit Record"
                    >
                        <Pencil size={16} />
                    </button>

                    {/* Utility Delete Option */}
                    <button
                        onClick={() => dispatch(deleteTransaction(item._id))}
                        className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all active:scale-95 sm:opacity-0 group-hover:opacity-100"
                        title="Delete Record"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

            </div>
        </div>
    );
}