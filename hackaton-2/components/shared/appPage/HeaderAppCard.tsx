'use client'

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

    export function HeaderAppCard({label, shortDesc}: {label: string, shortDesc: string}) {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-violet-600 to-orange-600 text-white py-16"
        >
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="inline-flex items-center gap-2 mb-4"
                >
                    <Sparkles className="w-6 h-6" />
                    <span className="text-sm font-medium uppercase tracking-wider">
            Приложение недели
          </span>
                </motion.div>
                <h1 className="text-4xl md:text-6xl font-bold">{label}</h1>
                <p className="mt-2 text-lg opacity-90">{shortDesc}</p>
            </div>
        </motion.header>
    );
}