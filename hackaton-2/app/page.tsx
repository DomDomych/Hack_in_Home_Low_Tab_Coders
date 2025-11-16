"use client";

import { Hero } from "@/components/shared/Hero";
import { CategoryTabs } from "@/components/shared/CategoryTabs";
import { Recommendations } from "@/components/shared/Recommendations";
import {Header} from "@/components/shared/header/Header";

export default function Page() {
    return (
        <>
            <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-black">
                <Header/>
                <Hero />
                <div className="container mx-auto px-4 py-16 space-y-24">
                    <CategoryTabs />
                    <Recommendations />
                </div>
            </main>
        </>
    );
}