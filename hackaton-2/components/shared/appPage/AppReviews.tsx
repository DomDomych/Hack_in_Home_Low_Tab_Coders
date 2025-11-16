"use client";

import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface Review {
    name: string;
    rating: number;
    text: string;
}

interface AppReviewsProps {
    reviews?: Review[];
}

export function AppReviews({ reviews = [] }: AppReviewsProps) {
    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");

    const hasReviews = reviews.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-10"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Отзывы пользователей</h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Отмена" : "Написать отзыв"}
                </Button>
            </div>

            {/* Форма отзыва */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                >
                    <Card className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-6 h-6 cursor-pointer transition-all ${
                                        star <= rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-muted stroke-muted-foreground"
                                    }`}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                            <span className="text-sm text-muted-foreground ml-2">
                {rating > 0 ? `${rating} из 5` : "Выберите оценку"}
              </span>
                        </div>
                        <Textarea
                            placeholder="Поделитесь своим мнением..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="mb-3"
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                                Отмена
                            </Button>
                            <Button
                                size="sm"
                                disabled={!text.trim() || rating === 0}
                                onClick={() => {
                                    // Здесь можно отправить отзыв
                                    setShowForm(false);
                                    setRating(0);
                                    setText("");
                                }}
                            >
                                Отправить
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Нет отзывов */}
            {!hasReviews && !showForm && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 bg-muted/30 rounded-xl"
                >
                    <p className="text-lg text-muted-foreground">
                        Будьте первым, кто оценит приложение!
                    </p>
                    <Button className="mt-3" onClick={() => setShowForm(true)}>
                        Написать отзыв
                    </Button>
                </motion.div>
            )}

            {/* Список отзывов */}
            {hasReviews && (
                <div className="space-y-4">
                    {reviews.map((review, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 + i * 0.1 }}
                        >
                            <Card className="p-4">
                                <div className="flex items-start gap-3">
                                    <Avatar>
                                        <AvatarFallback>{review.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium">{review.name}</p>
                                            <div className="flex">
                                                {[...Array(5)].map((_, s) => (
                                                    <Star
                                                        key={s}
                                                        className={`w-4 h-4 ${
                                                            s < review.rating
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "text-muted"
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{review.text}</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
}