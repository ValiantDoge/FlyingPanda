import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Home from "./pages/Home";
import RequireAuth from './components/RequireAuth';
import { Toaster } from 'react-hot-toast';
import Bookings from './pages/Bookings';


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
        path: 'bookings',
        element: <Bookings/>
      }
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);

function App() {
  return (
    <>
      {/* Toast container for notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* RouterProvider renders your routing setup */}
      <RouterProvider router={router} />
    </>
  );
}
export default App;