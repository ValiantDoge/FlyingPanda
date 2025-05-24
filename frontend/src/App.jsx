import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import { FlightSearch } from './components/FlightSearch';
import Login from './pages/Login';
import Home from "./pages/Home";
import RequireAuth from './components/RequireAuth';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RequireAuth />, // Parent auth wrapper
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'search',
        element: <FlightSearch />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;