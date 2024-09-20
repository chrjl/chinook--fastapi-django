# chinook--fastapi-django_orm

A FastAPI + React full stack app for exploring data and managing playlists for the [Chinook Database](https://github.com/lerocha/chinook-database).

Backend: REST API built with FastAPI, using an implementation of [Django ORM standalone](https://github.com/dancaron/Django-ORM) for SQL database operations.

- Many-to-one relationships (e.g. `Album` → `Artist`, `Track` → `Album`, `PlaylistTrack` → `Playlist`)
- Many-to-many relationships (e.g. `PlaylistTrack` ↔ `Track`)

Frontend: React app using Bootstrap components

## Run the app

### Backend development server

In the `backend/` directory: create a virtual environment, install dependencies (FastAPI, Django), and start the dev server.

```console
cd backend

python -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

fastapi dev [--port 8000] main.py
```

The server runs on port 8000 by default.

- API docs: `localhost:8000/docs`
- Example API requests

  ```console
  curl 'localhost:8000/artists/?limit=20&offset=40' | jq
  curl 'localhost:8000/artist/22' | jq
  ```
