from django.db import models


class Artist(models.Model):
    id = models.IntegerField(db_column="ArtistId", primary_key=True)
    name = models.CharField(db_column="Name", max_length=120)

    class Meta:
        db_table = "Artist"
