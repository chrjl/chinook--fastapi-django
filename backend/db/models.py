from django.db import models


class Artist(models.Model):
    id = models.IntegerField(db_column="ArtistId", primary_key=True)
    name = models.CharField(db_column="Name", max_length=120)

    class Meta:
        db_table = "Artist"


class Album(models.Model):
    id = models.IntegerField(db_column="AlbumId", primary_key=True)
    title = models.CharField(db_column="Title", max_length=160)
    artist = models.ForeignKey(
        Artist, db_column="ArtistId", on_delete=models.DO_NOTHING
    )

    class Meta:
        db_table = "Album"
