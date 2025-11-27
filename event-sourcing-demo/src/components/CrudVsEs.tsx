import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, FileText, Trash2 } from "lucide-react";

export function CrudVsEs() {
    // CRUD State
    const [crudStatus, setCrudStatus] = useState("PLACED");

    // ES State
    const [events, setEvents] = useState<{ id: number; type: string; data: string; time: string }[]>([
        { id: 1, type: "OrderPlaced", data: "status: PLACED", time: "10:00" }
    ]);

    const esStatus = events.reduce((acc, event) => {
        if (event.type === "OrderPlaced") return "PLACED";
        if (event.type === "OrderShipped") return "SHIPPED";
        if (event.type === "OrderCancelled") return "CANCELLED";
        return acc;
    }, "PLACED");

    const addEvent = (type: string) => {
        const newEvent = {
            id: events.length + 1,
            type,
            data: `status: ${type.replace("Order", "").toUpperCase()}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setEvents([...events, newEvent]);
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 w-full">
            {/* CRUD Side */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                    <Database className="text-red-400 w-6 h-6" />
                    <h3 className="text-xl font-semibold text-red-100">Traditional CRUD</h3>
                </div>

                <div className="bg-slate-900 rounded-lg p-4 mb-4 font-mono text-sm">
                    <div className="text-slate-500 mb-2">-- orders table</div>
                    <div className="grid grid-cols-2 gap-4 border-b border-slate-700 pb-2 mb-2 text-slate-400">
                        <div>id</div>
                        <div>status</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-green-400">
                        <div>123</div>
                        <div key={crudStatus} className="animate-pulse">{crudStatus}</div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setCrudStatus("SHIPPED")}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm transition-colors"
                    >
                        Update to SHIPPED
                    </button>
                    <button
                        onClick={() => setCrudStatus("CANCELLED")}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded text-sm transition-colors"
                    >
                        Update to CANCELLED
                    </button>
                </div>

                <div className="mt-4 text-sm text-red-300 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    <span>Previous state is lost forever!</span>
                </div>
            </div>

            {/* ES Side */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center gap-3 mb-6">
                    <FileText className="text-green-400 w-6 h-6" />
                    <h3 className="text-xl font-semibold text-green-100">Event Sourcing</h3>
                </div>

                <div className="bg-slate-900 rounded-lg p-4 mb-4 h-48 overflow-y-auto custom-scrollbar">
                    <div className="text-slate-500 mb-2 text-xs">-- event stream</div>
                    <AnimatePresence>
                        {events.map((event) => (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-2 text-sm font-mono border-l-2 border-green-500 pl-3 py-1"
                            >
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>{event.time}</span>
                                    <span>#{event.id}</span>
                                </div>
                                <div className="text-green-300 font-bold">{event.type}</div>
                                <div className="text-slate-400 text-xs">{event.data}</div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="flex justify-between items-center mb-4 bg-slate-900/50 p-3 rounded border border-slate-700">
                    <span className="text-sm text-slate-400">Current State:</span>
                    <span className="font-mono text-green-400 font-bold">{esStatus}</span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => addEvent("OrderShipped")}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm transition-colors"
                    >
                        Ship Order
                    </button>
                    <button
                        onClick={() => addEvent("OrderCancelled")}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded text-sm transition-colors"
                    >
                        Cancel Order
                    </button>
                </div>
            </div>
        </div>
    );
}
