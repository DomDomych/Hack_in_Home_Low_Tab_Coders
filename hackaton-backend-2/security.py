import pytz
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer

SECRET_KEY = "SUPER_SECRET_KEY_CHANGE_IT"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Используем bcrypt_sha256 вместо "голого" bcrypt
pwd_context = CryptContext(
    schemes=["bcrypt_sha256"],
    deprecated="auto",
)

MAX_BCRYPT_BYTES = 72


def _normalize_password(password: str) -> str:
    """
    Приводим пароль к длине не больше 72 байт в UTF-8.
    (можно и убрать, но оставим — не мешает)
    """
    if password is None:
        return password

    pw_bytes = password.encode("utf-8")
    if len(pw_bytes) <= MAX_BCRYPT_BYTES:
        return password

    pw_bytes = pw_bytes[:MAX_BCRYPT_BYTES]
    return pw_bytes.decode("utf-8", errors="ignore")


def hash_password(password: str) -> str:
    password = _normalize_password(password)
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    plain_password = _normalize_password(plain_password)
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(pytz.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)



oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")