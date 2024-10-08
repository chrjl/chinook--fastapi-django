import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import DataLayout from '../utilities/data-layout';
import timestring from '../utilities/timestring';

import { ArtistObject } from './artists';
import { TrackObject } from './tracks';

export interface AlbumObject {
  id: number;
  title: string;
  genres: string[];
  artist: ArtistObject;
}

export default function Albums() {
  const { artistId } = useParams();

  const [albums, setAlbums] = useState<AlbumObject[]>([]);
  const [artist, setArtist] = useState<ArtistObject | null>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [search, setSearch] = useState<string | null>(null);
  const [selected, setSelected] = useState<AlbumObject | null>(null);

  const limit = 20;
  const pages = Math.ceil(total / limit);

  useEffect(() => {
    if (artistId) {
      fetch(`/api/artists/${artistId}/albums`)
        .then((res) => res.json())
        .then((albums) => {
          setAlbums(albums.items);
          setArtist(albums.items[0].artist);

          // disable next/previous buttons by setting pages to 1
          setTotal(limit);
        });
    } else {
      setArtist(null);

      fetch(
        search
          ? `/api/albums?limit=${limit}&offset=${(page - 1) * limit}&search=${search}`
          : `/api/albums?limit=${limit}&offset=${(page - 1) * limit}`
      )
        .then((res) => res.json())
        .then((albums) => {
          setTotal(albums.total);
          setAlbums(albums.items);
        });
    }
  }, [artistId, page, search]);

  return (
    <>
      <h1>Albums</h1>

      {selected && (
        <AlbumModal
          id={selected.id}
          title={selected.title}
          artist={selected.artist}
          genres={selected.genres}
          show={Boolean(selected)}
          onHide={() => setSelected(null)}
        />
      )}

      {artist ? (
        <p>
          Artist: <strong>{artist.name}</strong>
        </p>
      ) : null}

      <DataLayout
        pages={pages}
        page={page}
        setPage={setPage}
        setSearch={artistId ? null : setSearch}
      >
        <ListGroup variant="flush">
          {albums.map(({ id, title }) => (
            <ListGroup.Item key={id} action onClick={() => handleSelect(id)}>
              {title}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </DataLayout>
    </>
  );

  function handleSelect(id: number) {
    fetch(`/api/albums/${id}`)
      .then((res) => res.json())
      .then((album) => setSelected(album));
  }
}

interface AlbumModalProps {
  id: number;
  title: string;
  artist: ArtistObject;
  genres: string[];
  show: boolean;
  onHide: () => void;
}

function AlbumModal({
  id,
  title,
  artist,
  genres,
  show,
  onHide,
}: AlbumModalProps) {
  const [tracks, setTracks] = useState<TrackObject[] | null>(null);

  const runtime = tracks
    ? tracks.reduce((duration, track) => duration + track.milliseconds, 0)
    : 0;

  useEffect(() => {
    fetch(`/api/albums/${id}/tracks`)
      .then((res) => res.json())
      .then((res) => setTracks(res.items));
  }, [id]);

  return (
    <Modal centered show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>AlbumId: {id}</p>
        <p>ArtistId: {artist.name}</p>
        {genres.length ? <p>Genres: {genres.join(', ')}</p> : null}
        <p>Tracks: {tracks ? tracks.length : 0}</p>
        <p>Runtime: {timestring(runtime)}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>

        <Link to={`/albums/${id}/tracks`}>
          <Button variant="primary">Browse tracks</Button>
        </Link>
      </Modal.Footer>
    </Modal>
  );
}
