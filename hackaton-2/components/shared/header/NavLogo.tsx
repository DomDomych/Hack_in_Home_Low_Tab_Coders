"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function NavLogo() {
    const pathname = usePathname();
    const isAppPage = pathname.startsWith("/apps/");

    return (
        <div className="flex items-center gap-3">
            {isAppPage && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Назад
                        </Link>
                    </Button>
                </motion.div>
            )}
            <Link href="/" className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-violet-600" />
                <span className="font-bold text-xl">LowTabCoders</span>
            </Link>
        </div>
    );
}