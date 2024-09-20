# Import settings
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.config.settings")

# setup django environment
import django

django.setup()

from .db.models import Artist, Album, Genre


def list_artists(limit: int, offset: int = 0):
    return list(Artist.objects.values()[offset : offset + limit])


def get_artist(id: int):
    try:
        artist = Artist.objects.values().get(pk=id)
    except Artist.DoesNotExist:
        return None

    return artist


def list_albums(limit: int, offset: int = 0):
    return list(Album.objects.values()[offset : offset + limit])


def get_album(id: int):
    try:
        album = Album.objects.values().get(pk=id)
    except Album.DoesNotExist:
        return None

    return album


def get_albums_by_artist(id: int):
    try:
        artist = Artist.objects.get(pk=id)
    except Artist.DoesNotExist:
        return None

    return list(artist.album_set.values())


def list_genres():
    genre_list = [item["name"] for item in Genre.objects.values()]

    return genre_list
