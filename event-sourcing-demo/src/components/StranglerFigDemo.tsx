import { useState } from "react";
import { motion } from "framer-motion";
import { Database, ArrowRight, Server, Shuffle, Layers } from "lucide-react";
import { cn } from "../lib/utils";
import { InfoBox } from "./InfoBox";

export function StranglerFigDemo() {
    const [phase, setPhase] = useState<"monolith" | "proxy" | "migrating" | "complete">("monolith");

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-slate-300 leading-relaxed">
                    Instead of a risky "big bang" rewrite, the <strong className="text-white">Strangler Fig pattern</strong> gradually replaces a legacy monolith.
                    You introduce a proxy that routes traffic between the old and new systems. Over time, more functionality moves to the new system
                    until the legacy code can be safely "strangled" and removed.
                </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Controls */}
                <div className="lg:col-span-3 flex justify-center gap-4 mb-8">
                    {(["monolith", "proxy", "migrating", "complete"] as const).map((p, i) => (
                        <button
                            key={p}
                            onClick={() => setPhase(p)}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2",
                                phase === p ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                            )}
                        >
                            <span className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center text-xs">{i + 1}</span>
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Legacy System */}
                <div className={cn(
                    "bg-slate-800/50 rounded-xl p-6 border transition-all duration-500 relative overflow-hidden",
                    phase === "complete" ? "opacity-30 grayscale border-slate-800" : "border-slate-600"
                )}>
                    <div className="flex items-center gap-3 mb-4">
                        <Server className="text-slate-400 w-8 h-8" />
                        <div>
                            <h3 className="text-lg font-bold text-slate-200">Legacy Monolith</h3>
                            <p className="text-xs text-slate-500">Traditional CRUD App</p>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-lg border border-slate-700 h-32 flex items-center justify-center relative">
                        <Database className="w-12 h-12 text-slate-600" />
                        {phase !== "complete" && (
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-slate-500/5"
                            />
                        )}
                    </div>

                    {/* Traffic Indicator */}
                    {(phase === "monolith" || phase === "proxy" || phase === "migrating") && (
                        <div className="absolute top-4 right-4 flex gap-1">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                                    className="w-1.5 h-1.5 rounded-full bg-green-500"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* The Strangler (Proxy/CDC) */}
                <div className="flex flex-col justify-center items-center gap-4 relative">
                    {phase !== "monolith" && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-4 bg-purple-900/20 border border-purple-500/50 rounded-xl w-full text-center relative"
                        >
                            <Shuffle className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                            <h4 className="font-bold text-purple-300 text-sm">Routing Proxy</h4>
                            <p className="text-[10px] text-purple-200/70 mt-1">Intercepts calls</p>

                            {/* Arrows */}
                            <div className="absolute top-1/2 -left-4 -translate-y-1/2">
                                <ArrowRight className={cn("w-4 h-4 text-purple-500", phase === "complete" ? "opacity-0" : "animate-pulse")} />
                            </div>
                            <div className="absolute top-1/2 -right-4 -translate-y-1/2">
                                <ArrowRight className={cn("w-4 h-4 text-purple-500", phase === "proxy" ? "opacity-0" : "animate-pulse")} />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* New System */}
                <div className={cn(
                    "bg-slate-800/50 rounded-xl p-6 border transition-all duration-500 relative",
                    phase === "monolith" ? "opacity-30 grayscale border-slate-800" : "border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                )}>
                    <div className="flex items-center gap-3 mb-4">
                        <Layers className="text-blue-400 w-8 h-8" />
                        <div>
                            <h3 className="text-lg font-bold text-blue-100">Event Sourced Microservice</h3>
                            <p className="text-xs text-blue-300/70">New Architecture</p>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-4 rounded-lg border border-blue-500/30 h-32 flex flex-col items-center justify-center relative overflow-hidden">
                        {phase !== "monolith" && (
                            <div className="w-full space-y-2">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ x: -100, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.5 }}
                                        className="h-6 bg-blue-500/20 rounded border border-blue-500/30 w-3/4 mx-auto"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Traffic Indicator */}
                    {(phase === "migrating" || phase === "complete") && (
                        <div className="absolute top-4 right-4 flex gap-1">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity }}
                                    className="w-1.5 h-1.5 rounded-full bg-blue-400"
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-3 text-center mt-4">
                    <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                        {phase === "monolith" && "All traffic goes to the Legacy Monolith. New system doesn't exist yet."}
                        {phase === "proxy" && "A Proxy is introduced to intercept requests. Traffic still flows to Monolith, but we're ready to switch."}
                        {phase === "migrating" && "Writes are dual-written or reads are gradually routed to the New System. The 'Strangler Fig' grows."}
                        {phase === "complete" && "Migration complete. The Legacy Monolith is decommissioned. All traffic handled by Event Sourcing."}
                    </p>
                </div>
            </div>

            <InfoBox title="Why Strangler Fig?">
                <p className="mb-2">
                    Rewriting a legacy system all at once is risky and expensive. The Strangler Fig pattern minimizes risk by allowing incremental migration.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Low Risk:</strong> Each piece is migrated independently. If something fails, you can roll back just that piece.</li>
                    <li><strong>Continuous Value:</strong> The system remains operational throughout the migration—no "big bang" downtime.</li>
                    <li><strong>Flexible:</strong> You can pause, adjust, or even abandon the migration without losing your investment.</li>
                </ul>
            </InfoBox>
        </div>
    );
}
