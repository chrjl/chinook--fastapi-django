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
  genre: string;
  milliseconds: number;
  album_id: number;
  artist: ArtistObject;
  album: AlbumObject;
}

export default function Tracks() {
  const { albumId } = useParams();

  const [album, setAlbum] = useState<AlbumObject | null>();
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [trackList, setTrackList] = useState<TrackObject[]>([]);
  const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null);

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
        .then((res) => setTrackList(res.items));
    } else {
      setAlbum(null);

      fetch(`/api/tracks?limit=${limit}&offset=${(page - 1) * limit}`)
        .then((res) => res.json())
        .then((res) => {
          setTrackList(res.items);
          setTotal(res.total);
        });
    }
  }, [albumId, page]);

  return (
    <>
      <h1>Tracks</h1>

      {selectedTrackId && (
        <TrackModal
          id={selectedTrackId}
          show={showModal}
          setShow={setShowModal}
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

      {trackList && (
        <ListGroup variant="flush">
          {trackList.map(({ id, name, milliseconds }) => (
            <ListGroup.Item
              key={id}
              action
              onClick={() => handleSelectTrack(id)}
            >
              {name} ({timestring(milliseconds)})
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );

  function handleSelectTrack(id: number) {
    setSelectedTrackId(id);
    setShowModal(true);
  }
}

interface TrackModalProps {
  id: number;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

function TrackModal({ id, show, setShow }: TrackModalProps) {
  const [track, setTrack] = useState<TrackObject | null>(null);

  useEffect(() => {
    fetch(`/api/tracks/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setTrack(res);
      });
  }, [id]);

  return (
    track && (
      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{track.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>TrackId: {track.id}</p>
          <p>Artist: {track.artist.name}</p>
          <p>Genre: {track.genre}</p>
          <p>Album: {track.album.title}</p>
          <p>Time: {timestring(track.milliseconds)}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    )
  );

  function handleClose() {
    setShow(false);
  }
}
