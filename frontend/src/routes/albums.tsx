import { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';

import { ListGroup } from 'react-bootstrap';

interface AlbumObject {
  id: number;
  title: string;
}

export default function Albums() {
  const [albums, setAlbums] = useState<AlbumObject[]>();
  const [selected, setSelected] = useOutletContext();

  const { artist } = selected;

  useEffect(() => {
    if (artist.id) {
      fetch(`/api/artists/${artist.id}/albums`)
        .then((res) => res.json())
        .then((res) => setAlbums(res.items));
    }
  }, [artist]);

  return (
    <>
      <h1>Albums</h1>

      {artist.id && (
        <p>
          Artist: <strong>{artist.name}</strong>
        </p>
      )}

      {albums && (
        <ListGroup>
          {albums.map(({ id, title }) => (
            <ListGroup.Item key={id}>
              <Link
                to="/tracks"
                onClick={() =>
                  setSelected((selected) => ({
                    ...selected,
                    album: { id, title },
                  }))
                }
              >
                {title}
              </Link>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
}
