from fastapi import FastAPI

from .routers import artists, albums

app = FastAPI()

app.include_router(artists.router, prefix="/artists")
app.include_router(albums.router, prefix="/albums")
