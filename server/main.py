from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

rooms = {}

@app.get("/")
def text_app():
    return {"message": "ok"}

@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: int):
    await websocket.accept()

    if room_id not in rooms:
        rooms[room_id] = []

    rooms[room_id].append(websocket)

    print(rooms)

    try:
        while True:
            data = await websocket.receive_text()

            for client in rooms[room_id]:
                if client != websocket:
                    await client.send_text(data)

    except WebSocketDisconnect:
        rooms[room_id].remove(websocket)

        if len(rooms[room_id]) == 0:
            del rooms[room_id]

        print(rooms)