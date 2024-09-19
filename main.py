from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from crud import list_artists, get_artist

app = FastAPI()


class ArtistObject(BaseModel):
    id: int = 0
    name: str
    type: str = "artist"


class ArtistList(BaseModel):
    limit: int
    offset: int
    items: list[ArtistObject]


@app.get("/artists", tags=["Artists"])
def artists(limit: int = 10, offset: int = 0) -> ArtistList:
    result = list_artists(limit, offset)

    return {"limit": limit, "offset": offset, "items": result}


@app.get("/artists/{id}", tags=["Artists"])
def artist(id: int) -> ArtistObject:
    result = get_artist(id)

    if not result:
        raise HTTPException(status_code=404)

    return result
