import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileJson, ArrowRight, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { InfoBox } from "./InfoBox";

export function VersioningDemo() {
    const [step, setStep] = useState<"v1" | "upcasting" | "v2">("v1");

    const eventV1 = {
        type: "UserRegistered",
        version: 1,
        data: {
            userId: "u-123",
            name: "John Doe"
            // Missing: email
        }
    };

    const eventV2 = {
        type: "UserRegistered",
        version: 2,
        data: {
            userId: "u-123",
            name: "John Doe",
            email: "unknown@example.com", // Default added
            metadata: { source: "legacy" } // Structure changed
        }
    };

    const handleUpcast = () => {
        setStep("upcasting");
        setTimeout(() => setStep("v2"), 1500);
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-slate-300 leading-relaxed">
                    Over time, your application evolves and event schemas change. But events are immutable—you can't modify old events in the store.
                    <strong className="text-white">Upcasting</strong> solves this by transforming old event versions into new formats when they're read,
                    so your application always works with the latest schema without altering historical data.
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* V1 Event */}
                <div className={cn(
                    "bg-slate-800/50 rounded-xl p-6 border transition-all duration-500",
                    step === "v1" ? "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]" : "border-slate-700 opacity-50"
                )}>
                    <div className="flex items-center gap-3 mb-4">
                        <FileJson className="text-blue-400 w-6 h-6" />
                        <h3 className="text-lg font-bold text-blue-100">Legacy Event (v1)</h3>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg font-mono text-xs text-slate-300 overflow-hidden">
                        <pre>{JSON.stringify(eventV1, null, 2)}</pre>
                    </div>
                    <div className="mt-4 text-xs text-slate-400">
                        <AlertCircle className="w-3 h-3 inline mr-1 text-yellow-500" />
                        Missing 'email' field required by new system.
                    </div>
                </div>

                {/* Upcaster Logic */}
                <div className="flex flex-col items-center gap-4">
                    <motion.div
                        animate={step === "upcasting" ? { scale: 1.1, rotate: 360 } : { scale: 1, rotate: 0 }}
                        transition={{ duration: 1 }}
                        className={cn(
                            "p-4 rounded-full border-2 transition-colors",
                            step === "upcasting" ? "bg-purple-600 border-purple-400 text-white" : "bg-slate-800 border-slate-600 text-slate-400"
                        )}
                    >
                        <RefreshCw className="w-8 h-8" />
                    </motion.div>

                    <div className="text-center">
                        <h4 className="font-bold text-purple-300 mb-2">Upcaster Function</h4>
                        <div className="bg-slate-900 p-3 rounded border border-purple-500/30 text-left text-[10px] font-mono text-purple-200 w-64">
                            <span className="text-purple-400">function</span> upcast(event) {"{"}
                            <br />  <span className="text-blue-400">if</span> (event.v === 1) {"{"}
                            <br />    event.data.email = <span className="text-green-400">"unknown"</span>;
                            <br />    event.v = 2;
                            <br />  {"}"}
                            <br />  <span className="text-purple-400">return</span> event;
                            <br />{"}"}
                        </div>
                    </div>

                    {step === "v1" ? (
                        <button
                            onClick={handleUpcast}
                            className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-full font-bold text-sm transition-colors flex items-center gap-2"
                        >
                            Run Upcaster <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={() => setStep("v1")}
                            disabled={step === "upcasting"}
                            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-full font-bold text-sm transition-colors"
                        >
                            Reset Demo
                        </button>
                    )}
                </div>

                {/* V2 Event */}
                <div className={cn(
                    "bg-slate-800/50 rounded-xl p-6 border transition-all duration-500",
                    step === "v2" ? "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]" : "border-slate-700 opacity-50"
                )}>
                    <div className="flex items-center gap-3 mb-4">
                        <FileJson className="text-green-400 w-6 h-6" />
                        <h3 className="text-lg font-bold text-green-100">Upcasted Event (v2)</h3>
                    </div>
                    <div className="bg-slate-900 p-4 rounded-lg font-mono text-xs text-slate-300 overflow-hidden relative">
                        <AnimatePresence>
                            {step === "v2" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 bg-green-500/10 pointer-events-none"
                                />
                            )}
                        </AnimatePresence>
                        <pre>{JSON.stringify(eventV2, null, 2)}</pre>
                    </div>
                    <div className="mt-4 text-xs text-slate-400">
                        <CheckCircle className="w-3 h-3 inline mr-1 text-green-500" />
                        Compatible with new system. Database remains immutable.
                    </div>
                </div>
            </div>

            <InfoBox title="Why Event Versioning?">
                <p className="mb-2">
                    As your business evolves, so do your events. Without versioning, you'd be stuck with outdated schemas or forced to migrate billions of events.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Zero Downtime:</strong> Transform events on-the-fly during reads—no batch migrations needed.</li>
                    <li><strong>Backward Compatibility:</strong> Old events still work, even as you add new fields or change structures.</li>
                    <li><strong>Audit Integrity:</strong> The raw historical events remain untouched, preserving the original record.</li>
                </ul>
            </InfoBox>
        </div>
    );
}
