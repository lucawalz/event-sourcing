import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Database, LayoutTemplate, History } from "lucide-react";
import { cn } from "../lib/utils";

const concepts = [
    {
        id: "events",
        title: "1. Events",
        icon: FileText,
        color: "text-blue-400",
        bg: "bg-blue-900/20",
        border: "border-blue-800",
        description: "Immutable facts about the past.",
        longDescription: "An Event is a record of something that has already happened. It's written in past tense (e.g., OrderPlaced, PaymentReceived) and can never be changed or deleted. This immutability gives us a perfect audit trail.",
        example: (
            <div className="font-mono text-xs bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                <div className="text-green-400">✅ OrderPlaced</div>
                <div className="text-green-400">✅ PaymentReceived</div>
                <div className="text-red-400">❌ UpdateOrder (not past tense!)</div>
            </div>
        ),
        keyTakeaway: "Store facts, not current state."
    },
    {
        id: "store",
        title: "2. Event Store",
        icon: Database,
        color: "text-purple-400",
        bg: "bg-purple-900/20",
        border: "border-purple-800",
        description: "The single source of truth.",
        longDescription: "The Event Store is a specialized append-only database. You can only add new events to it—never update or delete. This makes writes incredibly fast and creates an immutable audit log.",
        example: (
            <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-green-400">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Append Only (Fast Writes)</span>
                </div>
                <div className="flex items-center gap-2 text-purple-300">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>Immutable (Perfect Audit Trail)</span>
                </div>
                <div className="flex items-center gap-2 text-blue-300">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Ordered Sequence Guaranteed</span>
                </div>
            </div>
        ),
        keyTakeaway: "Like an accounting ledger—add lines, never erase."
    },
    {
        id: "projections",
        title: "3. Projections",
        icon: LayoutTemplate,
        color: "text-green-400",
        bg: "bg-green-900/20",
        border: "border-green-800",
        description: "Optimized views for reading.",
        longDescription: "Projections are the 'current state' derived by replaying events. You can have multiple projections from the same events—each optimized for different queries (e.g., User Profile view, Analytics view).",
        example: (
            <div className="font-mono text-xs bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col items-center gap-1">
                <div className="text-slate-300">[Event₁, Event₂, Event₃...]</div>
                <div className="text-slate-500">↓ Project ↓</div>
                <div className="bg-slate-800 px-3 py-1 rounded text-green-400 w-full text-center">
                    UserProfile JSON
                </div>
            </div>
        ),
        keyTakeaway: "One event log, multiple optimized views."
    },
    {
        id: "replay",
        title: "4. Event Replay",
        icon: History,
        color: "text-yellow-400",
        bg: "bg-yellow-900/20",
        border: "border-yellow-800",
        description: "Time travel for your data.",
        longDescription: "Since events are never deleted, you can replay them at any time. Found a bug in your projection logic? Fix it and replay the events. Need a new feature? Replay old events to populate the new data.",
        example: (
            <div className="space-y-2 text-xs">
                <div className="bg-slate-800 px-2 py-1 rounded border border-yellow-700">
                    <span className="text-yellow-400">🐛 Bug?</span> Fix code → Replay → Correct state
                </div>
                <div className="bg-slate-800 px-2 py-1 rounded border border-blue-700">
                    <span className="text-blue-400">✨ New Feature?</span> Replay to populate data
                </div>
            </div>
        ),
        keyTakeaway: "The past is your playground."
    }
];

export function CoreConcepts() {
    const [activeId, setActiveId] = useState<string | null>(null);

    return (
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-7xl mx-auto">
            {concepts.map((concept) => (
                <motion.div
                    key={concept.id}
                    layout
                    onClick={() => setActiveId(activeId === concept.id ? null : concept.id)}
                    className={cn(
                        "relative overflow-hidden rounded-xl border p-6 cursor-pointer transition-colors hover:bg-slate-800/80",
                        concept.bg,
                        concept.border,
                        activeId === concept.id ? "ring-2 ring-offset-2 ring-offset-slate-950 ring-slate-700" : ""
                    )}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <concept.icon className={cn("w-8 h-8", concept.color)} />
                            <h3 className={cn("text-xl font-bold", concept.color)}>{concept.title}</h3>
                        </div>
                    </div>

                    <p className="text-slate-300 mb-4">{concept.description}</p>

                    <AnimatePresence>
                        {activeId === concept.id && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-4 border-t border-slate-700/50 space-y-4">
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        {concept.longDescription}
                                    </p>

                                    <div>{concept.example}</div>

                                    <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                                        <div className="text-xs font-bold text-slate-500 mb-1">KEY TAKEAWAY</div>
                                        <div className={cn("text-sm font-semibold", concept.color)}>
                                            {concept.keyTakeaway}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="absolute bottom-4 right-4 opacity-20">
                        <concept.icon className="w-24 h-24" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
