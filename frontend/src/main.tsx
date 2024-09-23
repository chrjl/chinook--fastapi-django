import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import Root from './routes/root';
import Artists from './routes/artists';
import Albums from './routes/albums';
import Tracks from './routes/tracks';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/artists',
        element: <Artists />,
      },
      {
        path: '/albums',
        element: <Albums />,
      },
      {
        path: '/tracks',
        element: <Tracks />,
      },
      {
        path: '/genres',
        element: <div>Genres</div>,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
