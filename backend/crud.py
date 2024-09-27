# Import settings
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.config.settings")

# setup django environment
import django

django.setup()

from .db.models import Artist, Album, Genre, Track


def count_artists():
    return Artist.objects.count()


def list_artists(limit: int, offset: int = 0):
    return list(Artist.objects.values()[offset : offset + limit])


def get_artist(id: int):
    try:
        artist = Artist.objects.values().get(pk=id)
    except Artist.DoesNotExist:
        return None

    return artist


def count_albums(artist_id: int = 0):
    if artist_id:
        try:
            artist = Artist.objects.get(pk=artist_id)
        except Artist.DoesNotExist:
            return 0

        return artist.album_set.count()

    return Album.objects.count()


def list_albums(limit: int, offset: int = 0):
    albums = Album.objects.values()[offset : offset + limit]
    albums = [{**album, "artist": get_artist(album["artist_id"])} for album in albums]
    return albums


def get_album(id: int):
    try:
        album = Album.objects.values().get(pk=id)
        artist = get_artist(album["artist_id"])
    except Album.DoesNotExist:
        return None

    return {**album, "artist": artist}


def get_albums_by_artist(id: int):
    try:
        artist = Artist.objects.get(pk=id)
    except Artist.DoesNotExist:
        return None

    albums = artist.album_set.values()
    albums = [{**album, "artist": artist} for album in albums]

    return albums


def list_genres():
    genre_list = [item["name"] for item in Genre.objects.values()]

    return genre_list


def count_tracks(album_id: int = 0):
    if album_id:
        try:
            album = Album.objects.get(pk=album_id)
        except Album.DoesNotExist:
            return 0

        return album.track_set.count()

    return Track.objects.count()


def list_tracks(limit: int, offset: int = 0):
    tracks = Track.objects.order_by("name").values()[offset : offset + limit]

    return [
        {
            **track,
            "album": get_album(track["album_id"]),
            "artist": get_artist(get_album(track["album_id"])["artist_id"]),
        }
        for track in tracks
    ]


def get_track(id: int):
    try:
        track = Track.objects.values().get(pk=id)
        album = get_album(track["album_id"])
        artist = get_artist(album["artist_id"])
    except Track.DoesNotExist:
        return None

    return {**track, "artist": artist, "album": album}


def get_tracks_by_album(id: int):
    try:
        album = Album.objects.get(pk=id)
    except Album.DoesNotExist:
        return None

    tracks = album.track_set.values()

    return [
        {
            **track,
            "album": get_album(track["album_id"]),
            "artist": get_artist(get_album(track["album_id"])["artist_id"]),
        }
        for track in tracks
    ]
