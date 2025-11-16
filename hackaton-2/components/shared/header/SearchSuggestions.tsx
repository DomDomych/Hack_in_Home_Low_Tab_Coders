// components/shared/header/SearchSuggestions.tsx
"use client";

import {motion, AnimatePresence} from "framer-motion";
import {Search, Home} from "lucide-react";
import {Input} from "@/components/ui/input";
import {useClickAway} from "react-use";
import {useRef, useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {apps} from "@/lib/api";
import type {AppResponse} from "@/types/api";

interface Props {
    open: boolean;
    onClose: () => void;
}

export function SearchSuggestions({open, onClose}: Props) {
    const router = useRouter();
    const ref = useRef<HTMLDivElement>(null);
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<AppResponse[]>([]);
    const [allApps, setAllApps] = useState<AppResponse[]>([]);
    const [loading, setLoading] = useState(false);

    useClickAway(ref, onClose);

    useEffect(() => {
        if (!open) return;

        const loadApps = async () => {
            setLoading(true);
            try {
                const res = await apps.getAll();
                setAllApps(res.data);
                setResults(res.data.slice(0, 5));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadApps();
    }, [open]);

    useEffect(() => {
        if (!search.trim()) {
            setResults(allApps.slice(0, 5));
            return;
        }

        const filtered = allApps
            .filter(app =>
                app.name.toLowerCase().includes(search.toLowerCase())
            )
            .slice(0, 5);
        setResults(filtered);
    }, [search, allApps]);

    const handleAppClick = (id: number) => {
        router.push(`/apps/${id}`);
        onClose();
    };

    if (!open) return null;

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        className="fixed inset-0 bg-black/50 z-40"
                        onClick={onClose}
                    />

                    {/* Suggestions */}
                    <motion.div
                        ref={ref}
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: -20}}
                        className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-background border rounded-xl shadow-xl p-4"
                    >
                        <div className="flex items-center gap-2 mb-3">
                            <Search className="w-5 h-5 text-muted-foreground"/>
                            <Input
                                placeholder="Поиск приложений..."
                                className="border-0 focus:ring-0"
                                autoFocus
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            {loading ? (
                                <div className="text-center py-4 text-muted-foreground">
                                    Загрузка...
                                </div>
                            ) : results.length === 0 ? (
                                <div className="text-center py-4 text-muted-foreground">
                                    Ничего не найдено
                                </div>
                            ) : (
                                results.map((app, i) => (
                                    <motion.div
                                        key={app.id}
                                        initial={{opacity: 0, x: -20}}
                                        animate={{opacity: 1, x: 0}}
                                        transition={{delay: i * 0.05}}
                                        className="px-3 py-2 rounded-lg hover:bg-muted cursor-pointer flex items-center gap-2"
                                        onClick={() => handleAppClick(app.id)}
                                    >
                                        <Home className="w-4 h-4 text-muted-foreground"/>
                                        <span className="truncate">{app.name}</span>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}