from sqlalchemy import String, Float, Integer, JSON, ForeignKey, Table, Column
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional
from datetime import datetime
from database import Base, get_current_time

# Ассоциативная таблица для связи многие-ко-многим между User и App
user_downloaded_apps = Table(
    'user_downloaded_apps',
    Base.metadata,
    Column('user_id', ForeignKey('users.id'), primary_key=True),
    Column('app_id', ForeignKey('apps.id'), primary_key=True)
)

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    login: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(50))
    password: Mapped[str] = mapped_column(String(100))  # Хеш пароля всегда фиксированной длины
    balance: Mapped[Optional[float]] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(default=get_current_time)
    updated_at: Mapped[datetime] = mapped_column(default=get_current_time)
    age: Mapped[int] = mapped_column(Integer, default=0)
    count_inputs: Mapped[int] = mapped_column(Integer, default=0)
    
    # Связь многие-ко-многим с приложениями через ассоциативную таблицу
    downloaded_apps: Mapped[List["App"]] = relationship(
        "App", 
        secondary=user_downloaded_apps, 
        back_populates="downloaded_by_users"
    )
    reports: Mapped[List["Report"]] = relationship("Report", back_populates="author")

class Category(Base):
    __tablename__ = "categories"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    
    apps: Mapped[List["App"]] = relationship("App", back_populates="category")

class App(Base):
    __tablename__ = "apps"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    url: Mapped[str] = mapped_column(String(100), unique=True)
    short_descr: Mapped[str] = mapped_column(String(100))
    full_descr: Mapped[str] = mapped_column(String(1000))
    price: Mapped[float] = mapped_column(Float, default=0)
    downloads: Mapped[int] = mapped_column(Integer, default=0)
    rating: Mapped[float] = mapped_column(Float, default=5)
    age_restriction: Mapped[int] = mapped_column(Integer, default=0)
    
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    category: Mapped["Category"] = relationship("Category", back_populates="apps")
    
    # Связь многие-ко-многим с пользователями через ассоциативную таблицу
    downloaded_by_users: Mapped[List["User"]] = relationship(
        "User", 
        secondary=user_downloaded_apps, 
        back_populates="downloaded_apps"
    )
    reports: Mapped[List["Report"]] = relationship("Report", back_populates="app_rep")

class Report(Base):
    __tablename__ = "reports"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    app_id: Mapped[int] = mapped_column(ForeignKey("apps.id"))
    text: Mapped[str] = mapped_column(String(500))
    rating: Mapped[Optional[float]] = mapped_column(Float)
    
    app_rep: Mapped["App"] = relationship("App", back_populates="reports")
    author: Mapped["User"] = relationship("User", back_populates="reports")