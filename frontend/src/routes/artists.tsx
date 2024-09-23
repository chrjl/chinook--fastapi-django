import { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';

import ListGroup from 'react-bootstrap/ListGroup';
import Pagination from 'react-bootstrap/Pagination';

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
      <ListGroup>
        {artists.map((artist) => (
          <ListGroup.Item key={artist.id}>
            <Link to="/albums">{artist.name}</Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Pagination className="justify-content-center">
        <Pagination.Prev onClick={handlePreviousPage} />
        <Pagination.Item disabled>{page}</Pagination.Item>
        <Pagination.Next onClick={handleNextPage} />
      </Pagination>
    </div>
  );

  function handleNextPage() {
    if (page < totalPages) {
      setPage((page) => page + 1);
    }
  }

  function handlePreviousPage() {
    if (page > 1) {
      setPage((page) => page - 1);
    }
  }
}
