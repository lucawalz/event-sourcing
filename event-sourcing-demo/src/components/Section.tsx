import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import type { ReactNode } from "react";

interface SectionProps {
    id: string;
    title: string;
    subtitle?: string;
    children: ReactNode;
    className?: string;
}

export function Section({ id, title, subtitle, children, className }: SectionProps) {
    return (
        <section
            id={id}
            className={cn(
                "min-h-screen w-full flex flex-col items-center justify-center p-8 snap-start bg-slate-950",
                className
            )}
        >
            <motion.div
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, margin: "-100px" }}
                className="max-w-7xl w-full"
            >
                <div className="mb-12 text-center">
                    <h2 className="text-5xl md:text-7xl font-black mb-6 text-indigo-300 leading-tight">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="w-full">
                    {children}
                </div>
            </motion.div>
        </section>
    );
}
