from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..crud import list_albums, get_album

router = APIRouter(tags=["albums"])


class AlbumObject(BaseModel):
    id: int = 0
    title: str
    artist_id: int
    type: str = "album"


class AlbumList(BaseModel):
    limit: int = 0
    offset: int = 0
    items: list[AlbumObject]


@router.get("/")
def albums(limit: int = 10, offset: int = 0) -> AlbumList:
    result = list_albums(limit, offset)

    return {"limit": limit, "offset": offset, "items": result}


@router.get("/{id}")
def album(id: int) -> AlbumObject:
    result = get_album(id)

    if not result:
        raise HTTPException(status_code=404)

    return result
