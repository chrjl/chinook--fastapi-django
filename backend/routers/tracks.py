from fastapi import APIRouter, HTTPException

from ..schema import TrackObject, TrackList
from ..crud import count_tracks, list_tracks, get_track


router = APIRouter(tags=["tracks"])


@router.get("")
def tracks(limit: int = 10, offset: int = 0) -> TrackList:
    total = count_tracks()
    items = list_tracks(limit, offset)

    return {"limit": limit, "offset": offset, "total": total, "items": items}


@router.get("/{id}")
def track(id: int) -> TrackObject:
    result = get_track(id)

    if not result:
        raise HTTPException(status_code=404)

    return result
