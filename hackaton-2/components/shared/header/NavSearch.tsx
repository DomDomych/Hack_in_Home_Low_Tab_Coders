// components/NavSearch.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Props {
    onOpen: () => void;
}

export function NavSearch({ onOpen }: Props) {
    return (
        <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none z-10"
                />
                <Input
                    type="search"
                    placeholder="Поиск..."
                    className="pl-10 pr-4 py-2 w-full bg-background/70 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-primary cursor-pointer"
                    onClick={onOpen}
                    readOnly
                />
            </div>
        </div>
    );
}