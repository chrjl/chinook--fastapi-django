import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import githubMark from '../assets/github-mark-white.svg';

export default function Root() {
  const [selected, setSelected] = useState({
    artist: {
      id: null,
      name: null,
    },
    album: {
      id: null,
      title: null,
    },
  });

  return (
    <>
      <Navigation />
      <Container>
        <Outlet context={[selected, setSelected]} />
      </Container>
    </>
  );
}

export function Navigation() {
  return (
    <Navbar bg="dark" data-bs-theme="dark">
      <Container>
        <Navbar.Brand>chinook</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link to="/artists" as={Link}>
            Artists
          </Nav.Link>
          <Nav.Link to="/albums" as={Link}>
            Albums
          </Nav.Link>
          <Nav.Link to="/tracks" as={Link}>
            Tracks
          </Nav.Link>
          <Nav.Link to="/genres" as={Link}>
            Genres
          </Nav.Link>
        </Nav>
        <Navbar.Text>
          <a
            href="https://github.com/chrjl/chinook--fastapi-django"
            target="_blank"
          >
            <img height="24px" src={githubMark} />
          </a>
        </Navbar.Text>
      </Container>
    </Navbar>
  );
}
