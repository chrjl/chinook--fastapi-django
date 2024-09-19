from fastapi import FastAPI

from routers import artists

app = FastAPI()

app.include_router(artists.router, prefix="/artists")
