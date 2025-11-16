"use client";

import { Button } from "@/components/ui/button";
import { User, Settings, Upload, Code2, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SettingsDrawer } from "./SettingsDrawer";
import { useToggle } from "react-use";
import { usePathname } from "next/navigation";
import {UploadAppModal} from "@/components/shared/dashboard/UploadAppModal";

export function NavActions() {
    const [settingsOpen, toggleSettings] = useToggle(false);
    const [uploadOpen, toggleUpload] = useToggle(false);
    const pathname = usePathname();

    // Определяем, находимся ли мы в dashboard
    const isInDashboard = pathname.startsWith("/dashboard");

    return (
        <>
            <div className="hidden md:flex items-center gap-3">
                {/* Вход — только если НЕ в dashboard */}
                {!isInDashboard && (
                    <Link href="/auth/login">
                        <Button variant="ghost" className="hover:text-violet-600 font-medium">
                            Войти
                        </Button>
                    </Link>
                )}

                {/* Профиль пользователя */}
                <Link href="/dashboard/user">
                    <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 border">
                        <User className="w-5 h-5" />
                    </Button>
                </Link>

                {/* Настройки */}
                <motion.div whileHover={{ rotate: 90 }} transition={{ type: "spring", stiffness: 400 }}>
                    <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 border" onClick={toggleSettings}>
                        <Settings className="w-5 h-5" />
                    </Button>
                </motion.div>
            </div>

            {/* Модальные окна */}
            <SettingsDrawer open={settingsOpen} onOpenChange={toggleSettings} />
            <UploadAppModal open={uploadOpen} onOpenChange={toggleUpload} />
        </>
    );
}