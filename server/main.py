from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
]



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


rooms = {}

@app.get("/")
def text_app():
    return {"message": "ok"}

@app.websocket("/ws/{room_id}/{username}")
async def websocket_endpoint(websocket: WebSocket, room_id: int, username: str):
    await websocket.accept()

    if room_id not in rooms:
        rooms[room_id] = []

    rooms[room_id].append({"socket":websocket, "username":username})

    print(rooms)

    try:
        while True:
            data = await websocket.receive_text()

            for client in rooms[room_id]:
                if client["socket"] != websocket:
                    await client["socket"].send_json({
                        "username":username,
                        "data":data})

    # except WebSocketDisconnect:
    #     rooms[room_id].remove(websocket)

    #     if len(rooms[room_id]) == 0:
    #         del rooms[room_id]

    #     print(rooms)
    except WebSocketDisconnect:
        rooms[room_id] = [
            client
            for client in rooms[room_id]
            if client["socket"] != websocket
        ]