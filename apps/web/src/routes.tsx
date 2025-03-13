import { createBrowserRouter } from 'react-router-dom';
// import ProtectedRoute from './components/ProtectedRoutes';
import AddMovie from './pages/AddMovie';
import EditMovie from './pages/EditMovie';
import Index from './pages/Index';
import MovieDetail from './pages/MovieDetail';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  { path: '/', element: <Index /> }, // Now '/' is protected
  { path: '/add-movie', element: <AddMovie /> },
  { path: '/edit-movie/:id', element: <AddMovie /> },
  { path: '/movie/:id', element: <MovieDetail /> },
  { path: '*', element: <NotFound /> },
]);
