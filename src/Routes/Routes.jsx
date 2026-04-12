import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import MainLayout from '../Components/Layout/MainLayout';
import Error from '../Pages/Error';
import ProtectedRoute from './ProtectedRoute';

// Lazy load components
const Home = lazy(() => import('../Pages/Home'));
const MyBookings = lazy(() => import('../Pages/MyBookings'));
const DoctorDetails = lazy(() => import('../Pages/DoctorDetails'));
const Team = lazy(() => import('../Pages/Team'));
const Login = lazy(() => import('../Pages/Login'));
const Dashboard = lazy(() => import('../Pages/Dashboard'));
const AIChat = lazy(() => import('../Pages/AIChat'));
const HealthGuide = lazy(() => import('../Pages/HealthGuide'));
const HealthTools = lazy(() => import('../Pages/HealthTools'));
const DiseaseDetails = lazy(() => import('../Pages/DiseaseDetails'));

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
        path: '/health-guide',
        Component: HealthGuide,
      },
      {
        path: '/health-tools',
        Component: HealthTools,
      },
      {
        path: '/disease/:id',
        Component: DiseaseDetails,
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
        path: '/team',
        Component: Team,
      },
    ],
  },
  {
    path: '*',
    Component: Error,
  },
]);

export default router;
