import { useState } from "react";
import { motion } from "framer-motion";
import { Database, FileText, Users, ShoppingBag, Box, ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";

export function BoundedContextsDemo() {
    const [selectedContext, setSelectedContext] = useState<string | null>(null);

    const contexts = [
        {
            id: "orders",
            name: "Order Management",
            type: "CORE",
            pattern: "Event Sourcing",
            icon: ShoppingBag,
            color: "blue",
            description: "High complexity, audit requirements, temporal queries needed.",
            reason: "Events capture intent (Placed, Cancelled). Perfect for analyzing cart abandonment and order lifecycle."
        },
        {
            id: "inventory",
            name: "Inventory",
            type: "CORE",
            pattern: "Event Sourcing",
            icon: Box,
            color: "purple",
            description: "Concurrency control, stock history, reservation logic.",
            reason: "Need to know exactly when and why stock changed (Received, Reserved, Shipped, Returned)."
        },
        {
            id: "catalog",
            name: "Product Catalog",
            type: "SUPPORTING",
            pattern: "CRUD",
            icon: FileText,
            color: "slate",
            description: "Simple data structure, mostly reads, few updates.",
            reason: "Current state is all that matters. 'Product Description Changed' is rarely a business-critical event."
        },
        {
            id: "users",
            name: "User Profiles",
            type: "GENERIC",
            pattern: "CRUD",
            icon: Users,
            color: "slate",
            description: "Standard identity management.",
            reason: "Complexity is low. Over-engineering with ES would add cost without significant value."
        }
    ];

    return (
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
            {/* System Map */}
            <div className="relative bg-slate-900/50 rounded-xl p-8 border border-slate-800 aspect-square lg:aspect-auto lg:h-[500px] flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/30 to-transparent pointer-events-none" />

                <div className="grid grid-cols-2 gap-8 w-full max-w-md relative z-10">
                    {contexts.map((ctx) => (
                        <motion.button
                            key={ctx.id}
                            onClick={() => setSelectedContext(ctx.id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                                "p-6 rounded-xl border-2 flex flex-col items-center gap-3 transition-all",
                                selectedContext === ctx.id
                                    ? `bg-${ctx.color}-900/40 border-${ctx.color}-500 ring-2 ring-${ctx.color}-500/30`
                                    : `bg-slate-800 border-slate-700 hover:border-${ctx.color}-500/50`
                            )}
                        >
                            <div className={cn(
                                "p-3 rounded-full",
                                `bg-${ctx.color}-500/20 text-${ctx.color}-400`
                            )}>
                                <ctx.icon className="w-8 h-8" />
                            </div>
                            <div className="text-center">
                                <div className="font-bold text-slate-200">{ctx.name}</div>
                                <div className={cn(
                                    "text-[10px] font-mono mt-1 px-2 py-0.5 rounded-full inline-block",
                                    ctx.pattern === "Event Sourcing" ? "bg-blue-900 text-blue-300" : "bg-slate-700 text-slate-400"
                                )}>
                                    {ctx.pattern}
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </div>

                {/* Connecting Lines (Decorative) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" style={{ zIndex: 0 }}>
                    <line x1="50%" y1="50%" x2="25%" y2="25%" stroke="currentColor" className="text-slate-500" strokeDasharray="4" />
                    <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="currentColor" className="text-slate-500" strokeDasharray="4" />
                    <line x1="50%" y1="50%" x2="25%" y2="75%" stroke="currentColor" className="text-slate-500" strokeDasharray="4" />
                    <line x1="50%" y1="50%" x2="75%" y2="75%" stroke="currentColor" className="text-slate-500" strokeDasharray="4" />
                    <circle cx="50%" cy="50%" r="40" fill="currentColor" className="text-slate-800" />
                </svg>
            </div>

            {/* Details Panel */}
            <div className="flex flex-col justify-center h-full">
                {selectedContext ? (
                    <motion.div
                        key={selectedContext}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-800/50 rounded-xl p-8 border border-slate-700"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white">{contexts.find(c => c.id === selectedContext)?.name}</h3>
                            <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold border",
                                contexts.find(c => c.id === selectedContext)?.type === "CORE"
                                    ? "bg-blue-500/20 border-blue-500/50 text-blue-300"
                                    : "bg-slate-500/20 border-slate-500/50 text-slate-300"
                            )}>
                                {contexts.find(c => c.id === selectedContext)?.type} DOMAIN
                            </span>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Why {contexts.find(c => c.id === selectedContext)?.pattern}?</h4>
                                <p className="text-slate-200 leading-relaxed">
                                    {contexts.find(c => c.id === selectedContext)?.reason}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Characteristics</h4>
                                <p className="text-slate-300 text-sm">
                                    {contexts.find(c => c.id === selectedContext)?.description}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-slate-700">
                                <div className="flex items-center gap-2 text-sm text-slate-400">
                                    <ArrowRight className="w-4 h-4" />
                                    {contexts.find(c => c.id === selectedContext)?.pattern === "Event Sourcing"
                                        ? "Use for competitive advantage and complex logic."
                                        : "Use for simple data storage and standard features."}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                        <div className="w-16 h-16 rounded-full bg-slate-800 mb-4 flex items-center justify-center">
                            <Database className="w-8 h-8 opacity-50" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Pragmatic Architecture</h3>
                        <p className="max-w-sm">
                            Event Sourcing adds complexity. Don't use it everywhere.
                            Select a domain on the left to see when to use it (and when not to).
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
