import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Beaker, Play, CheckCircle2, XCircle, RotateCcw, Terminal, Box } from "lucide-react";
import { cn } from "../lib/utils";
import { InfoBox } from "./InfoBox";

type TestStatus = "idle" | "running" | "passed" | "failed";

export function TestingDemo() {
    const [givenEvents, setGivenEvents] = useState<string[]>([]);
    const [whenCommand, setWhenCommand] = useState<string | null>(null);
    const [thenExpectation, setThenExpectation] = useState<string | null>(null);
    const [status, setStatus] = useState<TestStatus>("idle");

    const availableEvents = ["OrderCreated", "PaymentReceived", "OrderShipped", "OrderCancelled"];
    const availableCommands = ["ShipOrder", "CancelOrder", "PayOrder"];

    const runTest = () => {
        setStatus("running");
        setTimeout(() => {
            let isValid = false;

            if (whenCommand === "ShipOrder") {
                const hasPaid = givenEvents.includes("PaymentReceived");
                const isCreated = givenEvents.includes("OrderCreated");
                const isCancelled = givenEvents.includes("OrderCancelled");

                if (thenExpectation === "OrderShipped") {
                    isValid = isCreated && hasPaid && !isCancelled;
                } else if (thenExpectation === "OrderCancelled") {
                    isValid = false;
                }
            } else if (whenCommand === "PayOrder") {
                if (thenExpectation === "PaymentReceived") {
                    isValid = givenEvents.includes("OrderCreated") && !givenEvents.includes("PaymentReceived");
                }
            } else if (whenCommand === "CancelOrder") {
                if (thenExpectation === "OrderCancelled") {
                    isValid = !givenEvents.includes("OrderShipped");
                }
            }

            setStatus(isValid ? "passed" : "failed");
        }, 1500);
    };

    const reset = () => {
        setGivenEvents([]);
        setWhenCommand(null);
        setThenExpectation(null);
        setStatus("idle");
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-slate-300 leading-relaxed">
                    <strong className="text-white">Behavior-Driven Development (BDD)</strong> uses a simple format to test event-sourced systems:
                    <strong className="text-white">GIVEN</strong> some initial events (past state), <strong className="text-white">WHEN</strong> a command is executed,
                    <strong className="text-white">THEN</strong> we expect specific events as output. This makes tests readable and directly maps to how event sourcing works.
                </p>
            </div>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                {/* Header / Toolbar */}
                <div className="bg-slate-950 border-b border-slate-800 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                        </div>
                        <span className="text-sm font-mono text-slate-400 ml-2">test_runner.ts</span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={runTest}
                            disabled={status === "running" || !whenCommand || !thenExpectation}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded text-xs font-bold text-white flex items-center gap-2 transition-all"
                        >
                            <Play className="w-3 h-3" /> RUN TEST
                        </button>
                        <button
                            onClick={reset}
                            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold text-slate-300 flex items-center gap-2 transition-all"
                        >
                            <RotateCcw className="w-3 h-3" /> RESET
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">

                    {/* 1. GIVEN */}
                    <div className="p-6 bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-6 text-blue-400">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">STEP 1</span>
                            <h3 className="font-bold">GIVEN</h3>
                        </div>

                        <div className="space-y-4">
                            <p className="text-xs text-slate-500">Select past events to build initial state:</p>
                            <div className="flex flex-wrap gap-2">
                                {availableEvents.map(evt => (
                                    <button
                                        key={evt}
                                        onClick={() => setGivenEvents([...givenEvents, evt])}
                                        disabled={status !== "idle"}
                                        className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-blue-500/50 rounded transition-all text-slate-300"
                                    >
                                        + {evt}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 bg-slate-950 rounded-lg border border-slate-800 p-4 min-h-[120px]">
                                {givenEvents.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-700 text-xs italic">
                                        <Box className="w-8 h-8 mb-2 opacity-20" />
                                        No preconditions
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <AnimatePresence>
                                            {givenEvents.map((evt, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="flex items-center gap-3 text-xs font-mono text-blue-300"
                                                >
                                                    <span className="text-slate-600 w-4">{i + 1}.</span>
                                                    <span className="bg-blue-900/20 px-2 py-0.5 rounded border border-blue-500/10 w-full">{evt}</span>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 2. WHEN */}
                    <div className="p-6 bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-6 text-purple-400">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">STEP 2</span>
                            <h3 className="font-bold">WHEN</h3>
                        </div>

                        <div className="space-y-4">
                            <p className="text-xs text-slate-500">Execute a command:</p>
                            <div className="flex flex-wrap gap-2">
                                {availableCommands.map(cmd => (
                                    <button
                                        key={cmd}
                                        onClick={() => setWhenCommand(cmd)}
                                        disabled={status !== "idle"}
                                        className={cn(
                                            "px-3 py-1.5 text-xs rounded border transition-all",
                                            whenCommand === cmd
                                                ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/20"
                                                : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300"
                                        )}
                                    >
                                        {cmd}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 bg-slate-950 rounded-lg border border-slate-800 p-4 min-h-[120px] flex items-center justify-center">
                                {whenCommand ? (
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-center"
                                    >
                                        <div className="text-xs text-slate-500 mb-2">Command Dispatch</div>
                                        <div className="text-purple-400 font-mono font-bold text-lg">{whenCommand}()</div>
                                    </motion.div>
                                ) : (
                                    <div className="text-slate-700 text-xs italic flex flex-col items-center">
                                        <Terminal className="w-8 h-8 mb-2 opacity-20" />
                                        Waiting for command...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 3. THEN */}
                    <div className="p-6 bg-slate-900/50">
                        <div className="flex items-center gap-2 mb-6 text-green-400">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-500/10 border border-green-500/20">STEP 3</span>
                            <h3 className="font-bold">THEN</h3>
                        </div>

                        <div className="space-y-4">
                            <p className="text-xs text-slate-500">Expect an event:</p>
                            <div className="flex flex-wrap gap-2">
                                {availableEvents.map(evt => (
                                    <button
                                        key={evt}
                                        onClick={() => setThenExpectation(evt)}
                                        disabled={status !== "idle"}
                                        className={cn(
                                            "px-3 py-1.5 text-xs rounded border transition-all",
                                            thenExpectation === evt
                                                ? "bg-green-600 border-green-500 text-white shadow-lg shadow-green-900/20"
                                                : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300"
                                        )}
                                    >
                                        {evt}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 bg-slate-950 rounded-lg border border-slate-800 p-4 min-h-[120px] flex items-center justify-center relative overflow-hidden">
                                {status === "idle" && !thenExpectation && (
                                    <div className="text-slate-700 text-xs italic flex flex-col items-center">
                                        <Beaker className="w-8 h-8 mb-2 opacity-20" />
                                        Define expectation...
                                    </div>
                                )}

                                {thenExpectation && status === "idle" && (
                                    <div className="text-green-400 font-mono font-bold text-lg opacity-50">{thenExpectation}</div>
                                )}

                                {status === "running" && (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-xs text-blue-400 font-mono">Running assertions...</span>
                                    </div>
                                )}

                                {status === "passed" && (
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="flex flex-col items-center gap-2"
                                    >
                                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/50">
                                            <CheckCircle2 className="w-6 h-6 text-green-400" />
                                        </div>
                                        <span className="text-green-400 font-bold">TEST PASSED</span>
                                    </motion.div>
                                )}

                                {status === "failed" && (
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="flex flex-col items-center gap-2"
                                    >
                                        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/50">
                                            <XCircle className="w-6 h-6 text-red-400" />
                                        </div>
                                        <span className="text-red-400 font-bold">ASSERTION FAILED</span>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <InfoBox title="Why Given-When-Then?">
                <p className="mb-2">
                    Event Sourcing is inherently testable because behavior is defined by: "given this history, when I do X, then Y happens."
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Readable:</strong> Tests read like specifications—anyone can understand them, not just developers.</li>
                    <li><strong>Deterministic:</strong> Events are the inputs; new events are the outputs. No hidden state.</li>
                    <li><strong>Regression-Proof:</strong> Store old tests as documentation of how the system *used to* work.</li>
                </ul>
            </InfoBox>
        </div>
    );
}
