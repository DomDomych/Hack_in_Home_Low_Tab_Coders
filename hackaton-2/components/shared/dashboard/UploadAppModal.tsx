// components/shared/dashboard/UploadAppModal.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { apps, categories } from "@/lib/api";
import type { CategoryResponse, AppCreate } from "@/types/api";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UploadAppModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UploadAppModal({ open, onOpenChange }: UploadAppModalProps) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [categoriesList, setCategoriesList] = useState<CategoryResponse[]>([]);

    // Поля формы согласно AppCreate схеме
    const [formData, setFormData] = useState({
        name: "",
        url: "",
        short_descr: "",
        full_descr: "",
        price: 0,
        age_restriction: 0,
        category_id: 0
    });

    const [file, setFile] = useState<File | null>(null);

    // Загружаем список категорий при открытии модалки
    useEffect(() => {
        if (open) {
            loadCategories();
        }
    }, [open]);

    const loadCategories = async () => {
        try {
            const response = await categories.getAll();
            setCategoriesList(response.data);
        } catch (err) {
            console.error("Ошибка загрузки категорий:", err);
            setError("Не удалось загрузить список категорий");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            // Проверяем тип файла
            if (selected.type !== "application/vnd.android.package-archive" &&
                !selected.name.endsWith('.apk')) {
                setError("Пожалуйста, выберите APK файл");
                return;
            }
            setFile(selected);
            setError("");
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            if (droppedFile.type !== "application/vnd.android.package-archive" &&
                !droppedFile.name.endsWith('.apk')) {
                setError("Пожалуйста, перетащите APK файл");
                return;
            }
            setFile(droppedFile);
            setError("");
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            name: "",
            url: "",
            short_descr: "",
            full_descr: "",
            price: 0,
            age_restriction: 0,
            category_id: 0
        });
        setFile(null);
        setError("");
    };

    const handleSubmit = async () => {
        if (!file) {
            setError("Пожалуйста, выберите APK файл");
            return;
        }

        if (!formData.name.trim()) {
            setError("Введите название приложения");
            return;
        }

        if (!formData.category_id) {
            setError("Выберите категорию");
            return;
        }

        if (!formData.short_descr.trim()) {
            setError("Введите краткое описание");
            return;
        }

        if (!formData.full_descr.trim()) {
            setError("Введите полное описание");
            return;
        }

        if (!formData.url.trim()) {
            setError("Введите URL приложения");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Создаем приложение через API
            const appData: AppCreate = {
                name: formData.name,
                url: formData.url,
                short_descr: formData.short_descr,
                full_descr: formData.full_descr,
                price: formData.price,
                age_restriction: formData.age_restriction,
                category_id: formData.category_id
            };

            await apps.create(appData);

            // Здесь можно добавить логику загрузки файла, если бэкенд поддерживает
            console.log("APK файл для загрузки:", file.name);

            // Закрываем модалку и сбрасываем форму
            onOpenChange(false);
            resetForm();

            // Можно показать уведомление об успехе
            alert("Приложение успешно создано!");

        } catch (err: any) {
            console.error("Ошибка создания приложения:", err);
            setError(err.message || "Ошибка при создании приложения");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        // Даем время на анимацию закрытия перед сбросом формы
        setTimeout(resetForm, 300);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl">Загрузить приложение</DialogTitle>
                    <DialogDescription>
                        Заполните информацию о приложении и загрузите APK-файл
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Основная информация */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Название приложения */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Название приложения *</Label>
                            <Input
                                id="name"
                                placeholder="Моё крутое приложение"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                maxLength={20}
                            />
                            <p className="text-xs text-muted-foreground">Макс. 20 символов</p>
                        </div>

                        {/* Категория */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Категория *</Label>
                            <Select
                                value={formData.category_id.toString()}
                                onValueChange={(value) => handleInputChange("category_id", parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите категорию" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoriesList.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* URL и цена */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* URL приложения */}
                        <div className="space-y-2">
                            <Label htmlFor="url">URL приложения *</Label>
                            <Input
                                id="url"
                                placeholder="https://example.com/app"
                                value={formData.url}
                                onChange={(e) => handleInputChange("url", e.target.value)}
                                maxLength={100}
                            />
                            <p className="text-xs text-muted-foreground">Макс. 100 символов</p>
                        </div>

                        {/* Цена */}
                        <div className="space-y-2">
                            <Label htmlFor="price">Цена ($)</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={(e) => handleInputChange("price", parseFloat(e.target.value) || 0)}
                            />
                        </div>
                    </div>

                    {/* Возрастное ограничение */}
                    <div className="space-y-2">
                        <Label htmlFor="age_restriction">Возрастное ограничение</Label>
                        <Select
                            value={formData.age_restriction.toString()}
                            onValueChange={(value) => handleInputChange("age_restriction", parseInt(value))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Выберите возрастное ограничение" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">0+ (Для всех возрастов)</SelectItem>
                                <SelectItem value="6">6+</SelectItem>
                                <SelectItem value="12">12+</SelectItem>
                                <SelectItem value="16">16+</SelectItem>
                                <SelectItem value="18">18+</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Описания */}
                    <div className="space-y-4">
                        {/* Краткое описание */}
                        <div className="space-y-2">
                            <Label htmlFor="short_descr">Краткое описание *</Label>
                            <Input
                                id="short_descr"
                                placeholder="Краткое описание приложения"
                                value={formData.short_descr}
                                onChange={(e) => handleInputChange("short_descr", e.target.value)}
                                maxLength={100}
                            />
                            <p className="text-xs text-muted-foreground">Макс. 100 символов</p>
                        </div>

                        {/* Полное описание */}
                        <div className="space-y-2">
                            <Label htmlFor="full_descr">Полное описание *</Label>
                            <Textarea
                                id="full_descr"
                                placeholder="Подробное описание функционала приложения..."
                                value={formData.full_descr}
                                onChange={(e) => handleInputChange("full_descr", e.target.value)}
                                rows={4}
                                maxLength={1000}
                            />
                            <p className="text-xs text-muted-foreground">Макс. 1000 символов</p>
                        </div>
                    </div>

                    {/* Зона загрузки файла */}
                    <div className="space-y-2">
                        <Label>APK-файл *</Label>
                        <div
                            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                file
                                    ? "border-violet-500 bg-violet-50"
                                    : "border-gray-300 hover:border-gray-400 bg-gray-50"
                            }`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                        >
                            {file ? (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Upload className="w-4 h-4 text-violet-600" />
                                        <span className="font-medium">{file.name}</span>
                                        <span className="text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} МБ)</span>
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6"
                                        onClick={() => setFile(null)}
                                        disabled={loading}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    <p className="text-sm text-gray-600 mb-1">
                                        Перетащите APK сюда или{" "}
                                        <label
                                            htmlFor="file-upload"
                                            className="text-violet-600 hover:text-violet-700 cursor-pointer underline"
                                        >
                                            выберите файл
                                        </label>
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Поддерживаются только .apk файлы
                                    </p>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept=".apk,application/vnd.android.package-archive"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        disabled={loading}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !file || !formData.name.trim() || !formData.category_id || !formData.short_descr.trim() || !formData.full_descr.trim() || !formData.url.trim()}
                        className="bg-violet-600 hover:bg-violet-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Создание...
                            </>
                        ) : (
                            "Создать приложение"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}