// components/NavMobileMenu.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Menu, X, Search, ArrowLeft, Settings, Sparkles,
    Code2, UserCircle2, Upload
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { SettingsDrawer } from "./SettingsDrawer";
import { useToggle } from "react-use";
import { UploadAppModal } from "@/components/shared/dashboard/UploadAppModal";

interface Props {
    isOpen: boolean;
    onToggle: () => void;
}

export function NavMobileMenu({ isOpen, onToggle }: Props) {
    const pathname = usePathname();
    const [settingsOpen, toggleSettings] = useToggle(false);
    const [uploadOpen, toggleUpload] = useToggle(false);

    const isAppPage = pathname.startsWith("/apps/");
    const isInDashboard = pathname.startsWith("/dashboard");
    const isDeveloperMode = pathname === "/dashboard/developer";
    const isUserMode = pathname === "/dashboard/user";

    const switchToPath = isDeveloperMode ? "/dashboard/user" : "/dashboard/developer";
    const switchIcon = isDeveloperMode ? <UserCircle2 className="w-5 h-5" /> : <Code2 className="w-5 h-5" />;
    const switchLabel = isDeveloperMode ? "Пользователь" : "Разработчик";

    return (
        <>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onToggle}>
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>

            {/* Анимированный drawer с backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                            onClick={onToggle}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 w-80 bg-background shadow-2xl z-50 md:hidden overflow-y-auto"
                        >
                            <div className="p-6 space-y-6">
                                {/* Логотип и закрытие */}
                                <div className="flex items-center justify-between">
                                    <Link href="/" className="flex items-center gap-2">
                                        <Sparkles className="w-6 h-6 text-violet-600" />
                                        <span className="font-bold text-xl">LowTabCoders</span>
                                    </Link>
                                    <Button variant="ghost" size="icon" onClick={onToggle}>
                                        <X className="w-6 h-6" />
                                    </Button>
                                </div>

                                {/* Назад на страницах приложений */}
                                {isAppPage && (
                                    <Button variant="ghost" asChild className="w-full justify-start">
                                        <Link href="/">
                                            <ArrowLeft className="w-5 h-5 mr-2" />
                                            Назад
                                        </Link>
                                    </Button>
                                )}

                                {/* Поиск */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                    <Input type="text" placeholder="Поиск..." className="pl-10 pr-4 py-2 w-full" />
                                </div>

                                {/* Основные ссылки */}
                                {["Главная", "Категории", "Топ"].map((item) => (
                                    <a key={item} href="#" className="block text-foreground hover:text-violet-600 font-medium py-2">
                                        {item}
                                    </a>
                                ))}

                                {/* === ДАШБОРД ЛОГИКА === */}
                                {isInDashboard ? (
                                    <>
                                        {/* Переключатель режимов */}
                                        <Link href={switchToPath} className="block">
                                            <Button
                                                variant="outline"
                                                className="w-full justify-start gap-3 border-violet-300 hover:border-violet-500 hover:bg-violet-50"
                                            >
                                                {switchIcon}
                                                <span>{switchLabel}</span>
                                            </Button>
                                        </Link>

                                        {/* Загрузить приложение — только в dev */}
                                        {isDeveloperMode && (
                                            <Button
                                                variant="default"
                                                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium flex items-center justify-center gap-2"
                                                onClick={toggleUpload}
                                            >
                                                <Upload className="w-5 h-5" />
                                                Загрузить приложение
                                            </Button>
                                        )}
                                    </>
                                ) : (
                                    <Link href="/auth/login" className="block">
                                        <Button variant="outline" className="w-full">Войти</Button>
                                    </Link>
                                )}

                                {/* Настройки */}
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3"
                                    onClick={() => toggleSettings(true)}
                                >
                                    <Settings className="w-5 h-5" />
                                    <span>Настройки</span>
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Модальные окна */}
            <SettingsDrawer open={settingsOpen} onOpenChange={toggleSettings} />
            <UploadAppModal open={uploadOpen} onOpenChange={toggleUpload} />
        </>
    );
}