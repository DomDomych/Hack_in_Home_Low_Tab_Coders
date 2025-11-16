"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowDown } from "lucide-react";

export function Hero() {
    return (
        <section className="relative overflow-hidden h-screen flex items-center justify-center">
            {/* Параллакс фон */}
            <motion.div
                className="absolute inset-0 -z-10"
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 via-pink-500/20 to-cyan-500/20 blur-3xl" />
            </motion.div>

            <div className="container mx-auto px-4 text-center space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-pink-600">
                        Открой будущее
                    </h1>
                    <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
                        Исследуй лучшие приложения, созданные с любовью. Инновации начинаются здесь.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex gap-4 justify-center"
                >
                    <Button size="lg" className="gap-2">
                        <Sparkles className="w-5 h-5" />
                        Начать исследование
                    </Button>
                    <Button size="lg" variant="outline">
                        Узнать больше
                    </Button>
                </motion.div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mt-16"
                >
                    <ArrowDown className="w-6 h-6 mx-auto text-muted-foreground" />
                </motion.div>
            </div>
        </section>
    );
}