from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from routes import authRoute
from routes import chatRoute
from routes import userRoute

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:5173",
    "https://chat-app-kappa-tawny.vercel.app",
]



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authRoute.router)
app.include_router(chatRoute.router)
app.include_router(userRoute.router)




@app.get("/")
def text_app():
    return {"message": "ok"}


