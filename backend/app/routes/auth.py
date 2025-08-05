from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas import UserCreate, UserRead, Token
from app.auth import hash_password, create_access_token
from app.db import get_db
from app.auth import verify_password
from app.models import User
import uuid

router = APIRouter(prefix="/auth", tags=["auth"])

def get_user_by_username(username: str, db: Session = Depends(get_db)):
    return db.query(User).filter(User.username == username).first()

@router.post("/register", response_model=UserRead)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_username(user_data.username, db)
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    hashed_password = hash_password(user_data.password)
    new_user = User(
        username=user_data.username,
        password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
async def login(user_data: UserCreate, db: Session = Depends(get_db)):
    user = get_user_by_username(user_data.username, db)
    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    access_token = create_access_token({"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}