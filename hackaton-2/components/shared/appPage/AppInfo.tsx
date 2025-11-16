'use client'

import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {Download} from "lucide-react";
import {motion} from "framer-motion";

interface AppInfoProps {
    icon: string;
    name: string;
    developer: string;
    category: string;
    downloads: string;
}

export function AppInfo({icon, name, developer, category, downloads}: AppInfoProps) {
    const handleDownload = () => {
        // Создаем ссылку для скачивания
        const downloadLink = document.createElement('a');

        // Форматируем имя файла на основе названия приложения
        const fileName = `${name.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_')}.apk`;

        // Устанавливаем путь к файлу и имя для скачивания
        downloadLink.href = '/test.apk';
        downloadLink.download = fileName;
        downloadLink.style.display = 'none';

        // Добавляем в DOM, кликаем и удаляем
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <motion.div
            initial={{opacity: 0, x: -50}}
            animate={{opacity: 1, x: 0}}
            transition={{delay: 0.3}}
            className="flex items-start gap-6 p-6 bg-card rounded-xl shadow-sm"
        >
            <div className="w-24 h-24 bg-gray-200 border-2 border-dashed rounded-xl flex-shrink-0">
                <img src={icon} alt={name} className="w-full h-full rounded-lg object-cover"/>
            </div>
            <div className="flex-1 space-y-3">
                <div>
                    <h2 className="text-2xl font-bold">{name}</h2>
                    <p className="text-muted-foreground">{developer}</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="secondary">{category}</Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                       <Download className="w-4 h-4"/> {downloads}
                    </span>
                </div>
                <Button size="lg" className="mt-4" onClick={handleDownload}>
                    <Download className="mr-2 w-5 h-5"/> Скачать
                </Button>
            </div>
        </motion.div>
    );
}