from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from crud import list_artists, get_artist, get_albums_by_artist
from .albums import AlbumList


class ArtistObject(BaseModel):
    id: int = 0
    name: str
    type: str = "artist"


class ArtistList(BaseModel):
    limit: int
    offset: int
    items: list[ArtistObject]


router = APIRouter(tags=["artists"])


@router.get("/")
def artists(limit: int = 10, offset: int = 0) -> ArtistList:
    result = list_artists(limit, offset)

    return {"limit": limit, "offset": offset, "items": result}


@router.get("/{id}")
def artist(id: int) -> ArtistObject:
    result = get_artist(id)

    if not result:
        raise HTTPException(status_code=404)

    return result


@router.get("/{id}/albums")
def albums_by_artist(id: int) -> AlbumList:
    return {"items": get_albums_by_artist(id)}
