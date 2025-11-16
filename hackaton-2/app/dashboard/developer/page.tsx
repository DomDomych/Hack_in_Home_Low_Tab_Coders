'use client';

import { useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Download, DollarSign, Sparkles } from "lucide-react";
import { Header } from "@/components/shared/header/Header";
import { ChartLineInteractive } from "@/components/shared/dashboard/ChartLineInteractive";

export default function DeveloperDashboard() {
    return (
        <div className="min-h-screen p-4 md:p-6 relative">
            <div className="max-w-7xl mx-auto space-y-6">

                <Header />

                {/* Ключевые метрики */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-5 bg-gradient-to-br border-0 shadow-xl backdrop-blur-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Доход</p>
                                <p className="text-2xl font-bold">+48,320₽</p>
                                <p className="text-xs">Этот месяц</p>
                            </div>
                            <TrendingUp className="h-8 color w-8 opacity-70" />
                        </div>
                    </Card>

                    <Card className="border-0 shadow-xl backdrop-blur-md">
                        <div className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Установок</p>
                                <p className="text-2xl font-bold">2,845</p>
                                <p className="text-xs">+245 за неделю</p>
                            </div>
                            <Download className="h-8 w-8 opacity-70" />
                        </div>
                    </Card>

                    <Card className="border-0 shadow-xl backdrop-blur-md">
                        <div className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">Активные</p>
                                <p className="text-2xl font-bold">1,920</p>
                                <p className="text-xs">DAU</p>
                            </div>
                            <Users className="h-8 w-8 opacity-70" />
                        </div>
                    </Card>

                    <Card className="border-0 shadow-xl backdrop-blur-md">
                        <div className="p-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm opacity-90">ARPU</p>
                                <p className="text-2xl font-bold">16.98₽</p>
                                <p className="text-xs">На пользователя</p>
                            </div>
                            <DollarSign className="h-8 w-8 opacity-70" />
                        </div>
                    </Card>
                </div>

                {/* Приложения */}
                <Card className="backdrop-blur-md border-0 p-6">
                    <h3 className="text-lg font-semibold mb-4">Мои приложения</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { name: "Pixel Adventure", revenue: "+12,400₽", installs: "1,245", trend: "+32%" },
                            { name: "TaskFlow", revenue: "+8,920₽", installs: "892", trend: "+18%" },
                            { name: "AI Chat", revenue: "+27,000₽", installs: "708", trend: "+45%" },
                        ].map((app) => (
                            <div key={app.name} className="bg-white/10 rounded-xl p-4 backdrop-blur">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-medium">{app.name}</p>
                                    <Badge>{app.trend}</Badge>
                                </div>
                                <p className="text-2xl font-bold">{app.revenue}</p>
                                <p className="text-xs opacity-70">{app.installs} установок</p>
                            </div>
                        ))}
                    </div>
                </Card>

                <ChartLineInteractive />
            </div>

        </div>
    );
}