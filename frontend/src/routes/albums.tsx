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
  artist_id: number;
}

export default function Albums() {
  const [artist, setArtist] = useState<ArtistObject | null>(null);
  const [albums, setAlbums] = useState<AlbumObject[]>();
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { artistId } = useParams();
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

      {selectedAlbumId && (
        <AlbumModal
          id={selectedAlbumId}
          show={showModal}
          setShow={setShowModal}
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

      {albums && (
        <ListGroup variant="flush">
          {albums.map(({ id, title }) => (
            <ListGroup.Item
              key={id}
              action
              onClick={() => handleSelectAlbum(id)}
            >
              {title}
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );

  function handleSelectAlbum(id: number) {
    setSelectedAlbumId(id);
    setShowModal(true);
  }
}

interface AlbumModalProps {
  id: number;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

function AlbumModal({ id, show, setShow }: AlbumModalProps) {
  const [artist, setArtist] = useState<ArtistObject | null>(null);
  const [album, setAlbum] = useState<AlbumObject | null>(null);
  const [tracks, setTracks] = useState<TrackObject[] | null>(null);

  const runtime = tracks
    ? tracks.reduce((duration, track) => duration + track.milliseconds, 0)
    : 0;

  useEffect(() => {
    fetch(`/api/albums/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setAlbum(res);
        return fetch(`/api/artists/${res.artist_id}`);
      })
      .then((res) => res.json())
      .then((res) => setArtist(res));

    fetch(`/api/albums/${id}/tracks`)
      .then((res) => res.json())
      .then((res) => setTracks(res.items));
  }, [id]);

  return (
    album && (
      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{album.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>AlbumId: {album.id}</p>
          {artist && <p>Artist: {artist.name}</p>}
          <p>Tracks: {tracks ? tracks.length : 0}</p>
          <p>Runtime: {timestring(runtime)}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

          <Link to={`/albums/${album.id}/tracks`}>
            <Button variant="primary">Browse tracks</Button>
          </Link>
        </Modal.Footer>
      </Modal>
    )
  );

  function handleClose() {
    setShow(false);
  }
}
