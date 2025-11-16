// components/auth/login-form.tsx
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

export function LoginForm({
                              className,
                              ...props
                          }: React.ComponentProps<"div">) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>('')
    const { login } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const data = {
            login: formData.get('login') as string,
            password: formData.get('password') as string,
        }

        try {
            await login(data)
            router.push('/dashboard/user')
        } catch (err: any) {
            setError(err.message || 'Ошибка при входе')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Войти в аккаунт</CardTitle>
                    <CardDescription>
                        Введите свои данные для входа в аккаунт
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
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Пароль</FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Забыли пароль?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    disabled={isLoading}
                                />
                            </Field>
                            <Field>
                                <Button type="submit" disabled={isLoading} className="w-full">
                                    {isLoading ? 'Вход...' : 'Войти'}
                                </Button>
                                <Button variant="outline" type="button" className="w-full mt-2">
                                    Войти через VK
                                </Button>
                                <FieldDescription className="text-center mt-4">
                                    Еще нет аккаунта?{' '}
                                    <Link
                                        href="/auth/register"
                                        className="underline underline-offset-4 hover:text-primary transition-colors"
                                    >
                                        Зарегистрируйтесь!
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