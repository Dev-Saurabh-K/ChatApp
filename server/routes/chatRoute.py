from fastapi import APIRouter, WebSocket, WebSocketDisconnect, WebSocketException, Depends
from sqlalchemy.orm import Session
from auth.auth import decode_access_token
from config.db import get_db
from config.models import User, Message

router = APIRouter()

rooms = {}


# @router.websocket("/ws/{reciever}/{sender}")
# async def websocket_chat(websocket: WebSocket, reciever: str, sender: str, db: Session=Depends(get_db)):
#     token = websocket.query_params.get("token")
#     if not token:
#         await websocket.close(code=1008)
#         return
    
#     payload = decode_access_token(token)

#     if not payload:
#         await websocket.close(code=1008)
#         return
    
#     user = db.query(User).filter(User.username==payload["sub"]).first()
#     if user is None:
#         raise WebSocketException(code=1008, reason="Unregistered")
    
#     await websocket.accept()

#     try:
#         while(True):
#             data = await websocket.receive_text()

#             if(sender == cl)

active_connections = {}

# @router.websocket("/ws/{receiver}/{sender}")
# async def websocket_chat(
#     websocket: WebSocket,
#     receiver: str,
#     sender: str
# ):
#     await websocket.accept()

#     active_connections[sender] = websocket

#     try:
#         while True:
#             text = await websocket.receive_text()

#             # save in db

#             if receiver in active_connections:

#                 await active_connections[receiver].send_json({
#                     "sender": sender,
#                     "message": text
#                 })

#     except WebSocketDisconnect:
#         active_connections.pop(sender, None)


@router.websocket("/ws")
async def websocket_chat(websocket: WebSocket):
    token = websocket.query_params.get("token")

    if not token:
        await websocket.close(code=1008)
        return

    payload = decode_access_token(token)

    if not payload:
        await websocket.close(code=1008)
        return

    db: Session = next(get_db())

    user = db.query(User).filter(
        User.username == payload["sub"]
    ).first()

    if not user:
        await websocket.close(code=1008)
        return

    username = user.username

    await websocket.accept()

    active_connections[username] = websocket

    print(f"{username} connected")

    try:
        while True:
            data = await websocket.receive_json()

            receiver = data["receiver"]
            message = data["message"]

            # save to database here if needed

            if receiver in active_connections:

                await active_connections[receiver].send_json({
                    "sender": username,
                    "message": message
                })

    except WebSocketDisconnect:
        active_connections.pop(username, None)
        print(f"{username} disconnected")


# //continue from here



@router.websocket("/ws/{room_id}/{username}")
async def websocket_endpoint(websocket: WebSocket, room_id: int, username: str, db: Session=Depends(get_db)):

    token = websocket.query_params.get("token")
    if not token:
        await websocket.close(code=1008)
        return
    
    payload = decode_access_token(token)

    if not payload:
        await websocket.close(code=1008)
        return
    
    user = db.query(User).filter(User.username==payload["sub"]).first()
    if user is None:
        raise WebSocketException(code=1008, reason="Unregistered")
    

    await websocket.accept()

    if room_id not in rooms:
        rooms[room_id] = []

    rooms[room_id].append({"socket":websocket, "username":username})

    # print(rooms)

    try:
        while True:
            data = await websocket.receive_text()

            db_message = Message(
                sender_id=user.id,
                room_id=room_id,
                content=data
                )
            
            db.add(db_message)
            db.commit()

            for client in rooms[room_id]:
                if client["socket"] != websocket:
                    await client["socket"].send_json({
                        "username":username,
                        "data":data})

    except WebSocketDisconnect:
        rooms[room_id] = [
            client
            for client in rooms[room_id]
            if client["socket"] != websocket
        ]


@router.get("/messages/{room_id}")
async def get_message(room_id:int, db: Session=Depends(get_db)):
    return db.query(Message).filter(Message.room_id == room_id).all()