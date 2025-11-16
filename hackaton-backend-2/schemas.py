from pydantic import BaseModel, EmailStr, Field, validator
from typing import List, Optional
from datetime import datetime

# Схемы для пользователей
class UserBase(BaseModel):
    login: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=50)
    age: int = Field(0, ge=0, le=120)

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=50)

    @validator('password')
    def password_length(cls, v):
        if len(v) > 50:
            raise ValueError('Пароль не может быть длиннее 50 символов')
        # Дополнительная проверка для UTF-8 символов
        if len(v.encode('utf-8')) > 72:
            raise ValueError('Пароль слишком длинный. Используйте более короткий пароль.')
        return v

class UserUpdate(BaseModel):
    login: Optional[str] = Field(None, min_length=3, max_length=50)
    email: Optional[EmailStr] = None
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    age: Optional[int] = Field(None, ge=0, le=120)
    balance: Optional[float] = None
    count_inputs: Optional[int] = None

class UserResponse(UserBase):
    id: int
    balance: float
    count_inputs: int
    created_at: datetime
    updated_at: datetime
    downloaded_apps: List[int] = []  # Теперь список ID приложений

    class Config:
        from_attributes = True

# Схемы для аутентификации
class UserLogin(BaseModel):
    login: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6, max_length=50)

    @validator('password')
    def password_length(cls, v):
        if len(v) > 50:
            raise ValueError('Пароль не может быть длиннее 50 символов')
        if len(v.encode('utf-8')) > 72:
            raise ValueError('Пароль слишком длинный. Используйте более короткий пароль.')
        return v

class UserRegister(BaseModel):
    login: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    name: str = Field(..., min_length=1, max_length=50)
    password: str = Field(..., min_length=6, max_length=50)
    age: int = Field(0, ge=0, le=120)

    @validator('password')
    def password_length(cls, v):
        if len(v) > 50:
            raise ValueError('Пароль не может быть длиннее 50 символов')
        if len(v.encode('utf-8')) > 72:
            raise ValueError('Пароль слишком длинный. Используйте более короткий пароль.')
        return v

class Token(BaseModel):
    access_token: str
    token_type: str

class UserOut(BaseModel):
    id: int
    login: str
    email: EmailStr
    name: str
    age: int
    created_at: datetime

    class Config:
        from_attributes = True

# Схемы для категорий
class CategoryBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=50)

class CategoryResponse(CategoryBase):
    id: int

    class Config:
        from_attributes = True

# Схемы для приложений
class AppBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=20)
    url: str = Field(..., min_length=1, max_length=100)
    short_descr: str = Field(..., min_length=1, max_length=100)
    full_descr: str = Field(..., min_length=1, max_length=1000)
    price: float = Field(0, ge=0)
    age_restriction: int = Field(0, ge=0)
    category_id: int

class AppCreate(AppBase):
    pass

class AppUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=20)
    url: Optional[str] = Field(None, min_length=1, max_length=100)
    short_descr: Optional[str] = Field(None, min_length=1, max_length=100)
    full_descr: Optional[str] = Field(None, min_length=1, max_length=1000)
    price: Optional[float] = Field(None, ge=0)
    downloads: Optional[int] = Field(None, ge=0)
    rating: Optional[float] = Field(None, ge=0, le=5)
    age_restriction: Optional[int] = Field(None, ge=0)
    category_id: Optional[int] = None

class AppResponse(AppBase):
    id: int
    downloads: int
    rating: float
    downloaded_by_users: List[int] = []  # Список ID пользователей

    class Config:
        from_attributes = True

# Схемы для отчетов
class ReportBase(BaseModel):
    text: str = Field(..., min_length=1, max_length=500)
    rating: Optional[float] = Field(None, ge=0, le=5)
    app_id: int

class ReportCreate(ReportBase):
    user_id: int

class ReportResponse(ReportBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# Схемы с расширенной информацией
class AppWithDetailsResponse(AppResponse):
    category: CategoryResponse

class UserWithDetailsResponse(UserResponse):
    downloaded_apps_details: List[AppResponse] = []

class ReportWithDetailsResponse(ReportResponse):
    author: UserResponse
    app_rep: AppResponse