import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import MainLayout from '../Components/Layout/MainLayout';
import Error from '../Pages/Error';

// Lazy load components
const Home = lazy(() => import('../Pages/Home'));
const MyBookings = lazy(() => import('../Pages/MyBookings'));
const Blogs = lazy(() => import('../Pages/Blogs'));
const DoctorDetails = lazy(() => import('../Pages/DoctorDetails'));
const Contact = lazy(() => import('../Pages/Contact'));   // 👈 ADD THIS
const Login = lazy(() => import('../Pages/Login'));
const Dashboard = lazy(() => import('../Pages/Dashboard'));
const AIChat = lazy(() => import('../Pages/AIChat'));
import ProtectedRoute from './ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        path: '/ai-chat',
        Component: AIChat,
      },
      {
        path: '/login',
        Component: Login,
      },
      {
        path: '/dashboard',
        element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
        ),
      },

      {
        path: '/',  
        Component: Home,
      },
      {
        path: '/doctor/:id',
        Component: DoctorDetails,
      },
      {
        path: '/my-bookings',
        Component: MyBookings,
      },
      {
        path: '/blogs',
        Component: Blogs,
      },
      {
        path: '/contact',        // 👈 ADD THIS BLOCK
        Component: Contact,
      },
      
    ],
  },
  {
    path: '*',
    Component: Error,
  },
]);

export default router;