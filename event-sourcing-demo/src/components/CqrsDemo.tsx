import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Search, Edit3, RefreshCw, Database } from "lucide-react";
import { cn } from "../lib/utils";
import { InfoBox } from "./InfoBox";

export function CqrsDemo() {
    const [writeState, setWriteState] = useState(0);
    const [readState, setReadState] = useState(0);
    const [isSyncing, setIsSyncing] = useState(false);

    const handleWrite = () => {
        setWriteState(prev => prev + 1);
        setIsSyncing(true);
    };

    useEffect(() => {
        if (isSyncing) {
            const timer = setTimeout(() => {
                setReadState(writeState);
                setIsSyncing(false);
            }, 1500); // 1.5s delay to show eventual consistency
            return () => clearTimeout(timer);
        }
    }, [isSyncing, writeState]);

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6">
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-slate-300 leading-relaxed">
                    <strong className="text-white">Command Query Responsibility Segregation (CQRS)</strong> is a pattern that separates read and write operations into different models.
                    Instead of using one database and one model for both reading and writing, CQRS uses separate optimized paths for each.
                </p>
            </div>
            <div className="flex flex-col lg:flex-row items-stretch justify-between gap-12 relative min-h-[400px]">
                {/* Connection Line (Desktop) */}
                <div className="hidden lg:flex absolute top-1/2 left-0 w-full items-center justify-center -z-0 pointer-events-none">
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
                </div>

                {/* Write Side */}
                <div className="flex-1 bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-indigo-500/30 relative z-10 shadow-2xl shadow-indigo-900/20 flex flex-col">
                    <div className="flex items-center gap-4 mb-8 border-b border-indigo-500/20 pb-6">
                        <div className="p-3 bg-indigo-500/20 rounded-xl">
                            <Edit3 className="text-indigo-400 w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-indigo-100">Command Side</h3>
                            <p className="text-sm text-indigo-300/70">Optimized for Writes & Business Logic</p>
                        </div>
                    </div>

                    <div className="space-y-8 flex-1 flex flex-col">
                        <div className="bg-slate-950/50 p-6 rounded-xl border border-indigo-500/20 flex-1">
                            <div className="text-xs font-bold text-indigo-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                                <FileText className="w-3 h-3" /> Event Store (Append Only)
                            </div>
                            <div className="space-y-3">
                                <AnimatePresence mode="popLayout">
                                    {Array.from({ length: Math.min(writeState, 4) }).map((_, i) => (
                                        <motion.div
                                            key={writeState - i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-3 text-sm text-slate-300 font-mono bg-slate-900 p-2 rounded border border-slate-800"
                                        >
                                            <span className="text-green-400">#{writeState - i}</span>
                                            <span>OrderUpdated</span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {writeState === 0 && <div className="text-sm text-slate-600 italic p-2">No events yet...</div>}
                            </div>
                        </div>

                        <button
                            onClick={handleWrite}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold text-white transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            <Edit3 className="w-5 h-5" />
                            Execute Command
                        </button>
                    </div>
                </div>

                {/* Sync Indicator */}
                <div className="self-center flex flex-col items-center gap-2 z-20 bg-slate-950 p-4 rounded-full border border-slate-800 shadow-xl">
                    <motion.div
                        animate={isSyncing ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 1, repeat: isSyncing ? Infinity : 0, ease: "linear" }}
                    >
                        <RefreshCw className={cn("w-8 h-8", isSyncing ? "text-yellow-400" : "text-slate-600")} />
                    </motion.div>
                    <span className={cn("text-[10px] font-bold uppercase tracking-widest", isSyncing ? "text-yellow-400" : "text-slate-600")}>
                        Sync
                    </span>
                </div>

                {/* Read Side */}
                <div className="flex-1 bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-teal-500/30 relative z-10 shadow-2xl shadow-teal-900/20 flex flex-col">
                    <div className="flex items-center gap-4 mb-8 border-b border-teal-500/20 pb-6">
                        <div className="p-3 bg-teal-500/20 rounded-xl">
                            <Search className="text-teal-400 w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-teal-100">Query Side</h3>
                            <p className="text-sm text-teal-300/70">Optimized for Reads (Denormalized)</p>
                        </div>
                    </div>

                    <div className="space-y-8 flex-1 flex flex-col">
                        <div className="bg-slate-950/50 p-6 rounded-xl border border-teal-500/20 flex-1 flex flex-col justify-center items-center relative overflow-hidden">
                            <div className="absolute top-4 left-4 text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                                <Database className="w-3 h-3" /> Materialized View
                            </div>

                            <div className="text-center z-10">
                                <span className="text-slate-400 text-sm block mb-2">Total Records</span>
                                <motion.div
                                    key={readState}
                                    initial={{ scale: 1.5, filter: "blur(4px)" }}
                                    animate={{ scale: 1, filter: "blur(0px)" }}
                                    className="text-6xl font-black text-white tracking-tighter"
                                >
                                    {readState}
                                </motion.div>
                            </div>

                            {/* Background decoration */}
                            <div className="absolute inset-0 bg-teal-500/5 radial-gradient" />
                        </div>

                        <div className="p-4 bg-teal-900/20 border border-teal-500/20 rounded-xl text-sm text-teal-200/80 leading-relaxed">
                            <strong>Why separate?</strong> Complex queries (joins, aggregations) are pre-calculated here. The read DB can be a completely different technology (e.g., ElasticSearch, Neo4j) than the Event Store.
                        </div>
                    </div>
                </div>
            </div>

            <InfoBox title="Why CQRS?">
                <p className="mb-2">
                    In traditional CRUD, we use the same model for reading and writing. This limits performance because we can't optimize for both.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Write Side (Command):</strong> Optimized for high-speed ingestion. It just appends events. No complex checks, no joins.</li>
                    <li><strong>Read Side (Query):</strong> Optimized for fast lookups. Data is pre-calculated (denormalized) into the exact shape the UI needs.</li>
                </ul>
            </InfoBox>
        </div>
    );
}
