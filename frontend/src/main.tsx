import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import Root from './routes/root';
import Artists from './routes/artists';

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
        element: <div>Albums</div>,
      },
      {
        path: '/tracks',
        element: <div>Tracks</div>,
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
