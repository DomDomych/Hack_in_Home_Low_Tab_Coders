from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from contextlib import asynccontextmanager
from typing import List
from datetime import datetime
import uvicorn
from auth import router as auth_router
from database import create_tables, SessionLocal, engine, check_database_connection
from repositories import UserRepository, AppsRepository, ReportRepository, CategoryRepository
from schemas import (
    UserCreate, UserResponse, UserUpdate, 
    AppCreate, AppResponse, AppUpdate,
    ReportCreate, ReportResponse,
    CategoryCreate, CategoryResponse, CategoryUpdate,
    UserWithDetailsResponse, AppWithDetailsResponse
)
from sqlalchemy import text
from security import hash_password
from auth import get_current_user
import models

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup code
    create_tables()
    if check_database_connection():
        print("🚀 Сервер запущен и готов принимать запросы!")
        print("📊 База данных инициализирована")
        print("🌐 API доступно по адресу: http://localhost:8000/api")
        print("📚 Документация: http://localhost:8000/api/docs")
        print("📖 ReDoc: http://localhost:8000/api/redoc")
    else:
        print("❌ Сервер запущен, но есть проблемы с БД")
    yield
    # Shutdown code
    print("🛑 Сервер останавливается")

# Создаем FastAPI приложение с префиксом /api
app = FastAPI(
    title="App Store API",
    description="API для управления пользователями, приложениями, категориями и отчетами",
    version="1.0.0",
    lifespan=lifespan,
    docs_url=None,
    redoc_url=None,
    openapi_url="/api/openapi.json"
)
app.include_router(auth_router, prefix="/api/auth")

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency для получения сессии БД
from auth import get_db

def get_user_repository(db = Depends(get_db)):
    return UserRepository(db)

def get_app_repository(db = Depends(get_db)):
    return AppsRepository(db)

def get_report_repository(db = Depends(get_db)):
    return ReportRepository(db)

def get_category_repository(db = Depends(get_db)):
    return CategoryRepository(db)

# Кастомные эндпоинты для документации с префиксом /api
@app.get("/api/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url="/api/openapi.json",
        title="App Store API - Документация",
        swagger_favicon_url="https://fastapi.tiangolo.com/img/favicon.png"
    )

@app.get("/api/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url="/api/openapi.json",
        title="App Store API - Документация",
        redoc_favicon_url="https://fastapi.tiangolo.com/img/favicon.png"
    )

@app.get("/api/users/me", response_model=UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        login=current_user.login,
        email=current_user.email,
        name=current_user.name,
        age=current_user.age,
        balance=current_user.balance,
        count_inputs=current_user.count_inputs,
        created_at=current_user.created_at,
        updated_at=current_user.updated_at,
        downloaded_apps=[app.id for app in current_user.downloaded_apps],
    )

# Root endpoint с редиректом на документацию API
@app.get("/")
def read_root():
    return {
        "message": "Добро пожаловать в App Store API!",
        "status": "Сервер работает и ожидает запросы",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "api_root": "/api",
            "documentation": "/api/docs",
            "redoc": "/api/redoc",
            "health": "/api/health"
        }
    }

# API Root endpoint
@app.get("/api")
def api_root():
    return {
        "message": "App Store API",
        "version": "1.0.0",
        "status": "active",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "users": "/api/users",
            "categories": "/api/categories",
            "apps": "/api/apps", 
            "reports": "/api/reports",
            "docs": "/api/docs",
            "health": "/api/health"
        }
    }

# Health check endpoint
@app.get("/api/health")
def health_check():
    """Проверка статуса сервера и БД"""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# ========== USER ENDPOINTS ==========

