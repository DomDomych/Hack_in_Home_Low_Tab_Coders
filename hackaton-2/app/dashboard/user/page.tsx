'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import {Header} from "@/components/shared/header/Header";

export default function UserDashboard() {
    return (
        <div className="min-h-screen p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                <Header/>

                <div className="grid grid-cols-1 md:grid-cols-3 mt-16 gap-4">
                    <Card className="p-6 border-0 shadow-xl backdrop-blur-md">
                        <p className="text-sm opacity-90">Общий баланс</p>
                        <p className="text-4xl font-bold mt-2">120,456.50₽</p>
                        <p className="text-xs mt-1 opacity-80">+2,456₽ с прошлого месяца</p>
                        <div className="flex gap-2 mt-4">
                            <Button size="sm" variant="secondary" className="">
                                Перевести
                            </Button>
                            <Button size="sm" className="">
                                Пополнить
                            </Button>
                        </div>
                    </Card>

                    {/* Income */}
                    <Card className="p-5 border-0 shadow-xl backdrop-blur-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Доход</p>
                                <p className="text-2xl font-bold">+2,456₽</p>
                                <p className="text-xs">На этой неделе</p>
                            </div>
                            <Badge className="">+15.7%</Badge>
                        </div>
                    </Card>

                    {/* Expense */}
                    <Card className="p-5 border-0 shadow-xl backdrop-blur-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Расход</p>
                                <p className="text-2xl font-bold">-1,124₽</p>
                                <p className="text-xs">На этой неделе</p>
                            </div>
                            <Badge className="">-10.7%</Badge>
                        </div>
                    </Card>
                </div>

                {/* Приложения + активность */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Установленные приложения */}
                    <Card className="border-0 p-6">
                        <h3 className="text-lg font-semibold mb-4">Мои приложения</h3>
                        <div className="space-y-3">
                            {[
                                { name: "Telegram", icon: "✈️", spent: "4.99₽", date: "04 авг" },
                                { name: "Spotify", icon: "🎵", spent: "9.99₽", date: "15 июл" },
                                { name: "Notion", icon: "📝", spent: "8.99₽", date: "01 авг" },
                            ].map((app) => (
                                <div key={app.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{app.icon}</div>
                                        <div>
                                            <p className="font-medium">{app.name}</p>
                                            <p className="text-xs">Следующий платёж: {app.date}</p>
                                        </div>
                                    </div>
                                    <p className="">-{app.spent}</p>
                                </div>
                            ))}
                        </div>
                        <Button variant="link" className="mt-4 p-0">
                            Показать все →
                        </Button>
                    </Card>

                    {/* Активность */}
                    <Card className="border-0 p-6">
                        <h3 className="text-lg font-semibold mb-4">Активность</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Установок</span>
                                <span className="font-bold">42</span>
                            </div>
                            <Progress value={68} className="h-2" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm">Отзывов оставлено</span>
                                <span className="font-bold">18</span>
                            </div>
                            <Progress value={45} className="h-2 " />
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-sm">+12% активности за неделю</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Последние транзакции */}
                <Card className="border-0 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Последние транзакции</h3>
                        <Button variant="ghost" size="sm" className="text-white">Все →</Button>
                    </div>
                    <div className="space-y-3">
                        {[
                            { app: "Telegram", amount: "-4.99₽", status: "success", time: "04.07.2025 12:40" },
                            { app: "App Store", amount: "-9.99₽", status: "pending", time: "03.07.2025 09:15" },
                        ].map((t) => (
                            <div key={t.time} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-full p-2">✈️</div>
                                    <div>
                                        <p className="font-medium">{t.app}</p>
                                        <p className="text-xs">{t.time}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium ">{t.amount}</p>
                                    <Badge variant={t.status === "success" ? "default" : "secondary"} className="text-xs">
                                        {t.status === "success" ? "Успешно" : "Ожидание"}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}