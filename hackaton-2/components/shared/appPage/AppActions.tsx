'use client'

import { motion } from "framer-motion";
import {Globe, HardDrive, Star, Tag} from "lucide-react";

export function AppActions() {
    const info = [
        { icon: <Star className="w-5 h-5" />, label: "4.8", sub: "Рейтинг" },
        { icon: <Tag className="w-5 h-5" />, label: "3+", sub: "Возраст" },
        { icon: <Globe className="w-5 h-5" />, label: "RU, EN", sub: "Языки" },
        { icon: <HardDrive className="w-5 h-5" />, label: "120 МБ", sub: "Размер" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
        >
            {info.map((item, i) => (
                <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="bg-muted/50 p-4 rounded-lg text-center"
                >
                    <div className="flex justify-center mb-2 text-primary">{item.icon}</div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                </motion.div>
            ))}
        </motion.div>
    );
}