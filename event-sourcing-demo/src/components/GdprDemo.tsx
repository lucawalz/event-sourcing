import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Key, Trash2, User, ShieldAlert, ShieldCheck, RefreshCw } from "lucide-react";
import { InfoBox } from "./InfoBox";

export function GdprDemo() {
    const [name, setName] = useState("Max Mustermann");
    const [hasKey, setHasKey] = useState(true);
    const [isShredding, setIsShredding] = useState(false);

    const encryptedData = "7f8a9d1c2b3e4f5a6b7c8d9e0f1a2b3c"; // Fake encrypted string

    const handleDeleteKey = () => {
        setIsShredding(true);
        setTimeout(() => {
            setHasKey(false);
            setIsShredding(false);
        }, 1500);
    };

    const handleReset = () => {
        setHasKey(true);
        setName("Max Mustermann");
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-6">
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-slate-300 leading-relaxed">
                    Since events are immutable and cannot be deleted, how do we comply with GDPR's "right to be forgotten"?
                    <strong className="text-white">Crypto-shredding</strong> solves this by encrypting sensitive data with a user-specific key.
                    When the user requests deletion, we destroy the encryption key—making the data permanently unreadable, even though the event remains in the log.
                </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                {/* Key Management Service */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <Key className="text-yellow-400 w-6 h-6" />
                        <h3 className="text-xl font-bold text-yellow-100">Key Management</h3>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-lg border border-slate-700 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                        <AnimatePresence mode="wait">
                            {hasKey ? (
                                <motion.div
                                    key="key"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0, rotate: 180 }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <div className="p-4 bg-yellow-500/20 rounded-full ring-2 ring-yellow-500/50">
                                        <Key className="w-12 h-12 text-yellow-400" />
                                    </div>
                                    <div className="text-center">
                                        <div className="font-mono text-sm text-yellow-200">KEY_USER_123</div>
                                        <div className="text-xs text-slate-500 mt-1">Active Encryption Key</div>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="shredded"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex flex-col items-center gap-4"
                                >
                                    <div className="p-4 bg-red-500/20 rounded-full ring-2 ring-red-500/50">
                                        <Trash2 className="w-12 h-12 text-red-400" />
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold text-red-400">KEY DESTROYED</div>
                                        <div className="text-xs text-slate-500 mt-1">Crypto-Shredding Complete</div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {isShredding && (
                            <motion.div
                                className="absolute inset-0 bg-red-900/20 backdrop-blur-sm flex items-center justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="text-red-400 font-mono font-bold animate-pulse">SHREDDING...</div>
                            </motion.div>
                        )}
                    </div>

                    <div className="mt-6">
                        {hasKey ? (
                            <button
                                onClick={handleDeleteKey}
                                className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                <ShieldAlert className="w-4 h-4" />
                                Forget User (Delete Key)
                            </button>
                        ) : (
                            <button
                                onClick={handleReset}
                                className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Reset Demo
                            </button>
                        )}
                    </div>
                </div>

                {/* Event Store (Immutable) */}
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 flex flex-col">
                    <div className="flex items-center gap-3 mb-6">
                        <Database className="text-blue-400 w-6 h-6" />
                        <h3 className="text-xl font-bold text-blue-100">Immutable Event Log</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
                            <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                                <span className="text-xs font-mono text-blue-400">UserRegistered</span>
                                <span className="text-xs text-slate-500">Timestamp: 10:42</span>
                            </div>
                            <div className="p-4 font-mono text-sm space-y-2">
                                <div className="text-slate-400">{"{"}</div>
                                <div className="pl-4">
                                    <span className="text-purple-400">userId:</span> <span className="text-green-400">"user-123"</span>,
                                </div>
                                <div className="pl-4">
                                    <span className="text-purple-400">keyId:</span> <span className="text-yellow-400">"KEY_USER_123"</span>,
                                </div>
                                <div className="pl-4">
                                    <span className="text-purple-400">payload:</span>{" "}
                                    <span className="text-slate-500">encrypted(</span>
                                </div>

                                <div className="pl-8 py-2">
                                    <AnimatePresence mode="wait">
                                        {hasKey ? (
                                            <motion.div
                                                key="decrypted"
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -5 }}
                                                className="bg-green-900/20 border border-green-500/30 rounded p-2 flex items-center gap-2"
                                            >
                                                <Lock className="w-3 h-3 text-green-400" />
                                                <span className="text-green-300">{name}</span>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="encrypted"
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-red-900/20 border border-red-500/30 rounded p-2 flex items-center gap-2"
                                            >
                                                <ShieldCheck className="w-3 h-3 text-red-400" />
                                                <span className="text-red-300 break-all text-xs">{encryptedData}</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="pl-4">
                                    <span className="text-slate-500">)</span>
                                </div>
                                <div className="text-slate-400">{"}"}</div>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg text-sm text-blue-200/80">
                            <div className="font-bold mb-1 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                User View
                            </div>
                            {hasKey ? (
                                <p>System can decrypt data using the Active Key. User is identified.</p>
                            ) : (
                                <p>Without the key, the data is just random noise. The user is effectively "forgotten", even though the event remains.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <InfoBox title="Why Crypto-Shredding?">
                <p className="mb-2">
                    Deleting events would violate the fundamental principle of Event Sourcing: immutability. But regulations like GDPR require us to forget user data.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                    <li><strong>Compliance:</strong> Satisfies GDPR's "right to be forgotten" without deleting historical events.</li>
                    <li><strong>Preservation:</strong> Maintains the integrity of your event log for debugging and auditing.</li>
                    <li><strong>Fine-Grained:</strong> Only the sensitive data is encrypted; metadata and event types remain readable.</li>
                </ul>
            </InfoBox>
        </div>
    );
}

// Helper icons
function Database(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
    )
}
