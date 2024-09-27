from pydantic import BaseModel


class ArtistObject(BaseModel):
    id: int = 0
    name: str
    type: str = "artist"


class ArtistList(BaseModel):
    limit: int
    offset: int
    total: int
    items: list[ArtistObject]


class AlbumObject(BaseModel):
    id: int = 0
    title: str
    artist: ArtistObject
    type: str = "album"


class AlbumList(BaseModel):
    limit: int = 0
    offset: int = 0
    total: int
    items: list[AlbumObject]


class TrackObject(BaseModel):
    id: int
    name: str
    # composer: str | None
    milliseconds: int
    # size: int
    # unit_price: float
    artist: ArtistObject
    album: AlbumObject
    genre: str
    type: str = "track"


class TrackList(BaseModel):
    limit: int = 0
    offset: int = 0
    total: int
    items: list[TrackObject]
