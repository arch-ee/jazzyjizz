
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isLoading } = useAuth();
  
  // Show loading state if auth state is being checked
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // Redirect to login if not logged in or not admin
  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  // Render children if user is admin
  return <>{children}</>;
};

export default AdminRoute;
