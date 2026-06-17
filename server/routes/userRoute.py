from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from config.db import get_db
from typing import List


from config.models import User
from schema.User import UserResponse
from routes.authRoute import get_current_user

router = APIRouter(prefix="/api", tags=["api"])

@router.get("/get/users", response_model=List[UserResponse])
async def get_user(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    users = db.query(User).filter(User.id != current_user.id).all()
    return users

