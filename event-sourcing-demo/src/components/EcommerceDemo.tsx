import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, CreditCard, Truck, RotateCcw, Play } from "lucide-react";
import { cn } from "../lib/utils";
import { InfoBox } from "./InfoBox";

type EventType = "OrderCreated" | "ItemAdded" | "PaymentReceived" | "OrderShipped" | "OrderCancelled";

interface DomainEvent {
    id: number;
    type: EventType;
    data: any;
    timestamp: number;
}

interface OrderState {
    orderId: string | null;
    status: "NONE" | "CREATED" | "PAID" | "SHIPPED" | "CANCELLED";
    items: { product: string; price: number }[];
    totalAmount: number;
}

const INITIAL_STATE: OrderState = {
    orderId: null,
    status: "NONE",
    items: [],
    totalAmount: 0,
};

export function EcommerceDemo() {
    const [events, setEvents] = useState<DomainEvent[]>([]);
    const [playbackIndex, setPlaybackIndex] = useState<number | null>(null); // null = live (latest)

    // Derived State (Projection)
    const currentState = events
        .slice(0, playbackIndex === null ? undefined : playbackIndex + 1)
        .reduce<OrderState>((state, event) => {
            switch (event.type) {
                case "OrderCreated":
                    return { ...state, orderId: event.data.orderId, status: "CREATED" };
                case "ItemAdded":
                    return {
                        ...state,
                        items: [...state.items, event.data.item],
                        totalAmount: state.totalAmount + event.data.item.price,
                    };
                case "PaymentReceived":
                    return { ...state, status: "PAID" };
                case "OrderShipped":
                    return { ...state, status: "SHIPPED" };
                case "OrderCancelled":
                    return { ...state, status: "CANCELLED" };
                default:
                    return state;
            }
        }, INITIAL_STATE);

    const addEvent = (type: EventType, data: any) => {
        const newEvent: DomainEvent = {
            id: events.length + 1,
            type,
            data,
            timestamp: Date.now(),
        };
        setEvents([...events, newEvent]);
        setPlaybackIndex(null); // Reset to live view
    };

    const handleCreateOrder = () => addEvent("OrderCreated", { orderId: "ORD-123" });
    const handleAddItem = (product: string, price: number) => addEvent("ItemAdded", { item: { product, price } });
    const handlePay = () => addEvent("PaymentReceived", { amount: currentState.totalAmount });
    const handleShip = () => addEvent("OrderShipped", { tracking: "DHL-999" });
    const handleCancel = () => addEvent("OrderCancelled", { reason: "Customer request" });

    const reset = () => {
        setEvents([]);
        setPlaybackIndex(null);
    };

    return (
        <div className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6 w-full h-[600px]">
                {/* 1. Controls (Command Side) */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-blue-300 mb-2">1. Commands</h3>

                    <div className="space-y-3">
                        <button
                            onClick={handleCreateOrder}
                            disabled={currentState.status !== "NONE"}
                            className="w-full p-3 bg-blue-600/20 border border-blue-500/50 hover:bg-blue-600/40 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg flex items-center gap-3 transition-all"
                        >
                            <ShoppingCart className="w-5 h-5 text-blue-400" />
                            <span>Create Order</span>
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={() => handleAddItem("Laptop", 999)}
                                disabled={currentState.status === "NONE" || currentState.status === "SHIPPED" || currentState.status === "CANCELLED"}
                                className="p-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 disabled:opacity-30 rounded-lg text-sm transition-all"
                            >
                                + Laptop ($999)
                            </button>
                            <button
                                onClick={() => handleAddItem("Mouse", 29)}
                                disabled={currentState.status === "NONE" || currentState.status === "SHIPPED" || currentState.status === "CANCELLED"}
                                className="p-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 disabled:opacity-30 rounded-lg text-sm transition-all"
                            >
                                + Mouse ($29)
                            </button>
                        </div>

                        <button
                            onClick={handlePay}
                            disabled={currentState.status !== "CREATED" || currentState.items.length === 0}
                            className="w-full p-3 bg-green-600/20 border border-green-500/50 hover:bg-green-600/40 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg flex items-center gap-3 transition-all"
                        >
                            <CreditCard className="w-5 h-5 text-green-400" />
                            <span>Pay Order</span>
                        </button>

                        <button
                            onClick={handleShip}
                            disabled={currentState.status !== "PAID"}
                            className="w-full p-3 bg-purple-600/20 border border-purple-500/50 hover:bg-purple-600/40 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg flex items-center gap-3 transition-all"
                        >
                            <Truck className="w-5 h-5 text-purple-400" />
                            <span>Ship Order</span>
                        </button>

                        <button
                            onClick={handleCancel}
                            disabled={currentState.status === "NONE" || currentState.status === "SHIPPED" || currentState.status === "CANCELLED"}
                            className="w-full p-3 bg-red-600/20 border border-red-500/50 hover:bg-red-600/40 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg flex items-center gap-3 transition-all"
                        >
                            <span>Cancel Order</span>
                        </button>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-700">
                        <button
                            onClick={reset}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
                        >
                            <RotateCcw className="w-4 h-4" /> Reset Demo
                        </button>
                    </div>
                </div>

                {/* 2. Event Store (The Truth) */}
                <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 flex flex-col overflow-hidden relative">
                    <h3 className="text-xl font-bold text-purple-300 mb-4 flex justify-between items-center">
                        2. Event Log
                        {playbackIndex !== null && (
                            <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded border border-yellow-500/50 animate-pulse">
                                Time Travel Active
                            </span>
                        )}
                    </h3>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                        <AnimatePresence>
                            {events.map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{
                                        opacity: playbackIndex !== null && index > playbackIndex ? 0.3 : 1,
                                        x: 0
                                    }}
                                    onClick={() => setPlaybackIndex(index === playbackIndex ? null : index)}
                                    className={cn(
                                        "p-3 rounded border cursor-pointer transition-all hover:scale-[1.02]",
                                        playbackIndex === index ? "bg-yellow-900/30 border-yellow-500 ring-1 ring-yellow-500" : "bg-slate-800 border-slate-700 hover:border-slate-500"
                                    )}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={cn(
                                            "font-mono font-bold text-xs",
                                            event.type === "OrderCreated" ? "text-blue-400" :
                                                event.type === "ItemAdded" ? "text-cyan-400" :
                                                    event.type === "PaymentReceived" ? "text-green-400" :
                                                        event.type === "OrderShipped" ? "text-purple-400" : "text-red-400"
                                        )}>
                                            {event.type}
                                        </span>
                                        <span className="text-[10px] text-slate-500">#{event.id}</span>
                                    </div>
                                    <div className="text-xs text-slate-400 font-mono truncate">
                                        {JSON.stringify(event.data)}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {events.length === 0 && (
                            <div className="text-center text-slate-600 mt-10 italic">
                                No events yet. Start by creating an order.
                            </div>
                        )}
                    </div>

                    {playbackIndex !== null && (
                        <button
                            onClick={() => setPlaybackIndex(null)}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm"
                        >
                            <Play className="w-4 h-4" /> Return to Live
                        </button>
                    )}
                </div>

                {/* 3. State Projection (Read Model) */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 flex flex-col">
                    <h3 className="text-xl font-bold text-green-300 mb-4">3. Current State</h3>

                    <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm flex-1 border border-slate-800 overflow-y-auto">
                        {currentState.status === "NONE" ? (
                            <div className="text-slate-600 italic">State is empty</div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <span className="text-slate-500 block text-xs mb-1">Order ID</span>
                                    <span className="text-white">{currentState.orderId}</span>
                                </div>

                                <div>
                                    <span className="text-slate-500 block text-xs mb-1">Status</span>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-xs font-bold inline-block",
                                        currentState.status === "CREATED" ? "bg-blue-900/50 text-blue-400" :
                                            currentState.status === "PAID" ? "bg-green-900/50 text-green-400" :
                                                currentState.status === "SHIPPED" ? "bg-purple-900/50 text-purple-400" :
                                                    currentState.status === "CANCELLED" ? "bg-red-900/50 text-red-400" : ""
                                    )}>
                                        {currentState.status}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-slate-500 block text-xs mb-1">Items</span>
                                    {currentState.items.length === 0 ? (
                                        <span className="text-slate-700 italic text-xs">No items</span>
                                    ) : (
                                        <ul className="space-y-1">
                                            {currentState.items.map((item, i) => (
                                                <li key={i} className="flex justify-between text-slate-300 text-xs border-b border-slate-800 pb-1 last:border-0">
                                                    <span>{item.product}</span>
                                                    <span>${item.price}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-slate-800">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Total</span>
                                        <span className="text-xl font-bold text-green-400">${currentState.totalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-4 text-xs text-slate-500 text-center">
                        State is purely derived from the events above.
                    </div>
                </div>
            </div>

            <InfoBox title="What's happening?">
                {currentState.status === "NONE" && "The system is idle. No events have occurred yet."}
                {currentState.status === "CREATED" && "An 'OrderCreated' event was appended. The state is derived by replaying this event."}
                {currentState.status === "PAID" && "Payment was received. The 'PaymentReceived' event updated the status to PAID."}
                {currentState.status === "SHIPPED" && "The order has been shipped. The 'OrderShipped' event is the final one in this sequence."}
                {currentState.status === "CANCELLED" && "The order was cancelled. This is a terminal state."}
                {playbackIndex !== null && " (Time Travel Mode: Viewing past state)"}
            </InfoBox>
        </div>
    );
}
