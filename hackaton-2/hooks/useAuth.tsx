'use client'

import { useState, useEffect, createContext, useContext } from 'react';
import { auth } from '@/lib/api';
import type { UserResponse, UserRegister, UserLogin } from '@/types/api';

interface AuthContextType {
    user: UserResponse | null;
    login: (data: UserLogin) => Promise<void>;
    register: (data: UserRegister) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const response = await auth.getMe();
                setUser(response.data);
            } catch (error) {
                localStorage.removeItem('access_token');
            }
        }
        setLoading(false);
    };

    const login = async (data: UserLogin) => {
        const response = await auth.login(data);
        localStorage.setItem('access_token', response.data.access_token);

        const userResponse = await auth.getMe();
        setUser(userResponse.data);
    };

    const register = async (data: UserRegister) => {
        const response = await auth.register(data);
        // После регистрации автоматически логиним пользователя
        await login({ login: data.login, password: data.password });
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
    {children}
    </AuthContext.Provider>
);
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}