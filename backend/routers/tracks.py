from fastapi import APIRouter, HTTPException

from ..schema import TrackObject, TrackList
from ..crud import count_tracks, search_tracks, list_tracks, get_track


router = APIRouter(tags=["tracks"])


@router.get("")
def tracks(limit: int = 10, offset: int = 0, search: str | None = None) -> TrackList:
    if search:
        total = count_tracks(query=search)
        items = search_tracks(query=search, limit=limit, offset=offset)
    else:
        total = count_tracks()
        items = list_tracks(limit, offset)

    return {"limit": limit, "offset": offset, "total": total, "items": items}


@router.get("/{id}")
def track(id: int) -> TrackObject:
    result = get_track(id)

    if not result:
        raise HTTPException(status_code=404)

    return result
