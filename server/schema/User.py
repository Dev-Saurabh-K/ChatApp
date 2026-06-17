from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str

class UserCreateResponse(BaseModel):
    username: str
    created: bool

class UserResponse(BaseModel):
    id: int
    username: str
    

