'use client'

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface App {
    name: string;
    icon: string;
}

interface MoreFromDeveloperProps {
    apps?: App[];
}

export function MoreFromDeveloper({ apps = [] }: MoreFromDeveloperProps) {
    if (apps.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-12 p-8 bg-gradient-to-r from-violet-50 to-orange-50 dark:from-violet-950/20 dark:to-orange-950/20 rounded-xl text-center"
            >
                <Heart className="w-10 h-10 mx-auto mb-3 text-violet-600 dark:text-violet-400" />
                <p className="text-lg font-medium">Это первое приложение разработчика!</p>
                <p className="text-muted-foreground mt-1">
                    Поддержите автора — скачайте и оставьте отзыв
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-12"
        >
            <h3 className="text-xl font-semibold mb-4">Ещё от разработчика</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {apps.map((app, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Card className="overflow-hidden cursor-pointer">
                            <CardContent className="p-0">
                                <img src={app.icon} alt={app.name} className="w-full h-40 object-cover" />
                                <div className="p-4">
                                    <h4 className="font-medium">{app.name}</h4>
                                    <p className="text-sm text-muted-foreground">LowTabCoders</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}