@app.post("/api/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user: UserCreate, 
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Создание нового пользователя"""
    try:
        new_user = user_repo.create_user(
        login=user.login,
        email=user.email,
        name=user.name,
        password=hash_password(user.password),
        age=user.age
)
        print(f"✅ Создан пользователь: {new_user.name} (ID: {new_user.id})")
        return UserResponse(
            id=new_user.id,
            login=new_user.login,
            email=new_user.email,
            name=new_user.name,
            age=new_user.age,
            balance=new_user.balance,
            count_inputs=new_user.count_inputs,
            created_at=new_user.created_at,
            updated_at=new_user.updated_at,
            downloaded_apps=[app.id for app in new_user.downloaded_apps]
        )
    except Exception as e:
        print(f"❌ Ошибка создания пользователя: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Ошибка при создании пользователя: {str(e)}"
        )

@app.get("/api/users", response_model=List[UserResponse])
def get_all_users(user_repo: UserRepository = Depends(get_user_repository)):
    """Получение всех пользователей"""
    users = user_repo.get_all_users()
    print(f"📊 Запрос всех пользователей. Найдено: {len(users)}")
    return [
        UserResponse(
            id=user.id,
            login=user.login,
            email=user.email,
            name=user.name,
            age=user.age,
            balance=user.balance,
            count_inputs=user.count_inputs,
            created_at=user.created_at,
            updated_at=user.updated_at,
            downloaded_apps=[app.id for app in user.downloaded_apps]
        ) for user in users
    ]

@app.get("/api/users/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int, 
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Получение пользователя по ID"""
    user = user_repo.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    print(f"📄 Запрос пользователя ID: {user_id} - {user.name}")
    return UserResponse(
        id=user.id,
        login=user.login,
        email=user.email,
        name=user.name,
        age=user.age,
        balance=user.balance,
        count_inputs=user.count_inputs,
        created_at=user.created_at,
        updated_at=user.updated_at,
        downloaded_apps=[app.id for app in user.downloaded_apps]
    )

@app.get("/api/users/{user_id}/details", response_model=UserWithDetailsResponse)
def get_user_with_details(
    user_id: int,
    user_repo: UserRepository = Depends(get_user_repository),
    app_repo: AppsRepository = Depends(get_app_repository)
):
    """Получение пользователя с детальной информацией о скачанных приложениях"""
    user = user_repo.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    downloaded_apps_details = []
    for app in user.downloaded_apps:
        downloaded_apps_details.append(
            AppResponse(
                id=app.id,
                name=app.name,
                url=app.url,
                short_descr=app.short_descr,
                full_descr=app.full_descr,
                price=app.price,
                age_restriction=app.age_restriction,
                category_id=app.category_id,
                downloads=app.downloads,
                rating=app.rating,
                downloaded_by_users=[user.id for user in app.downloaded_by_users]
            )
        )
    
    return UserWithDetailsResponse(
        id=user.id,
        login=user.login,
        email=user.email,
        name=user.name,
        age=user.age,
        balance=user.balance,
        count_inputs=user.count_inputs,
        created_at=user.created_at,
        updated_at=user.updated_at,
        downloaded_apps=[app.id for app in user.downloaded_apps],
        downloaded_apps_details=downloaded_apps_details
    )

@app.put("/api/users/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Обновление данных пользователя"""
    user = user_repo.update_user(user_id, **user_update.dict(exclude_unset=True))
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    print(f"✏️ Обновлен пользователь ID: {user_id} - {user.name}")
    return UserResponse(
        id=user.id,
        login=user.login,
        email=user.email,
        name=user.name,
        age=user.age,
        balance=user.balance,
        count_inputs=user.count_inputs,
        created_at=user.created_at,
        updated_at=user.updated_at,
        downloaded_apps=[app.id for app in user.downloaded_apps]
    )

@app.delete("/api/users/{user_id}")
def delete_user(
    user_id: int,
    user_repo: UserRepository = Depends(get_user_repository)
):
    """Удаление пользователя"""
    success = user_repo.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    print(f"🗑️ Удален пользователь ID: {user_id}")
    return {"message": "Пользователь успешно удален"}

# ========== CATEGORY ENDPOINTS ==========

@app.post("/api/categories", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(
    category: CategoryCreate,
    category_repo: CategoryRepository = Depends(get_category_repository)
):
    """Создание новой категории"""
    try:
        new_category = category_repo.create_category(name=category.name)
        print(f"✅ Создана категория: {new_category.name} (ID: {new_category.id})")
        return new_category
    except Exception as e:
        print(f"❌ Ошибка создания категории: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Ошибка при создании категории: {str(e)}"
        )

@app.get("/api/categories", response_model=List[CategoryResponse])
def get_all_categories(category_repo: CategoryRepository = Depends(get_category_repository)):
    """Получение всех категорий"""
    categories = category_repo.get_all_categories()
    print(f"📊 Запрос всех категорий. Найдено: {len(categories)}")
    return categories

@app.get("/api/categories/{category_id}", response_model=CategoryResponse)
def get_category(
    category_id: int,
    category_repo: CategoryRepository = Depends(get_category_repository)
):
    """Получение категории по ID"""
    category = category_repo.get_category_by_id(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    print(f"📄 Запрос категории ID: {category_id} - {category.name}")
    return category

@app.put("/api/categories/{category_id}", response_model=CategoryResponse)
def update_category(
    category_id: int,
    category_update: CategoryUpdate,
    category_repo: CategoryRepository = Depends(get_category_repository)
):
    """Обновление данных категории"""
    category = category_repo.update_category(category_id, **category_update.dict(exclude_unset=True))
    if not category:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    print(f"✏️ Обновлена категория ID: {category_id} - {category.name}")
    return category

@app.delete("/api/categories/{category_id}")
def delete_category(
    category_id: int,
    category_repo: CategoryRepository = Depends(get_category_repository)
):
    """Удаление категории"""
    success = category_repo.delete_category(category_id)
    if not success:
        raise HTTPException(status_code=404, detail="Категория не найдена")
    print(f"🗑️ Удалена категория ID: {category_id}")
    return {"message": "Категория успешно удалена"}

# ========== APP ENDPOINTS ==========

@app.post("/api/apps", response_model=AppResponse, status_code=status.HTTP_201_CREATED)
def create_app(
    app: AppCreate,
    app_repo: AppsRepository = Depends(get_app_repository)
):
    """Создание нового приложения"""
    try:
        new_app = app_repo.create_app(
            name=app.name,
            price=app.price,
            url=app.url,
            short_descr=app.short_descr,
            full_descr=app.full_descr,
            category_id=app.category_id,
            age_restriction=app.age_restriction
        )
        print(f"✅ Создано приложение: {new_app.name} (ID: {new_app.id})")
        return AppResponse(
            id=new_app.id,
            name=new_app.name,
            url=new_app.url,
            short_descr=new_app.short_descr,
            full_descr=new_app.full_descr,
            price=new_app.price,
            age_restriction=new_app.age_restriction,
            category_id=new_app.category_id,
            downloads=new_app.downloads,
            rating=new_app.rating,
            downloaded_by_users=[user.id for user in new_app.downloaded_by_users]
        )
    except Exception as e:
        print(f"❌ Ошибка создания приложения: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Ошибка при создании приложения: {str(e)}"
        )

@app.get("/api/apps", response_model=List[AppResponse])
def get_all_apps(app_repo: AppsRepository = Depends(get_app_repository)):
    """Получение всех приложений"""
    apps = app_repo.get_all_apps()
    print(f"📱 Запрос всех приложений. Найдено: {len(apps)}")
    return [
        AppResponse(
            id=app.id,
            name=app.name,
            url=app.url,
            short_descr=app.short_descr,
            full_descr=app.full_descr,
            price=app.price,
            age_restriction=app.age_restriction,
            category_id=app.category_id,
            downloads=app.downloads,
            rating=app.rating,
            downloaded_by_users=[user.id for user in app.downloaded_by_users]
        ) for app in apps
    ]

@app.get("/api/apps/{app_id}", response_model=AppResponse)
def get_app(
    app_id: int,
    app_repo: AppsRepository = Depends(get_app_repository)
):
    """Получение приложения по ID"""
    app = app_repo.get_app_by_id(app_id)
    if not app:
        raise HTTPException(status_code=404, detail="Приложение не найдено")
    print(f"📄 Запрос приложения ID: {app_id} - {app.name}")
    return AppResponse(
        id=app.id,
        name=app.name,
        url=app.url,
        short_descr=app.short_descr,
        full_descr=app.full_descr,
        price=app.price,
        age_restriction=app.age_restriction,
        category_id=app.category_id,
        downloads=app.downloads,
        rating=app.rating,
        downloaded_by_users=[user.id for user in app.downloaded_by_users]
    )

@app.get("/api/categories/{category_id}/apps", response_model=List[AppResponse])
def get_apps_by_category(
    category_id: int,
    app_repo: AppsRepository = Depends(get_app_repository)
):
    """Получение приложений по категории"""
    apps = app_repo.get_apps_by_category(category_id)
    print(f"📱 Запрос приложений категории ID: {category_id}. Найдено: {len(apps)}")
    return [
        AppResponse(
            id=app.id,
            name=app.name,
            url=app.url,
            short_descr=app.short_descr,
            full_descr=app.full_descr,
            price=app.price,
            age_restriction=app.age_restriction,
            category_id=app.category_id,
            downloads=app.downloads,
            rating=app.rating,
            downloaded_by_users=[user.id for user in app.downloaded_by_users]
        ) for app in apps
    ]

@app.put("/api/apps/{app_id}", response_model=AppResponse)
def update_app(
    app_id: int,
    app_update: AppUpdate,
    app_repo: AppsRepository = Depends(get_app_repository)
):
    """Обновление данных приложения"""
    app = app_repo.update_app(app_id, **app_update.dict(exclude_unset=True))
    if not app:
        raise HTTPException(status_code=404, detail="Приложение не найдено")
    print(f"✏️ Обновлено приложение ID: {app_id} - {app.name}")
    return AppResponse(
        id=app.id,
        name=app.name,
        url=app.url,
        short_descr=app.short_descr,
        full_descr=app.full_descr,
        price=app.price,
        age_restriction=app.age_restriction,
        category_id=app.category_id,
        downloads=app.downloads,
        rating=app.rating,
        downloaded_by_users=[user.id for user in app.downloaded_by_users]
    )

@app.delete("/api/apps/{app_id}")
def delete_app(
    app_id: int,
    app_repo: AppsRepository = Depends(get_app_repository)
):
    """Удаление приложения"""
    success = app_repo.delete_app(app_id)
    if not success:
        raise HTTPException(status_code=404, detail="Приложение не найдено")
    print(f"🗑️ Удалено приложение ID: {app_id}")
    return {"message": "Приложение успешно удалено"}

@app.get("/api/apps/{app_id}/users", response_model=List[UserResponse])
def get_users_downloaded_app(
    app_id: int,
    app_repo: AppsRepository = Depends(get_app_repository)
):
    """Получение пользователей, скачавших приложение"""
    users = app_repo.get_users_downloaded_app(app_id)
    print(f"👥 Запрос пользователей приложения ID: {app_id}. Найдено: {len(users)}")
    return [
        UserResponse(
            id=user.id,
            login=user.login,
            email=user.email,
            name=user.name,
            age=user.age,
            balance=user.balance,
            count_inputs=user.count_inputs,
            created_at=user.created_at,
            updated_at=user.updated_at,
            downloaded_apps=[app.id for app in user.downloaded_apps]
        ) for user in users
    ]

# ========== REPORT ENDPOINTS ==========

@app.post("/api/reports", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(
    report: ReportCreate,
    report_repo: ReportRepository = Depends(get_report_repository)
):
    """Создание нового отчета"""
    try:
        new_report = report_repo.create_report(
            user_id=report.user_id,
            app_id=report.app_id,
            text=report.text,
            rating=report.rating
        )
        print(f"✅ Создан отчет ID: {new_report.id} для пользователя {report.user_id} и приложения {report.app_id}")
        return new_report
    except Exception as e:
        print(f"❌ Ошибка создания отчета: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=f"Ошибка при создании отчета: {str(e)}"
        )

@app.get("/api/reports", response_model=List[ReportResponse])
def get_all_reports(report_repo: ReportRepository = Depends(get_report_repository)):
    """Получение всех отчетов"""
    reports = report_repo.get_all_reports()
    print(f"📊 Запрос всех отчетов. Найдено: {len(reports)}")
    return reports

@app.get("/api/users/{user_id}/reports", response_model=List[ReportResponse])
def get_user_reports(
    user_id: int,
    report_repo: ReportRepository = Depends(get_report_repository)
):
    """Получение всех отчетов пользователя"""
    reports = report_repo.get_reports_by_user(user_id)
    print(f"📄 Запрос отчетов пользователя ID: {user_id}. Найдено: {len(reports)}")
    return reports

@app.get("/api/apps/{app_id}/reports", response_model=List[ReportResponse])
def get_app_reports(
    app_id: int,
    report_repo: ReportRepository = Depends(get_report_repository)
):
    """Получение всех отчетов для приложения"""
    reports = report_repo.get_reports_by_app(app_id)
    print(f"📄 Запрос отчетов приложения ID: {app_id}. Найдено: {len(reports)}")
    return reports

# Бизнес-эндпоинт
@app.post("/api/users/{user_id}/download_app/{app_id}")
def download_app(
    user_id: int,
    app_id: int,
    user_repo: UserRepository = Depends(get_user_repository),
    app_repo: AppsRepository = Depends(get_app_repository)
):
    """Пользователь скачивает приложение"""
    user = user_repo.get_user_by_id(user_id)
    app = app_repo.get_app_by_id(app_id)
    
    if not user or not app:
        raise HTTPException(status_code=404, detail="Пользователь или приложение не найдены")
    
    if app.price > user.balance:
        raise HTTPException(status_code=400, detail="Недостаточно средств")
    
    # Проверяем, не скачано ли приложение уже
    if app in user.downloaded_apps:
        return {"message": "Приложение уже скачано"}
    
    # Обновляем баланс пользователя
    user_repo.update_user(user_id, balance=user.balance - app.price)
    
    # Увеличиваем счетчик загрузок
    app_repo.update_app(app_id, downloads=app.downloads + 1)
    
    # Добавляем приложение в список скачанных пользователем
    user_repo.add_downloaded_app(user_id, app_id)
    
    # Увеличиваем счетчик входов пользователя
    user_repo.update_user(user_id, count_inputs=user.count_inputs + 1)
    
    print(f"📥 Пользователь {user.name} скачал приложение {app.name}")
    return {"message": f"Приложение {app.name} успешно скачано"}

if __name__ == "__main__":
    # Правильный запуск с поддержкой reload
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)