from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError, jwt

import models
import schemas
from database import SessionLocal
from security import (
    hash_password,
    verify_password,
    create_access_token,
    SECRET_KEY,
    ALGORITHM,
)
from repositories import UserRepository

router = APIRouter(tags=["auth"])

# OAuth2 схема – откуда брать токен
# Полный путь, т.к. router подключается как prefix="/api/auth"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_user_repository(db: Session = Depends(get_db)) -> UserRepository:
    return UserRepository(db)


@router.post("/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: schemas.UserRegister, user_repo: UserRepository = Depends(get_user_repository)):
    # Проверка существующего пользователя по логину
    existing_user = user_repo.session.query(models.User).filter(models.User.login == user_in.login).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким логином уже существует",
        )

    # Проверка существующего пользователя по email
    existing_email = user_repo.session.query(models.User).filter(models.User.email == user_in.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с такой почтой уже существует",
        )

    # Хешируем пароль
    hashed_pw = hash_password(user_in.password)

    user = user_repo.create_user(
        login=user_in.login,
        email=user_in.email,
        name=user_in.name,
        password=hashed_pw,
        age=user_in.age,
    )

    return schemas.UserOut(
        id=user.id,
        login=user.login,
        email=user.email,
        name=user.name,
        age=user.age,
        created_at=user.created_at
    )


@router.post("/login", response_model=schemas.Token)
def login(user_in: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.login == user_in.login).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неправильный логин или пароль",
        )

    if not verify_password(user_in.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неправильный логин или пароль",
        )

    access_token = create_access_token({"sub": str(user.id)})

    return {"access_token": access_token, "token_type": "bearer"}


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> models.User:
    """
    Достает текущего пользователя из JWT access_token.
    Используй Depends(get_current_user) в защищённых эндпоинтах.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Не удалось подтвердить учетные данные",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Декодируем токен
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    # Ищем пользователя в БД
    user = db.query(models.User).filter(models.User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception

    return user