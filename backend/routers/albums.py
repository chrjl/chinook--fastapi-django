from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..crud import count_albums, list_albums, get_album, count_tracks, get_tracks_by_album
from .tracks import TrackList

router = APIRouter(tags=["albums"])


class AlbumObject(BaseModel):
    id: int = 0
    title: str
    artist_id: int
    type: str = "album"


class AlbumList(BaseModel):
    limit: int = 0
    offset: int = 0
    total: int
    items: list[AlbumObject]


@router.get("")
def albums(limit: int = 10, offset: int = 0) -> AlbumList:
    total = count_albums()
    items = list_albums(limit, offset)

    return {"limit": limit, "offset": offset, "total": total, "items": items}


@router.get("/{id}")
def album(id: int) -> AlbumObject:
    result = get_album(id)

    if not result:
        raise HTTPException(status_code=404)

    return result


@router.get("/{id}/tracks")
def tracks(id: int) -> TrackList:
    total = count_tracks(album_id=id)
    items = get_tracks_by_album(id)

    if not items:
        raise HTTPException(status_code=404)

    return {"total": total, "items": items}
