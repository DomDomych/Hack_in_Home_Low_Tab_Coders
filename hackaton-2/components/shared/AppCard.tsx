// components/AppCard.tsx - исправленный
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Download } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface AppCardProps {
    id: string;
    icon: string;
    title: string;
    category: string;
    rating: number;
    users: string;
    price: number;
    short_descr: string;
}

export function AppCard({ id, title, icon, category, rating, users, price, short_descr }: AppCardProps) {
    const router = useRouter();

    const handleCardClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('button')) return;
        router.push(`/apps/${id}`);
    };

    const isPopular = rating > 4.5;
    const isFree = price === 0;

    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="cursor-pointer h-full"
        >
            <Card
                className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow p-4 flex flex-col"
                onClick={handleCardClick}
            >
                <CardHeader className="pb-3 flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl mb-3 flex items-center justify-center text-white font-bold text-lg">
                        <img src={icon} className="w-full h-full rounded-lg object-cover"/>
                    </div>
                    <CardTitle className="text-lg leading-tight">{title}</CardTitle>
                    <CardDescription className="truncate">{category}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 space-y-3 flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground line-clamp-2 flex-shrink-0">
                        {short_descr}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-shrink-0">
                        <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{users}</span>
                        </div>
                        <div className="ml-auto font-medium text-foreground">
                            {isFree ? "Бесплатно" : `${price} ₽`}
                        </div>
                    </div>

                    <div className="flex gap-2 mt-auto pt-2">
                        <Button
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                                e.stopPropagation(); // ← ВАЖНО!
                                alert(`Скачивание "${title}"...`);
                            }}
                        >
                            <Download className="w-4 h-4 mr-1" />
                            {isFree ? "Установить" : "Купить"}
                        </Button>
                        {isPopular && (
                            <Badge variant="secondary" className="whitespace-nowrap">
                                Популярное
                            </Badge>
                        )}
                        {isFree && !isPopular && (
                            <Badge variant="outline" className="whitespace-nowrap">
                                Бесплатно
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}