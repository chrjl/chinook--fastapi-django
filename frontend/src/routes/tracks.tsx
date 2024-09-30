import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import { ArtistObject } from './artists';
import { AlbumObject } from './albums';
import SimplePagination from '../utilities/simple-pagination';
import timestring from '../utilities/timestring';

export interface TrackObject {
  id: number;
  name: string;
  genres: string[];
  milliseconds: number;
  album_id: number;
  artist: ArtistObject;
  album: AlbumObject;
}

export default function Tracks() {
  const { albumId } = useParams();

  const [tracks, setTracks] = useState<TrackObject[]>([]);
  const [album, setAlbum] = useState<AlbumObject | null>();
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [selected, setSelected] = useState<TrackObject | null>(null);

  const limit = 20;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    if (albumId) {
      fetch(`/api/albums/${albumId}`)
        .then((res) => res.json())
        .then((res) => {
          setAlbum(res);
        });

      fetch(`/api/albums/${albumId}/tracks`)
        .then((res) => res.json())
        .then((res) => setTracks(res.items));
    } else {
      setAlbum(null);

      fetch(`/api/tracks?limit=${limit}&offset=${(page - 1) * limit}`)
        .then((res) => res.json())
        .then((res) => {
          setTracks(res.items);
          setTotal(res.total);
        });
    }
  }, [albumId, page]);

  return (
    <>
      <h1>Tracks</h1>

      {selected && (
        <TrackModal
          id={selected.id}
          name={selected.name}
          artist={selected.artist}
          genres={selected.genres}
          album={selected.album}
          milliseconds={selected.milliseconds}
          show={Boolean(selected)}
          onHide={() => setSelected(null)}
        />
      )}

      {album ? (
        <>
          <p>
            Artist: <strong>{album.artist.name}</strong>
          </p>
          <p>
            Album: <strong>{album.title}</strong>
          </p>
        </>
      ) : (
        <Container className="d-flex flex-column align-items-center">
          <SimplePagination first={1} last={totalPages} setPage={setPage} />
        </Container>
      )}

      {tracks && (
        <ListGroup variant="flush">
          {tracks.map(({ id, name, milliseconds }) => (
            <ListGroup.Item key={id} action onClick={() => handleSelect(id)}>
              {name} ({timestring(milliseconds)})
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );

  function handleSelect(id: number) {
    fetch(`/api/tracks/${id}`)
      .then((res) => res.json())
      .then((track) => setSelected(track));
  }
}

interface TrackModalProps {
  id: number;
  name: string;
  artist: ArtistObject;
  album: AlbumObject;
  genres: string[];
  milliseconds: number;
  show: boolean;
  onHide: () => void;
}

function TrackModal({
  id,
  name,
  artist,
  album,
  genres,
  milliseconds,
  show,
  onHide,
}: TrackModalProps) {
  return (
    <Modal centered show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>TrackId: {id}</p>
        <p>Artist: {artist.name}</p>
        <p>Genre: {genres.join(', ')}</p>
        <p>Album: {album.title}</p>
        <p>Time: {timestring(milliseconds)}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
