import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import Root from './routes/root';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/artists',
        element: <div>Artists</div>,
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
