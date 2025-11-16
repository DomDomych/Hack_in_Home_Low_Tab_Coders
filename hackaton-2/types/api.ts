export interface UserResponse {
    id: number;
    login: string;
    email: string;
    name: string;
    age: number;
    balance: number;
    count_inputs: number;
    created_at: string;
    updated_at: string;
    downloaded_apps: number[];
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export interface UserOut {
    id: number;
    login: string;
    email: string;
    name: string;
    age: number;
    created_at: string;
}

export interface UserRegister {
    login: string;
    email: string;
    name: string;
    password: string;
    age?: number;
}

export interface UserLogin {
    login: string;
    password: string;
}

export interface UserWithDetailsResponse extends UserResponse {
    downloaded_apps_details: AppResponse[];
}

export interface CategoryResponse {
    id: number;
    name: string;
}

export interface AppResponse {
    id: number;
    name: string;
    url: string;
    short_descr: string;
    full_descr: string;
    price: number;
    age_restriction: number;
    category_id: number;
    downloads: number;
    rating: number;
    downloaded_by_users: number[];
}

export interface AppWithDetailsResponse extends AppResponse {
    category: CategoryResponse;
}

export interface ReportResponse {
    id: number;
    user_id: number;
    app_id: number;
    text: string;
    rating: number | null;
}

export interface UserCreate {
    login: string;
    email: string;
    name: string;
    password: string;
    age?: number;
}

export interface UserUpdate {
    login?: string;
    email?: string;
    name?: string;
    age?: number;
    balance?: number;
    count_inputs?: number;
}

export interface CategoryCreate {
    name: string;
}

export interface CategoryUpdate {
    name?: string;
}

export interface AppCreate {
    name: string;
    url: string;
    short_descr: string;
    full_descr: string;
    price?: number;
    age_restriction?: number;
    category_id: number;
}

export interface AppUpdate {
    name?: string;
    url?: string;
    short_descr?: string;
    full_descr?: string;
    price?: number;
    downloads?: number;
    rating?: number;
    age_restriction?: number;
    category_id?: number;
}

export interface ReportCreate {
    user_id: number;
    app_id: number;
    text: string;
    rating?: number;
}