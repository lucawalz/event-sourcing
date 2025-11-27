import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, CreditCard, Truck, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "../lib/utils";
import { InfoBox } from "./InfoBox";

type StepStatus = "idle" | "pending" | "success" | "error" | "compensated";

export function SagaDemo() {
    const [orderStatus, setOrderStatus] = useState<StepStatus>("idle");
    const [paymentStatus, setPaymentStatus] = useState<StepStatus>("idle");
    const [shippingStatus, setShippingStatus] = useState<StepStatus>("idle");
    const [isRunning, setIsRunning] = useState(false);
    const [scenario, setScenario] = useState<"success" | "failure">("success");

    const runSaga = async (shouldFail: boolean) => {
        if (isRunning) return;
        setIsRunning(true);
        reset();

        // Step 1: Order
        setOrderStatus("pending");
        await delay(1000);
        setOrderStatus("success");

        // Step 2: Payment
        setPaymentStatus("pending");
        await delay(1000);
        setPaymentStatus("success");

        // Step 3: Shipping
        setShippingStatus("pending");
        await delay(1000);

        if (shouldFail) {
            setShippingStatus("error");
            await delay(1000);

            // Compensation Logic
            setPaymentStatus("compensated"); // Refund
            await delay(1000);
            setOrderStatus("compensated"); // Cancel Order
        } else {
            setShippingStatus("success");
        }

        setIsRunning(false);
    };

    const reset = () => {
        setOrderStatus("idle");
        setPaymentStatus("idle");
        setShippingStatus("idle");
    };

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-slate-300 leading-relaxed">
                    In a distributed system with multiple microservices, you can't use traditional database transactions.
                    The <strong className="text-white">Saga pattern</strong> coordinates a sequence of local transactions across services.
                    If any step fails, compensating transactions are triggered to undo the previous steps and maintain consistency.
                </p>
            </div>
            <div>
                <div className="flex justify-center gap-4 mb-12">
                    <button
                        onClick={() => { setScenario("success"); runSaga(false); }}
                        disabled={isRunning}
                        className="px-6 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-lg font-bold flex items-center gap-2 transition-all"
                    >
                        <CheckCircle className="w-5 h-5" />
                        Run Success Scenario
                    </button>
                    <button
                        onClick={() => { setScenario("failure"); runSaga(true); }}
                        disabled={isRunning}
                        className="px-6 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded-lg font-bold flex items-center gap-2 transition-all"
                    >
                        <AlertCircle className="w-5 h-5" />
                        Run Failure Scenario
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting Lines */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-slate-800 -z-10" />

                    {/* Service 1: Order */}
                    <ServiceCard
                        title="Order Service"
                        icon={ShoppingCart}
                        status={orderStatus}
                        step={1}
                        logs={[
                            orderStatus === "pending" && "Creating Order...",
                            orderStatus === "success" && "✅ OrderCreated",
                            orderStatus === "compensated" && "⚠️ OrderCancelled (Compensated)"
                        ]}
                    />

                    {/* Service 2: Payment */}
                    <ServiceCard
                        title="Payment Service"
                        icon={CreditCard}
                        status={paymentStatus}
                        step={2}
                        logs={[
                            paymentStatus === "pending" && "Processing Payment...",
                            paymentStatus === "success" && "✅ PaymentProcessed",
                            paymentStatus === "compensated" && "⚠️ PaymentRefunded (Compensated)"
                        ]}
                    />

                    {/* Service 3: Shipping */}
                    <ServiceCard
                        title="Shipping Service"
                        icon={Truck}
                        status={shippingStatus}
                        step={3}
                        logs={[
                            shippingStatus === "pending" && "Preparing Shipment...",
                            shippingStatus === "success" && "✅ OrderShipped",
                            shippingStatus === "error" && "❌ ShippingFailed"
                        ]}
                    />
                </div>

                <div className="mt-12 p-6 bg-slate-900/50 border border-slate-800 rounded-xl text-center">
                    <h4 className="text-lg font-bold mb-2">
                        {scenario === "success" ? "Happy Path" : "Compensation Path"}
                    </h4>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        {scenario === "success"
                            ? "All local transactions succeeded. The saga is complete."
                            : "Shipping failed, triggering a chain of compensating events to undo previous steps (Refund -> Cancel)."}
                    </p>
                </div>
            </div>

            <InfoBox title="Why Sagas?">
                <p className="mb-2">
                    Distributed systems can't rely on ACID transactions across services. Sagas provide a choreographed alternative.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Resilience:</strong> Each service maintains its own consistency, even if other services fail.</li>
                    <li><strong>Eventual Consistency:</strong> The system reaches a consistent state through compensating actions.</li>
                    <li><strong>Event-Driven:</strong> Fits naturally with Event Sourcing—each step emits events that trigger the next step or compensation.</li>
                </ul>
            </InfoBox>
        </div>
    );
}

function ServiceCard({ title, icon: Icon, status, step, logs }: any) {
    return (
        <div className={cn(
            "bg-slate-800 rounded-xl p-6 border-2 transition-all duration-500 relative",
            status === "idle" && "border-slate-700 opacity-50",
            status === "pending" && "border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]",
            status === "success" && "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]",
            status === "error" && "border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]",
            status === "compensated" && "border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
        )}>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center font-bold text-sm z-10">
                {step}
            </div>

            <div className="flex flex-col items-center gap-4 mb-4">
                <div className={cn(
                    "p-4 rounded-full transition-colors duration-500",
                    status === "idle" && "bg-slate-700",
                    status === "pending" && "bg-blue-900/50 text-blue-400 animate-pulse",
                    status === "success" && "bg-green-900/50 text-green-400",
                    status === "error" && "bg-red-900/50 text-red-400",
                    status === "compensated" && "bg-yellow-900/50 text-yellow-400"
                )}>
                    <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg">{title}</h3>
            </div>

            <div className="bg-slate-950 rounded p-3 h-24 text-xs font-mono overflow-y-auto space-y-1">
                {logs.filter(Boolean).map((log: string, i: number) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={cn(
                            log.includes("✅") ? "text-green-400" :
                                log.includes("❌") ? "text-red-400" :
                                    log.includes("⚠️") ? "text-yellow-400" : "text-slate-400"
                        )}
                    >
                        {log}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
