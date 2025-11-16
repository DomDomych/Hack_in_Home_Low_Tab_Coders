// components/Header.tsx
"use client";

import { NavLogo } from "./NavLogo";
import { NavSearch } from "./NavSearch";
import { NavActions } from "./NavActions";
import { NavMobileMenu } from "./NavMobileMenu";
import { AnimatePresence, motion } from "framer-motion";
import { useWindowScroll } from "react-use";
import { useState } from "react";
import { SearchSuggestions } from "@/components/shared/header/SearchSuggestions";

export function Header() {
    const { y } = useWindowScroll();
    const scrolled = y > 50;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
                    scrolled
                        ? "bg-background/80 backdrop-blur-md shadow-md"
                        : "bg-transparent"
                }`}
            >
                <div className="container mx-auto px-4 py-4 h-16 flex items-center justify-between">
                    <NavLogo />
                    <NavSearch onOpen={() => setSearchOpen(true)} />
                    <NavActions />
                    <NavMobileMenu isOpen={mobileOpen} onToggle={() => setMobileOpen(v => !v)} />
                </div>
            </motion.nav>

            {/* Поиск */}
            <AnimatePresence>
                {searchOpen && (
                    <SearchSuggestions open={searchOpen} onClose={() => setSearchOpen(false)} />
                )}
            </AnimatePresence>
        </>
    );
}