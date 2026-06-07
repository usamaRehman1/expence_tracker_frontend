import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransactions } from "../features/transectionThunk";
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    Search,
    Inbox,
    LayoutDashboard
} from "lucide-react";
import TransactionForm from "../components/transectionForm";
import TransactionCard from "../components/transectionCard";

function TransactionPage() {
    const dispatch = useDispatch();
    const { transactions, loading, error } = useSelector(
        (state) => state.transactions
    );

    const [editData, setEditData] = useState(null)
    // Interactive UI Filter & Search States
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all"); // options: "all", "income", "expense"

    useEffect(() => {
        dispatch(getTransactions());
    }, [dispatch]);

    // 1. Calculate financial summaries cleanly using useMemo
    const financialSummary = useMemo(() => {
        return transactions?.data?.reduce(
            (totals, item) => {
                const value = Number(item.amount) || 0;
                if (item.type === "income") {
                    totals.income += value;
                } else if (item.type === "expense") {
                    totals.expense += value;
                }
                totals.balance = totals.income - totals.expense;
                return totals;
            },
            { income: 0, expense: 0, balance: 0 }
        );
    }, [transactions?.data]);

    // 2. Filter data in real-time based on your user search settings
    const filteredTransactions = useMemo(() => {
        return transactions?.data?.filter((item) => {
            const matchesSearch =
                item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.location?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesFilter = activeFilter === "all" || item.type === activeFilter;
            return matchesSearch && matchesFilter;
        });
    }, [transactions, searchQuery, activeFilter]);

    // Format Helper for Currency Display
    const formatCurrency = (val) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(val);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 text-gray-900 selection:bg-indigo-500 selection:text-white antialiased">
            <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:py-12">

                {/* DASHBOARD HEADER */}
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-3.5">
                        <div className="p-3 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
                            <LayoutDashboard size={26} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                                Expense Tracker
                            </h1>
                            <p className="text-sm font-medium text-gray-500 mt-1">
                                Monitor your budget transactions and merchant tracking
                            </p>
                        </div>
                    </div>
                </header>

                {/* METRICS & STATS GRID COMPONENT */}
                <section className="grid sm:grid-cols-3 gap-5 mb-10">

                    {/* Income Summary Card */}
                    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Total Inflow</span>
                            <span className="text-2xl font-black text-slate-900 tracking-tight mt-1.5 block">
                                {
                                    !transactions.data
                                        ? 0.0
                                        : formatCurrency(financialSummary.income)
                                }
                            </span>
                        </div>
                        <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-600">
                            <TrendingUp size={24} />
                        </div>
                    </div>

                    {/* Expense Summary Card */}
                    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Total Outflow</span>
                            <span className="text-2xl font-black text-slate-900 tracking-tight mt-1.5 block">
                                {
                                    !transactions.data
                                        ? 0.0
                                        : formatCurrency(financialSummary.expense)
                                }
                            </span>
                        </div>
                        <div className="p-3.5 bg-rose-50 rounded-xl text-rose-600">
                            <TrendingDown size={24} />
                        </div>
                    </div>

                    {/* Net Balance Card */}
                    <div className={`p-6 rounded-2xl shadow-sm border transition-all flex items-center justify-between ${financialSummary?.balance >= 0
                        ? "bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-transparent"
                        : "bg-white border-rose-100 text-slate-900"
                        }`}>
                        <div>
                            <span className={`text-xs font-bold uppercase tracking-wider block ${financialSummary?.balance >= 0 ? "text-indigo-200/80" : "text-rose-400"
                                }`}>Net Balance</span>
                            <span className="text-2xl font-black tracking-tight mt-1.5 block">
                                {
                                    !transactions.data
                                        ? 0.0
                                        : formatCurrency(financialSummary.balance)
                                }
                            </span>
                        </div>
                        <div className={`p-3.5 rounded-xl ${financialSummary?.balance >= 0 ? "bg-white/10 text-white" : "bg-rose-50 text-rose-600"
                            }`}>
                            <Wallet size={24} />
                        </div>
                    </div>


                </section>

                {/* INPUT TRANSACTION FORM ENGINE */}
                <section className="mb-10">
                    <TransactionForm editData={editData} setEditData={setEditData} />
                </section>

                {/* DATA FEED & ADVANCED LEDGER TOOLBAR */}
                {
                    !filteredTransactions
                        ? <h4>Loading</h4>
                        : <section className="bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-sm">

                            {/* Subheader and Controls Row */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 pb-5 mb-6">
                                <div>
                                    <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                                        Ledger Audit History
                                    </h2>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Showing {filteredTransactions.length} of {transactions.length} records found
                                    </p>
                                </div>

                                {/* Live Search & Segment Filters */}
                                <div className="flex flex-col sm:flex-row items-center gap-3">
                                    {/* Internal Search Engine field */}
                                    <div className="relative w-full sm:w-60 group">
                                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Search merchant or area..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-gray-50/50 border border-gray-200 text-xs font-medium pl-9 pr-3 py-2.5 rounded-xl outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                                        />
                                    </div>

                                    {/* Segment Toggle Filter System */}
                                    <div className="flex bg-gray-50 p-1 border border-gray-200/40 rounded-xl w-full sm:w-auto">
                                        {["all", "income", "expense"].map((mode) => (
                                            <button
                                                key={mode}
                                                onClick={() => setActiveFilter(mode)}
                                                className={`px-3 py-1.5 text-xs font-bold capitalize rounded-lg transition-all ${activeFilter === mode
                                                    ? "bg-white text-indigo-600 shadow-sm"
                                                    : "text-gray-400 hover:text-gray-700"
                                                    }`}
                                            >
                                                {mode}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* LEDGER FEED BLOCK */}
                            <div className="grid gap-3.5">
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((item) => (
                                        <TransactionCard
                                            key={item.id || item._id}
                                            item={item}
                                            setEditData={setEditData}
                                        />
                                    ))
                                ) : (
                                    /* EMPTY FEED FALLBACK */
                                    <div className="flex flex-col items-center justify-center text-center py-12 px-4 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
                                        <div className="p-4 bg-gray-100 rounded-full text-gray-400 mb-3">
                                            <Inbox size={28} />
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-700">No Transactions Found</h3>
                                        <p className="text-xs text-gray-400 max-w-[260px] mt-1">
                                            We couldn't locate any records matching your filter parameters. Try checking your spelling or log a new action.
                                        </p>
                                    </div>
                                )}
                            </div>

                        </section>
                }
            </div>
        </div>
    );
}

export default TransactionPage;