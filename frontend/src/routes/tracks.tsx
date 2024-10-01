import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import DataLayout from '../utilities/data-layout';
import timestring from '../utilities/timestring';

import { ArtistObject } from './artists';
import { AlbumObject } from './albums';

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

  const [tracks, setTracks] = useState<TrackObject[]>([]);
  const [album, setAlbum] = useState<AlbumObject | null>(null);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const [search, setSearch] = useState<string | null>(null);
  const [selected, setSelected] = useState<TrackObject | null>(null);

  const limit = 20;
  const pages = Math.ceil(total / limit);

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
          genre={selected.genre}
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
      ) : null}

      <DataLayout
        pages={pages}
        page={page}
        setPage={setPage}
        setSearch={setSearch}
      >
        <ListGroup variant="flush">
          {tracks.map(({ id, name, milliseconds }) => (
            <ListGroup.Item key={id} action onClick={() => handleSelect(id)}>
              {name} ({timestring(milliseconds)})
            </ListGroup.Item>
          ))}
        </ListGroup>
      </DataLayout>
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
  genre: string;
  milliseconds: number;
  show: boolean;
  onHide: () => void;
}

function TrackModal({
  id,
  name,
  artist,
  album,
  genre,
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
        {genre ? <p>Genre: {genre}</p> : null}
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
