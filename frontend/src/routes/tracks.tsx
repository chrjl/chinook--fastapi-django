import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';

import ListGroup from 'react-bootstrap/ListGroup';

interface TrackObject {
  id: number;
  name: string;
  milliseconds: number;
  album_id: number;
}

export default function Tracks() {
  const [tracks, setTracks] = useState<TrackObject[]>([]);
  const [selected, setSelected] = useOutletContext();
  const { artist, album } = selected;

  const totalMilliseconds = tracks?.reduce(
    (total, track) => total + track.milliseconds,
    0
  );

  useEffect(() => {
    if (album) {
      fetch(`/api/albums/${album.id}/tracks`)
        .then((res) => res.json())
        .then((res) => setTracks(res.items));
    }
  }, [album]);

  return (
    <>
      <h1>Tracks</h1>

      {artist && (
        <p>
          Artist: <strong>{artist.name}</strong>
        </p>
      )}

      {album && (
        <p>
          Album: <strong>{album.title}</strong> ({timeString(totalMilliseconds)}
          )
        </p>
      )}

      {tracks && (
        <ListGroup>
          {tracks.map(({ id, name, milliseconds }) => (
            <ListGroup.Item key={id}>
              {name} ({timeString(milliseconds)})
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </>
  );
}

function timeString(milliseconds: number) {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
