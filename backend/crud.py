# Import settings
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.config.settings")

# setup django environment
import django
from django.forms.models import model_to_dict

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
            artist = Artist.objects.prefetch_related("album_set").get(pk=artist_id)
        except Artist.DoesNotExist:
            return 0

        return artist.album_set.count()

    return Album.objects.count()


def list_albums(limit: int, offset: int = 0):
    albums = (
        Album.objects.select_related("artist")
        .prefetch_related("track_set__genre")
        .all()[offset : offset + limit]
    )

    return [
        {
            **model_to_dict(album),
            "artist": album.artist,
            "genres": set([track.genre.name for track in album.track_set.all()]),
        }
        for album in albums
    ]


def get_album(id: int):
    try:
        album = (
            Album.objects.select_related("artist")
            .prefetch_related("track_set__genre")
            .get(pk=id)
        )
        artist = album.artist
        genres = set([track.genre.name for track in album.track_set.all()])
    except Album.DoesNotExist:
        return None

    return {**model_to_dict(album), "artist": artist, "genres": genres}


def get_albums_by_artist(id: int):
    try:
        artist = Artist.objects.prefetch_related("album_set__track_set__genre").get(
            pk=id
        )
    except Artist.DoesNotExist:
        return None

    album_set = artist.album_set.all()
    albums = [
        {
            **model_to_dict(album),
            "artist": artist,
            "genres": set([track.genre.name for track in album.track_set.all()]),
        }
        for album in album_set
    ]

    return albums


def list_genres():
    genre_list = [item["name"] for item in Genre.objects.values()]

    return genre_list


def count_tracks(album_id: int = 0):
    if album_id:
        try:
            album = Album.objects.prefetch_related("track_set").get(pk=album_id)
        except Album.DoesNotExist:
            return 0

        return album.track_set.count()

    return Track.objects.count()


def list_tracks(limit: int, offset: int = 0):
    tracks = (
        Track.objects.order_by("name")
        .select_related("album__artist")
        .select_related("genre")[offset : offset + limit]
    )

    return [
        {
            **model_to_dict(track),
            "album": track.album,
            "artist": track.album.artist,
            "genre": track.genre.name,
        }
        for track in tracks
    ]


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

    return {**model_to_dict(track), "album": album, "artist": artist, "genre": genre}


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

    return [
        {
            **model_to_dict(track),
            "album": album,
            "artist": album.artist,
            "genre": track.genre.name,
        }
        for track in tracks
    ]
