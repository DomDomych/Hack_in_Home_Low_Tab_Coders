// src/lib/api.ts
import axios from 'axios';
import type {
    UserResponse,
    UserWithDetailsResponse,
    CategoryResponse,
    AppResponse,
    ReportResponse,
    UserCreate,
    UserUpdate,
    CategoryCreate,
    CategoryUpdate,
    AppCreate,
    AppUpdate,
    ReportCreate, UserRegister, UserOut, AuthResponse, UserLogin,
} from '@/types/api';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Интерцептор для обработки ошибок (опционально)
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const message = err.response?.data?.detail || err.message;
        return Promise.reject(new Error(message));
    }
);

export const auth = {
    register: (data: UserRegister) =>
        api.post<UserOut>('/auth/register', data),

    login: (data: UserLogin) =>
        api.post<AuthResponse>('/auth/login', data),

    getMe: () =>
        api.get<UserResponse>('/users/me'),
};


// ==================== USERS ====================
export const users = {
    create: (data: UserCreate) =>
        api.post<UserResponse>('/users', data),

    getAll: () =>
        api.get<UserResponse[]>('/users'),

    getById: (id: number) =>
        api.get<UserResponse>(`/users/${id}`),

    getWithDetails: (id: number) =>
        api.get<UserWithDetailsResponse>(`/users/${id}/details`),

    update: (id: number, data: UserUpdate) =>
        api.put<UserResponse>(`/users/${id}`, data),

    delete: (id: number) =>
        api.delete(`/users/${id}`),

    downloadApp: (userId: number, appId: number) =>
        api.post(`/users/${userId}/download_app/${appId}`),
};

// ==================== CATEGORIES ====================
export const categories = {
    create: (data: CategoryCreate) =>
        api.post<CategoryResponse>('/categories', data),

    getAll: () =>
        api.get<CategoryResponse[]>('/categories'),

    getById: (id: number) =>
        api.get<CategoryResponse>(`/categories/${id}`),

    update: (id: number, data: CategoryUpdate) =>
        api.put<CategoryResponse>(`/categories/${id}`, data),

    delete: (id: number) =>
        api.delete(`/categories/${id}`),

    getApps: (id: number) =>
        api.get<AppResponse[]>(`/categories/${id}/apps`),
};

// ==================== APPS ====================
export const apps = {
    create: (data: AppCreate) =>
        api.post<AppResponse>('/apps', data),

    getAll: () =>
        api.get<AppResponse[]>('/apps'),

    getById: (id: number) =>
        api.get<AppResponse>(`/apps/${id}`),

    update: (id: number, data: AppUpdate) =>
        api.put<AppResponse>(`/apps/${id}`, data),

    delete: (id: number) =>
        api.delete(`/apps/${id}`),

    getUsers: (id: number) =>
        api.get<UserResponse[]>(`/apps/${id}/users`),
};

// ==================== REPORTS ====================
export const reports = {
    create: (data: ReportCreate) =>
        api.post<ReportResponse>('/reports', data),

    getAll: () =>
        api.get<ReportResponse[]>('/reports'),

    getByUser: (userId: number) =>
        api.get<ReportResponse[]>(`/users/${userId}/reports`),

    getByApp: (appId: number) =>
        api.get<ReportResponse[]>(`/apps/${appId}/reports`),
};

export default api;