from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from schema.User import UserCreate, UserCreateResponse, UserResponse
from config.models import User
from config.db import get_db
from auth.auth import hash_password, verify_password, create_access_token, decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")


router = APIRouter(prefix="/users",tags=["Users"])

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> dict:
    """Dependency that extracts the user from the incomming JWT token."""
    payload = decode_access_token(token)
    username: str = payload.get("sub")

    if username is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    
    return user


@router.post("/register", response_model=UserCreateResponse)
def register(user: UserCreate , db:Session = Depends(get_db)):

    if db.query(User).filter(User.username==user.username).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already registered")

    hashed_password = hash_password(user.password)
    db_user = User(
        username=user.username,
        password=hashed_password
    )

    db.add(db_user)
    db.commit()
    return(
        UserCreateResponse(username=db_user.username, created=True)
    )


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    

    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub":user.username})
    return(
        {
            "access_token": access_token, "token_type": "bearer"
        }
    )

# example protected route
@router.get("/protected/user/me", response_model=UserResponse)
def read_user_me(current_user: User = Depends(get_current_user)):
    return current_user


# @app.post("/login")
# def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
#     user = db.query(User).filter(User.username == form_data.username).first()
#     # print(user.password)
#     if not user or not verify_password(form_data.password, user.password):
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail = "Incorrect username or password")

#     # create jwt token
#     access_token = create_access_token(data={"sub":user.username})

#     return {"access_token": access_token, "token_type": "bearer"}

# # example protected route
# @app.get("/protected/user/me", response_model=UserResponse)
# def read_user_me(current_user: User = Depends(get_current_user)):
#     return current_user