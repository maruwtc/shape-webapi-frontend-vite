import React from 'react';
import type { PathRouteProps } from 'react-router-dom';

const Home = React.lazy(() => import('~/lib/pages/home'));
const Inventory = React.lazy(() => import('~/lib/pages/inventory'));
const Chat = React.lazy(() => import('~/lib/pages/chat'));
const Wishlist = React.lazy(() => import('~/lib/pages/wishlist'));
const Profile = React.lazy(() => import('~/lib/pages/profile'));
const Login = React.lazy(() => import('~/lib/pages/login'));
const Register = React.lazy(() => import('~/lib/pages/register'));

export const routes: Array<PathRouteProps> = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/inventory',
    element: <Inventory />,
  },
  {
    path: '/chat',
    element: <Chat />,
  },
  {
    path: '/wishlist',
    element: <Wishlist />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
];

export const privateRoutes: Array<PathRouteProps> = [];
