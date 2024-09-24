import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import SimplePagination from '../utilities/simple-pagination';

export interface ArtistObject {
  id: number;
  name: string;
  type: 'artist';
}

export default function Artist() {
  const [artistList, setArtistList] = useState<ArtistObject[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const limit = 20;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    fetch('/api/artists')
      .then((res) => res.json())
      .then((res) => setTotal(res.total));
  }, []);

  useEffect(() => {
    fetch(`/api/artists?limit=${limit}&offset=${(page - 1) * limit}`)
      .then((res) => res.json())
      .then((res) => setArtistList(res.items));
  }, [page]);

  return (
    <>
      <h1>Artists</h1>

      {selectedArtistId && (
        <ArtistModal
          id={selectedArtistId}
          show={showModal}
          setShow={setShowModal}
        />
      )}

      <Container className="d-flex flex-column align-items-center">
        <SimplePagination setPage={setPage} first={1} last={totalPages} />
      </Container>

      <ListGroup variant="flush">
        {artistList.map(({ id, name }) => (
          <ListGroup.Item
            key={id}
            action
            onClick={() => handleSelectArtist(id)}
          >
            {name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  );

  function handleSelectArtist(id: number) {
    setSelectedArtistId(id);
    setShowModal(true);
  }
}

interface ArtistModalProps {
  id: number;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

function ArtistModal({ id, show, setShow }: ArtistModalProps) {
  const [artist, setArtist] = useState<ArtistObject | null>(null);

  useEffect(() => {
    fetch(`/api/artists/${id}`)
      .then((res) => res.json())
      .then((res) => setArtist(res));
  }, [id]);

  return (
    artist && (
      <Modal centered show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{artist.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>ArtistId: {artist.id}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Link to={`/artists/${artist.id}/albums`}>
            <Button variant="primary">Browse albums</Button>
          </Link>
        </Modal.Footer>
      </Modal>
    )
  );

  function handleClose() {
    setShow(false);
  }
}
