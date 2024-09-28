from fastapi import APIRouter, HTTPException

from ..schema import AlbumObject, AlbumList, TrackList
from ..crud import (
    count_albums,
    list_albums,
    search_albums,
    get_album,
    count_tracks,
    get_tracks_by_album,
)

router = APIRouter(tags=["albums"])


@router.get("")
def albums(limit: int = 10, offset: int = 0, search: str | None = None) -> AlbumList:
    if search:
        total = count_albums(query=search)
        items = search_albums(query=search, limit=limit, offset=offset)
    else:
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
