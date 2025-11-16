from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from datetime import datetime
import pytz

# Московский регион для времени
MOSCOW_TZ = pytz.timezone('Europe/Moscow')

# Базовый класс для моделей
class Base(DeclarativeBase):
    pass

def get_current_time():
    return datetime.now(MOSCOW_TZ)

# Настройка подключения к базе данных
DATABASE_URL = "postgresql+psycopg2://postgres:supersecret123@localhost:5432/hackaton_db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def create_tables():
    """Создание всех таблиц в базе данных"""
    Base.metadata.create_all(engine)
    print("✅ Таблицы созданы успешно!")

def check_database_connection():
    """Проверка подключения к БД"""
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("✅ Подключение к базе данных установлено")
        return True
    except Exception as e:
        print(f"❌ Ошибка подключения к БД: {e}")
        return False

def explore_database():
    """Функция для исследования структуры БД"""
    inspector = inspect(engine)
    
    print("\n📊 СТРУКТУРА БАЗЫ ДАННЫХ")
    print("=" * 50)
    
    tables = inspector.get_table_names()
    print(f"Найдено таблиц: {len(tables)}")
    
    for table_name in tables:
        print(f"\n📋 Таблица: {table_name}")
        print("-" * 30)
        
        columns = inspector.get_columns(table_name)
        for column in columns:
            print(f"  ├─ {column['name']}: {column['type']}")
        
        pk = inspector.get_pk_constraint(table_name)
        if pk['constrained_columns']:
            print(f"  ├─ Первичный ключ: {pk['constrained_columns']}")
        
        fks = inspector.get_foreign_keys(table_name)
        for fk in fks:
            print(f"  ├─ Внешний ключ: {fk['constrained_columns']} -> {fk['referred_table']}.{fk['referred_columns']}")

def get_table_stats():
    """Получаем статистику по таблицам"""
    with engine.connect() as conn:
        tables = inspect(engine).get_table_names()
        
        print("\n📈 СТАТИСТИКА ТАБЛИЦ")
        print("=" * 50)
        
        for table in tables:
            result = conn.execute(text(f"SELECT COUNT(*) FROM {table}"))
            count = result.scalar()
            print(f"📊 {table}: {count} записей")