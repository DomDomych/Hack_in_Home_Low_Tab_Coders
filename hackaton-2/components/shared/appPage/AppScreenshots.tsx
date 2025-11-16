'use client'

import { motion } from "framer-motion";
import { ImageOff } from "lucide-react";

interface AppScreenshotsProps {
    screenshots?: string[];
}

export function AppScreenshots({ screenshots = [] }: AppScreenshotsProps) {
    if (screenshots.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-8 bg-muted/50 rounded-xl text-center"
            >
                <ImageOff className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">Скриншоты скоро появятся</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
        >
            <h3 className="text-xl font-semibold mb-4">Скриншоты</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {screenshots.map((src, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="relative overflow-hidden rounded-xl shadow-lg"
                        whileHover={{ scale: 1.03 }}
                    >
                        <img src={src} alt={`Screenshot ${i + 1}`} className="w-full h-64 object-cover" />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}