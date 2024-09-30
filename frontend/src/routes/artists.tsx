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
  genres: string[];
  type: 'artist';
}

export default function Artist() {
  const [artists, setArtists] = useState<ArtistObject[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [selected, setSelected] = useState<ArtistObject | null>(null);

  const limit = 20;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    fetch('/api/artists')
      .then((res) => res.json())
      .then((res) => {
        setTotal(res.total);
        setArtists(res.items);
      });
  }, [page, search]);

  return (
    <>
      <h1>Artists</h1>

      {selected && (
        <ArtistModal
          id={selected.id}
          name={selected.name}
          genres={selected.genres}
          show={Boolean(selected)}
          onHide={() => setSelected(null)}
        />
      )}

      <Container className="d-flex flex-column align-items-center">
        <SimplePagination setPage={setPage} first={1} last={totalPages} />
      </Container>

      <ListGroup variant="flush">
        {artists.map(({ id, name }) => (
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
    fetch(`/api/artists/${id}`)
      .then((res) => res.json())
      .then((artist) => setSelected(artist));
  }

}

interface ArtistModalProps {
  id: number | null;
  name: string;
  genres: string[];
  show: boolean;
  onHide: () => void;
}

function ArtistModal({ id, name, genres, show, onHide }: ArtistModalProps) {
  return (
    <Modal centered show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>ArtistId: {id}</p>
        {genres.length ? <p>Genres: {genres.join(', ')}</p> : null}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Link to={`/artists/${id}/albums`}>
          <Button variant="primary">Browse albums</Button>
        </Link>
      </Modal.Footer>
    </Modal>
  );
}
