from .db import Base
from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from datetime import datetime
from .db import engine

class User(Base):
    __tablename__="users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)

# class Room(Base):
#     __tablename__="rooms"

#     id = Column(Integer, primary_key=True)

class Message(Base):
    __tablename__="messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    room_id = Column(Integer)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

class PrivateMessage(Base):
    __tablename__="private_table"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    receiver_id = Column(Integer, ForeignKey("users.id"))
    content = Column(String)





Base.metadata.create_all(bind=engine)