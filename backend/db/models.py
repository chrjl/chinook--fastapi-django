from django.db import models


class Artist(models.Model):
    id = models.IntegerField(db_column="ArtistId", primary_key=True)
    name = models.CharField(db_column="Name", max_length=120)

    class Meta:
        db_table = "Artist"
        ordering = ["name"]


class Album(models.Model):
    id = models.IntegerField(db_column="AlbumId", primary_key=True)
    title = models.CharField(db_column="Title", max_length=160)
    artist = models.ForeignKey(
        Artist, db_column="ArtistId", on_delete=models.DO_NOTHING
    )

    class Meta:
        db_table = "Album"
        ordering = ["title"]


class Genre(models.Model):
    id = models.IntegerField(db_column="GenreId", primary_key=True)
    name = models.CharField(db_column="Name", max_length=120)

    class Meta:
        db_table = "Genre"


class Track(models.Model):
    id = models.IntegerField(db_column="TrackId")
    name = models.CharField(db_column="Name", max_length=200)
    album = models.ForeignKey(Album, db_column="AlbumId", on_delete=models.DO_NOTHING)
    genre = models.ForeignKey(Genre, db_column="GenreId", on_delete=models.DO_NOTHING)
    composer = models.CharField(db_column="Composer", max_length=220)
    milliseconds = models.IntegerField(db_column="Milliseconds")
    size = models.IntegerField(db_column="Bytes")
    unit_price = models.FloatField(db_column="UnitPrice")

    class Meta:
        db_table = "Track"
