import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import Homepage from "./routes/homepage/Homepage";
import Dashboard from "./routes/dashboard/Dashboard";
import Chat from "./routes/chat/Chat";
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout.jsx';
import SignIn from "./routes/signin/SignIn";
import SignUp from "./routes/signup/SignUp";
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const AuthenticatedRoute = ({ element, isProtected = false }) => {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem("token");

  // Redirect logged-in users from sign-in or sign-up to dashboard
  if (isAuthenticated && (window.location.pathname === '/sign-in' || window.location.pathname === '/sign-up')) {
    return <Navigate to="/dashboard" />;
  }

  return isProtected && !isAuthenticated && (token === null || token === undefined)
    ? <Navigate to="/sign-in" />
    : element;
};

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage />,
  },
  {
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard",
        element: <AuthenticatedRoute element={<Dashboard />} isProtected={true} />,
      },
      {
        path: "/dashboard/chats/:id",
        element: <AuthenticatedRoute element={<Chat />} isProtected={true} />
      }
    ]
  },
  {
    path: "/sign-in",
    element: <AuthenticatedRoute element={<SignIn />} isProtected={false} />
  },
  {
    path: "/sign-up",
    element: <AuthenticatedRoute element={<SignUp />} isProtected={false} />
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
