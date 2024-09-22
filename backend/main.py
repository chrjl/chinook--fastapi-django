from fastapi import FastAPI

from .routers import artists, albums, genres, tracks

app = FastAPI(root_path="/api")

app.include_router(artists.router, prefix="/artists")
app.include_router(albums.router, prefix="/albums")
app.include_router(genres.router, prefix="/genres")
app.include_router(tracks.router, prefix="/tracks")
