import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { ArtistObject } from './artists';
import { TrackObject } from './tracks';
import SimplePagination from '../utilities/simple-pagination';
import timestring from '../utilities/timestring';

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

  const [selected, setSelected] = useState<AlbumObject | null>(null);

  const limit = 20;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    if (artistId) {
      fetch(`/api/artists/${artistId}`)
        .then((res) => res.json())
        .then((res) => setArtist(res));

      fetch(`/api/artists/${artistId}/albums`)
        .then((res) => res.json())
        .then((res) => setAlbums(res.items));
    } else {
      setArtist(null);

      fetch(`/api/albums?limit=${limit}&offset=${(page - 1) * limit}`)
        .then((res) => res.json())
        .then((res) => {
          setTotal(res.total);
          setAlbums(res.items);
        });
    }
  }, [artistId, page]);

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
      ) : (
        <Container className="d-flex flex-column align-items-center">
          <SimplePagination setPage={setPage} first={1} last={totalPages} />
        </Container>
      )}

      <ListGroup variant="flush">
        {albums.map(({ id, title }) => (
          <ListGroup.Item key={id} action onClick={() => handleSelect(id)}>
            {title}
          </ListGroup.Item>
        ))}
      </ListGroup>
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
