// components/SettingsDrawer.tsx
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Palette, UserCircle2, Code2, Upload, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocalStorage } from "react-use";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import { UploadAppModal } from "@/components/shared/dashboard/UploadAppModal";
import { useToggle } from "react-use";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SettingsDrawer({ open, onOpenChange }: Props) {
    const { theme, setTheme } = useTheme();
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [uploadOpen, toggleUpload] = useToggle(false);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 767);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const [colorTheme, setColorTheme] = useLocalStorage<string>("color-theme", "default");

    const themes = [
        { value: "light", label: "Светлая", icon: Sun },
        { value: "dark", label: "Тёмная", icon: Moon },
        { value: "system", label: "Системная", icon: Palette },
    ];

    const colors = [
        { value: "default", label: "По умолчанию" },
        { value: "violet", label: "Фиолетовый" },
        { value: "orange", label: "Оранжевый" },
        { value: "emerald", label: "Изумрудный" },
    ];

    const setColor = (value: string) => {
        setColorTheme(value);
        if (value === "default") {
            document.documentElement.removeAttribute("data-theme");
        } else {
            document.documentElement.setAttribute("data-theme", value);
        }
    };

    const handleLogout = () => {
        logout();
        onOpenChange(false);
        router.push("/");
    };

    const isInDashboard = pathname.startsWith("/dashboard");
    const isDeveloperMode = pathname === "/dashboard/developer";
    const isUserMode = pathname === "/dashboard/user";

    const switchToPath = isDeveloperMode ? "/dashboard/user" : "/dashboard/developer";
    const switchIcon = isDeveloperMode ? <UserCircle2 className="w-4 h-4" /> : <Code2 className="w-4 h-4" />;
    const switchLabel = isDeveloperMode ? "Режим пользователя" : "Режим разработчика";

    const content = (
        <div className="p-6 space-y-6">
            {/* Информация о пользователе */}
            {user && (
                <div className="pb-4 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserCircle2 className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground truncate">{user.name}</div>
                            <div className="text-sm text-muted-foreground truncate">{user.login}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Переключение режимов - только в dashboard */}
            {isInDashboard && (
                <div>
                    <h4 className="font-medium mb-4 text-foreground">Режим работы</h4>
                    <div className="space-y-2">
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-3 border-violet-300 hover:border-violet-500 hover:bg-violet-50"
                            onClick={() => {
                                router.push(switchToPath);
                                onOpenChange(false);
                            }}
                        >
                            {switchIcon}
                            <span>{switchLabel}</span>
                        </Button>

                        {/* Кнопка загрузки приложения - только в режиме разработчика */}
                        {isDeveloperMode && (
                            <Button
                                variant="default"
                                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium flex items-center justify-center gap-2"
                                onClick={() => {
                                    toggleUpload(true);
                                    onOpenChange(false);
                                }}
                            >
                                <Upload className="w-4 h-4" />
                                Загрузить приложение
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Настройки темы */}
            <div>
                <h4 className="font-medium mb-4 text-foreground">Тема</h4>
                <div className="flex flex-wrap gap-2">
                    {themes.map(({ value, label, icon: Icon }) => (
                        <Button
                            key={value}
                            variant={theme === value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTheme(value)}
                            className="flex-1 min-w-[100px]"
                        >
                            <Icon className="w-4 h-4 mr-2 shrink-0" />
                            {label}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Цветовая схема */}
            <div>
                <h4 className="font-medium mb-4 text-foreground">Цветовая схема</h4>
                <div className="flex flex-wrap gap-2">
                    {colors.map(({ value, label }) => (
                        <Button
                            key={value}
                            variant={colorTheme === value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setColor(value)}
                            className={`flex-1 min-w-[100px] ${
                                value !== "default" ? `data-[state=active]:bg-[hsl(var(--${value}))]` : ""
                            }`}
                        >
                            {value === "default" ? (
                                "По умолчанию"
                            ) : (
                                <>
                                    <Palette className={`w-4 h-4 mr-2 text-[hsl(var(--${value}))]`} />
                                    {label}
                                </>
                            )}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Кнопка выхода */}
            {user && (
                <div className="pt-4 border-t border-border">
                    <Button
                        variant="outline"
                        className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Выйти
                    </Button>
                </div>
            )}

            {/* Информация о версии */}
            <div className="pt-4 border-t border-border text-sm text-muted-foreground">
                <div>LowTabCoders v1.0.0</div>
                <div className="mt-1">Tailwind CSS v4</div>
            </div>
        </div>
    );

    // === МОБИЛЬНЫЕ: снизу ===
    if (isMobile) {
        return (
            <>
                <Sheet open={open} onOpenChange={onOpenChange}>
                    <SheetContent side="bottom" className="h-[70vh] max-h-[600px] rounded-t-2xl">
                        <SheetHeader>
                            <SheetTitle className="text-foreground">Настройки</SheetTitle>
                        </SheetHeader>
                        <div className="overflow-y-auto h-full pb-6">
                            {content}
                        </div>
                    </SheetContent>
                </Sheet>

                <UploadAppModal open={uploadOpen} onOpenChange={toggleUpload} />
            </>
        );
    }

    // === ДЕСКТОП: слева, на всю высоту, анимация слева → направо ===
    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent
                    side="left"
                    className="w-80 h-screen p-0 rounded-none border-r"
                >
                    <motion.div
                        initial={{ x: -320 }} // w-80 = 320px
                        animate={{ x: 0 }}
                        exit={{ x: -320 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="h-full flex flex-col"
                    >
                        <SheetHeader className="p-6 pb-4 border-b">
                            <SheetTitle className="text-foreground">Настройки</SheetTitle>
                        </SheetHeader>
                        <div className="flex-1 overflow-y-auto">
                            {content}
                        </div>
                    </motion.div>
                </SheetContent>
            </Sheet>

            <UploadAppModal open={uploadOpen} onOpenChange={toggleUpload} />
        </>
    );
}