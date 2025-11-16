from sqlalchemy import select
from typing import List, Optional
from database import SessionLocal, get_current_time
from models import User, App, Report, Category, user_downloaded_apps

class UserRepository:
    def __init__(self, session=None):
        self.session = session or SessionLocal()
        self._is_external_session = session is not None
    
    def create_user(self, login: str, email: str, name: str, password: str, age: int = 0) -> User:
        """Создание нового пользователя"""
        user = User(login=login, email=email, name=name, password=password, age=age)
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Получение пользователя по ID"""
        return self.session.get(User, user_id)
    
    def get_all_users(self) -> List[User]:
        """Получение всех пользователей"""
        stmt = select(User).order_by(User.created_at)
        result = self.session.execute(stmt)
        return list(result.scalars().all())
    
    def update_user(self, user_id: int, **kwargs) -> Optional[User]:
        """Обновление данных пользователя"""
        user = self.get_user_by_id(user_id)
        if user:
            for key, value in kwargs.items():
                if hasattr(user, key):
                    setattr(user, key, value)
            user.updated_at = get_current_time()
            self.session.commit()
            self.session.refresh(user)
        return user
    
    def delete_user(self, user_id: int) -> bool:
        """Удаление пользователя"""
        user = self.get_user_by_id(user_id)
        if user:
            self.session.delete(user)
            self.session.commit()
            return True
        return False
    
    def add_downloaded_app(self, user_id: int, app_id: int) -> bool:
        """Добавление приложения в список скачанных пользователем"""
        user = self.get_user_by_id(user_id)
        app = self.session.get(App, app_id)
        
        if user and app:
            if app not in user.downloaded_apps:
                user.downloaded_apps.append(app)
                self.session.commit()
                return True
        return False
    
    def get_downloaded_apps(self, user_id: int) -> List[App]:
        """Получение списка скачанных приложений пользователя"""
        user = self.get_user_by_id(user_id)
        if user:
            return user.downloaded_apps
        return []
    
    def close(self):
        """Закрытие сессии"""
        if not self._is_external_session:
            self.session.close()
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()
        
    def get_user_by_login(self, login: str) -> Optional[User]:
        """Получение пользователя по логину"""
        stmt = select(User).where(User.login == login)
        result = self.session.execute(stmt)
        return result.scalar_one_or_none()

    def get_user_by_email(self, email: str) -> Optional[User]:
        """Получение пользователя по email"""
        stmt = select(User).where(User.email == email)
        result = self.session.execute(stmt)
        return result.scalar_one_or_none()

class CategoryRepository:
    def __init__(self, session=None):
        self.session = session or SessionLocal()
        self._is_external_session = session is not None
    
    def create_category(self, name: str) -> Category:
        """Создание новой категории"""
        category = Category(name=name)
        self.session.add(category)
        self.session.commit()
        self.session.refresh(category)
        return category
    
    def get_category_by_id(self, category_id: int) -> Optional[Category]:
        """Получение категории по ID"""
        return self.session.get(Category, category_id)
    
    def get_all_categories(self) -> List[Category]:
        """Получение всех категорий"""
        stmt = select(Category).order_by(Category.name)
        result = self.session.execute(stmt)
        return list(result.scalars().all())
    
    def update_category(self, category_id: int, **kwargs) -> Optional[Category]:
        """Обновление данных категории"""
        category = self.get_category_by_id(category_id)
        if category:
            for key, value in kwargs.items():
                if hasattr(category, key):
                    setattr(category, key, value)
            self.session.commit()
            self.session.refresh(category)
        return category
    
    def delete_category(self, category_id: int) -> bool:
        """Удаление категории"""
        category = self.get_category_by_id(category_id)
        if category:
            self.session.delete(category)
            self.session.commit()
            return True
        return False
    
    def close(self):
        """Закрытие сессии"""
        if not self._is_external_session:
            self.session.close()
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()

class AppsRepository:
    def __init__(self, session=None):
        self.session = session or SessionLocal()
        self._is_external_session = session is not None
    
    def create_app(self, name: str, price: float, url: str, short_descr: str, full_descr: str, category_id: int, age_restriction: int = 0) -> App:
        """Создание нового приложения"""
        app = App(
            name=name, 
            url=url, 
            short_descr=short_descr, 
            price=price, 
            full_descr=full_descr, 
            category_id=category_id,
            age_restriction=age_restriction
        )
        self.session.add(app)
        self.session.commit()
        self.session.refresh(app)
        return app
    
    def get_app_by_id(self, app_id: int) -> Optional[App]:
        """Получение приложения по ID"""
        return self.session.get(App, app_id)
    
    def get_all_apps(self) -> List[App]:
        """Получение всех приложений"""
        stmt = select(App).order_by(App.name)
        result = self.session.execute(stmt)
        return list(result.scalars().all())
    
    def get_apps_by_category(self, category_id: int) -> List[App]:
        """Получение приложений по категории"""
        stmt = select(App).where(App.category_id == category_id).order_by(App.name)
        result = self.session.execute(stmt)
        return list(result.scalars().all())
    
    def update_app(self, app_id: int, **kwargs) -> Optional[App]:
        """Обновление данных приложения"""
        app = self.get_app_by_id(app_id)
        if app:
            for key, value in kwargs.items():
                if hasattr(app, key):
                    setattr(app, key, value)
            self.session.commit()
            self.session.refresh(app)
        return app
    
    def delete_app(self, app_id: int) -> bool:
        """Удаление приложения"""
        app = self.get_app_by_id(app_id)
        if app:
            self.session.delete(app)
            self.session.commit()
            return True
        return False
    
    def get_users_downloaded_app(self, app_id: int) -> List[User]:
        """Получение пользователей, скачавших приложение"""
        app = self.get_app_by_id(app_id)
        if app:
            return app.downloaded_by_users
        return []
    
    def close(self):
        """Закрытие сессии"""
        if not self._is_external_session:
            self.session.close()
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()

class ReportRepository:
    def __init__(self, session=None):
        self.session = session or SessionLocal()
        self._is_external_session = session is not None
    
    def create_report(self, user_id: int, app_id: int, text: str, rating: Optional[float] = None) -> Report:
        """Создание нового отчета"""
        report = Report(user_id=user_id, app_id=app_id, text=text, rating=rating)
        self.session.add(report)
        self.session.commit()
        self.session.refresh(report)
        return report
    
    def get_report_by_id(self, report_id: int) -> Optional[Report]:
        """Получение отчета по ID"""
        return self.session.get(Report, report_id)
    
    def get_all_reports(self) -> List[Report]:
        """Получение всех отчетов"""
        stmt = select(Report).order_by(Report.id)
        result = self.session.execute(stmt)
        return list(result.scalars().all())
    
    def get_reports_by_user(self, user_id: int) -> List[Report]:
        """Получение всех отчетов пользователя"""
        stmt = select(Report).where(Report.user_id == user_id).order_by(Report.id)
        result = self.session.execute(stmt)
        return list(result.scalars().all())
    
    def get_reports_by_app(self, app_id: int) -> List[Report]:
        """Получение всех отчетов для приложения"""
        stmt = select(Report).where(Report.app_id == app_id).order_by(Report.id)
        result = self.session.execute(stmt)
        return list(result.scalars().all())
    
    def close(self):
        """Закрытие сессии"""
        if not self._is_external_session:
            self.session.close()
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()