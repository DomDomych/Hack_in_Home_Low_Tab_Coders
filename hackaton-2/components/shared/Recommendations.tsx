"use client";

import {motion} from "framer-motion";
import {AppCard} from "./AppCard";
import {useState, useEffect} from "react";
import {apps, categories} from "@/lib/api";
import {AppResponse, CategoryResponse} from "@/types/api";

export function Recommendations() {
    const [recommendedApps, setRecommendedApps] = useState<AppResponse[]>([]);
    const [allCategories, setAllCategories] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                const [appsRes, catsRes] = await Promise.all([
                    apps.getAll(),
                    categories.getAll()
                ]);

                setRecommendedApps(appsRes.data.slice(0, 6));
                setAllCategories(catsRes.data);
            } catch (err) {
                console.error("Failed to load recommendations:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <section>
            <motion.div
                initial={{opacity: 0, y: 20}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                className="text-center mb-12"
            >
                <h2 className="text-4xl font-bold">Рекомендуем прямо сейчас</h2>
                <p className="text-muted-foreground mt-2">Выбор редакции и сообщества</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="bg-muted animate-pulse rounded-xl h-64"/>
                    ))
                ) : recommendedApps.length === 0 ? (
                    <p className="col-span-full text-center text-muted-foreground">Приложений пока нет</p>
                ) : (
                    recommendedApps.map((app, i) => (
                        <motion.div
                            key={app.id}
                            initial={{opacity: 0, x: i % 2 === 0 ? -50 : 50}}
                            whileInView={{opacity: 1, x: 0}}
                            viewport={{once: true}}
                            transition={{delay: i * 0.15}}
                        >
                            <AppCard
                                id={app.id.toString()}
                                icon={app.url}
                                title={app.name}
                                category={allCategories.find(c => c.id === app.category_id)?.name || "Без категории"}
                                rating={app.rating}
                                users={`${app.downloads.toLocaleString()}+`}
                                price={app.price}
                                short_descr={app.short_descr}
                            />
                        </motion.div>
                    ))
                )}
            </div>
        </section>
    );
}