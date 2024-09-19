# Import settings
import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

# setup django environment
import django

django.setup()

from db.models import Artist


def list_artists(limit: int, offset: int = 0):
    return list(Artist.objects.values()[offset : offset + limit])


def get_artist(id: int):
    try:
        artist = Artist.objects.values().get(pk=id)
    except Artist.DoesNotExist:
        return None

    return artist
