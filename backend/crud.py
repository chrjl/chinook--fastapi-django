# Import settings
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.config.settings")

# setup django environment
import django
from django.forms.models import model_to_dict

django.setup()

from .db.models import Artist, Album, Genre, Track


def count_artists(query: str = None):
    if query:
        return Artist.objects.filter(name__contains=query).count()

    return Artist.objects.count()


def list_artists(limit: int, offset: int = 0):
    return list(Artist.objects.values()[offset : offset + limit])


def search_artists(query: str, limit: int, offset: int = 0):
    artists = Artist.objects.filter(name__contains=query)[offset : offset + limit]
    return list(artists.values())


def get_artist(id: int):
    try:
        artist = Artist.objects.get(pk=id)
        albums = artist.album_set.all()
        genres = set(
            [track.genre.name for album in albums for track in album.track_set.all()]
        )
    except Artist.DoesNotExist:
        return None

    return {**model_to_dict(artist), "genres": genres}


def count_albums(artist_id: int = 0, query: str | None = None):
    if artist_id:
        try:
            artist = Artist.objects.prefetch_related("album_set").get(pk=artist_id)
        except Artist.DoesNotExist:
            return 0

        return artist.album_set.count()

    if query:
        return Album.objects.filter(title__contains=query).count()

    return Album.objects.count()


def format_album_object(album):
    artist = album.artist
    genres = set([track.genre.name for track in album.track_set.all()])

    return {**model_to_dict(album), "artist": artist, "genres": genres}


def list_albums(limit: int, offset: int = 0):
    albums = (
        Album.objects.select_related("artist")
        .prefetch_related("track_set__genre")
        .all()[offset : offset + limit]
    )

    return [format_album_object(album) for album in albums]


def search_albums(query: str, limit: int, offset: int = 0):
    albums = (
        Album.objects.filter(title__contains=query)
        .select_related("artist")
        .prefetch_related("track_set__genre")
        .all()[offset : offset + limit]
    )

    return [format_album_object(album) for album in albums]


def get_album(id: int):
    try:
        album = (
            Album.objects.select_related("artist")
            .prefetch_related("track_set__genre")
            .get(pk=id)
        )
    except Album.DoesNotExist:
        return None

    return format_album_object(album)


def get_albums_by_artist(id: int):
    try:
        artist = Artist.objects.prefetch_related("album_set__track_set__genre").get(
            pk=id
        )
    except Artist.DoesNotExist:
        return None

    album_set = artist.album_set.all()
    albums = [format_album_object(album) for album in album_set]

    return albums


def list_genres():
    genre_list = [item["name"] for item in Genre.objects.values()]

    return genre_list


def count_tracks(album_id: int = 0, query: str | None = None):
    if album_id:
        try:
            album = Album.objects.prefetch_related("track_set").get(pk=album_id)
        except Album.DoesNotExist:
            return 0

        return album.track_set.count()

    if query:
        return Track.objects.filter(name__contains=query).count()

    return Track.objects.count()


def format_track_object(track):
    return {
        **model_to_dict(track),
        "album": track.album,
        "artist": track.album.artist,
        "genre": track.genre.name,
    }


def list_tracks(limit: int, offset: int = 0):
    tracks = (
        Track.objects.order_by("name")
        .select_related("album__artist")
        .select_related("genre")[offset : offset + limit]
    )

    return [format_track_object(track) for track in tracks]


def search_tracks(query: str, limit: int, offset: int = 0):
    tracks = (
        Track.objects.filter(name__contains=query)
        .select_related("album__artist")
        .select_related("genre")
        .order_by("name")[offset : offset + limit]
    )

    return [format_track_object(track) for track in tracks]


def get_track(id: int):
    try:
        track = (
            Track.objects.select_related("album__artist")
            .select_related("genre")
            .get(pk=id)
        )
        album = track.album
        artist = album.artist
        genre = track.genre.name
    except Track.DoesNotExist:
        return None

    return format_track_object(track)


def get_tracks_by_album(id: int):
    try:
        album = (
            Album.objects.select_related("artist")
            .prefetch_related("track_set__genre")
            .get(pk=id)
        )
    except Album.DoesNotExist:
        return None

    tracks = album.track_set.all()

    return [format_track_object(track) for track in tracks]
