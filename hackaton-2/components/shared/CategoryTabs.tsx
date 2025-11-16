"use client";

import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AppCard } from "./AppCard";
import { motion } from "framer-motion";
import { apps, categories } from "@/lib/api";
import type { AppResponse, CategoryResponse } from "@/types/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CategoryTabs() {
    const [activeTab, setActiveTab] = useState("all");
    const [allApps, setAllApps] = useState<AppResponse[]>([]);
    const [allCategories, setAllCategories] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [appsRes, catsRes] = await Promise.all([
                apps.getAll(),
                categories.getAll()
            ]);

            setAllApps(appsRes.data);
            setAllCategories(catsRes.data);

            if (catsRes.data.length > 0) {
                const firstKey = catsRes.data[0].name.toLowerCase().replace(/\s+/g, '_');
                setActiveTab(firstKey);
            }
        } catch (err: any) {
            setError(err.message || "Не удалось загрузить данные");
        } finally {
            setLoading(false);
        }
    };

    const getAppsForCategory = (categoryKey: string): AppResponse[] => {
        if (categoryKey === "all") return allApps;

        const category = allCategories.find(
            c => c.name.toLowerCase().replace(/\s+/g, '_') === categoryKey
        );

        return category ? allApps.filter(app => app.category_id === category.id) : [];
    };

    const formatTabName = (key: string): string => {
        if (key === "all") return "Все";
        const cat = allCategories.find(
            c => c.name.toLowerCase().replace(/\s+/g, '_') === key
        );
        return cat?.name || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const tabKeys = [
        "all",
        ...allCategories.map(cat => cat.name.toLowerCase().replace(/\s+/g, '_'))
    ];

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = 200;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    if (loading) {
        return (
            <section className="flex justify-center items-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Загрузка приложений...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="text-center text-red-500 min-h-[400px] flex items-center justify-center">
                <div>
                    <p>Ошибка: {error}</p>
                    <button
                        onClick={loadData}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                    >
                        Попробовать снова
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-8"
            >
                <h2 className="text-4xl font-bold">Приложения по категориям</h2>
                <p className="text-muted-foreground mt-2">Выбери то, что тебе нужно</p>
            </motion.div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                {/* === ГОРИЗОНТАЛЬНЫЕ ТАБЫ ПО ЦЕНТРУ === */}
                <div className="relative mb-8">
                    <ScrollArea className="w-full">
                        <div
                            ref={scrollRef}
                            className="flex justify-center gap-2 py-2 overflow-x-auto scrollbar-hide"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {tabKeys.map((key) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`
              min-w-fit px-4 py-2 text-xs sm:text-sm rounded-full transition-all duration-200
              whitespace-nowrap font-medium shadow-sm
              ${activeTab === key
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                    }
            `}
                                >
                                    {formatTabName(key)}
                                </button>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>

                    {/* Стрелки — только если много табов */}
                    {tabKeys.length > 6 && (
                        <>
                            <button
                                onClick={() => scroll('left')}
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg hover:scale-110 transition"
                                aria-label="Прокрутить влево"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg hover:scale-110 transition"
                                aria-label="Прокрутить вправо"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>

                {/* === КОНТЕНТ ТАБОВ (остаётся без изменений) === */}
                {tabKeys.map((key) => {
                    const categoryApps = getAppsForCategory(key);

                    return (
                        <TabsContent key={key} value={key} className="mt-8">
                            {categoryApps.length === 0 ? (
                                <div className="text-center py-16 text-muted-foreground">
                                    <p className="text-lg">В этой категории пока нет приложений</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {categoryApps.map((app, i) => (
                                        <motion.div
                                            key={app.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <AppCard
                                                id={app.id.toString()}
                                                title={app.name}
                                                icon={app.url}
                                                category={
                                                    allCategories.find(c => c.id === app.category_id)?.name ||
                                                    "Без категории"
                                                }
                                                rating={app.rating}
                                                users={`${app.downloads.toLocaleString()}+`}
                                                price={app.price}
                                                short_descr={app.short_descr}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    );
                })}
            </Tabs>
        </section>
    );
}