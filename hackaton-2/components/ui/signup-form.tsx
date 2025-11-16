// components/auth/signup-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useAuth } from '@/hooks/useAuth'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function SignupForm({
                               className,
                               ...props
                           }: React.ComponentProps<"div">) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>('')
    const { register } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const data = {
            login: formData.get('login') as string,
            email: formData.get('email') as string,
            name: formData.get('name') as string,
            password: formData.get('password') as string,
            confirmPassword: formData.get('confirm-password') as string,
            age: parseInt(formData.get('age') as string) || 0,
        }

        // Валидация
        if (data.password !== data.confirmPassword) {
            setError('Пароли не совпадают')
            setIsLoading(false)
            return
        }

        if (data.password.length < 6) {
            setError('Пароль должен быть не менее 6 символов')
            setIsLoading(false)
            return
        }

        try {
            await register({
                login: data.login,
                email: data.email,
                name: data.name,
                password: data.password,
                age: data.age,
            })
            router.push('/dashboard/user')
        } catch (err: any) {
            setError(err.message || 'Ошибка при регистрации')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Создай свой аккаунт</CardTitle>
                    <CardDescription>
                        Заполните форму для регистрации
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="name">Имя</FieldLabel>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Иван Иванов"
                                    required
                                    disabled={isLoading}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="login">Логин</FieldLabel>
                                <Input
                                    id="login"
                                    name="login"
                                    type="text"
                                    placeholder="ivan123"
                                    required
                                    disabled={isLoading}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">Почта</FieldLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="test@mail.ru"
                                    required
                                    disabled={isLoading}
                                />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="age">Возраст</FieldLabel>
                                <Input
                                    id="age"
                                    name="age"
                                    type="number"
                                    placeholder="18"
                                    min="0"
                                    max="120"
                                    disabled={isLoading}
                                />
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field>
                                    <FieldLabel htmlFor="password">Пароль</FieldLabel>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        disabled={isLoading}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="confirm-password">
                                        Подтверждение пароля
                                    </FieldLabel>
                                    <Input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type="password"
                                        required
                                        disabled={isLoading}
                                    />
                                </Field>
                            </div>
                            <FieldDescription>
                                Пароль должен быть не менее 6 символов
                            </FieldDescription>
                            <Field>
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? 'Регистрация...' : 'Создать аккаунт'}
                                </Button>
                                <FieldDescription className="text-center mt-4">
                                    Уже есть аккаунт?{' '}
                                    <Link
                                        href="/auth/login"
                                        className="underline underline-offset-4 hover:text-primary transition-colors"
                                    >
                                        Войти
                                    </Link>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}