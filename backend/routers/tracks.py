from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ..crud import list_tracks, get_track


class TrackObject(BaseModel):
    id: int
    name: str
    album_id: int
    # genre_id: int
    # composer: str | None
    milliseconds: int
    # size: int
    # unit_price: float
    type: str = "track"


class TrackList(BaseModel):
    limit: int = 0
    offset: int = 0
    items: list[TrackObject]


router = APIRouter(tags=["tracks"])


@router.get("/")
def tracks(limit: int = 10, offset: int = 0) -> TrackList:
    result = list_tracks(limit, offset)

    return {"limit": limit, "offset": offset, "items": result}


@router.get("/{id}")
def track(id: int) -> TrackObject:
    result = get_track(id)

    if not result:
        raise HTTPException(status_code=404)

    return result
