import { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';

import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';

import SimplePagination from '../utilities/simple-pagination';

interface ArtistObject {
  id: number;
  name: string;
  type: 'artist';
}

export default function Artist() {
  const [artists, setArtists] = useState<ArtistObject[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [selected, setSelected] = useOutletContext();

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
      .then((res) => setArtists(res.items));
  }, [page]);

  return (
    <div>
      <Container className="d-flex flex-column align-items-center">
        <SimplePagination setPage={setPage} first={1} last={totalPages} />
      </Container>

      <ListGroup>
        {artists.map(({ id, name }) => (
          <ListGroup.Item key={id}>
            <Link
              to="/albums"
              onClick={() => setSelected({ artist: { id, name } })}
            >
              {name}
            </Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
