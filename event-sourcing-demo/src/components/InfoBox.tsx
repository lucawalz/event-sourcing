import { Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InfoBoxProps {
    title: string;
    children: React.ReactNode;
    isVisible?: boolean;
}

export function InfoBox({ title, children, isVisible = true }: InfoBoxProps) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mt-4"
                >
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-blue-300 text-sm mb-1">{title}</h4>
                            <div className="text-sm text-blue-100/80 leading-relaxed">
                                {children}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
