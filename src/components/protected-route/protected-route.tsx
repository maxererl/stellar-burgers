import { useSelector } from '../../services/store';
import { getIsAuthChecked, getIsAuthenticated } from '../../services/authSlice';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(getIsAuthChecked);
  const isAuthenticated = useSelector(getIsAuthenticated);
  const location = useLocation();

  // Show preloader while checking auth status
  if (!isAuthChecked) {
    return <Preloader />;
  }

  // If route is for authenticated users only, but user is not authenticated
  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  // If route is for unauthenticated users only, but user is authenticated
  if (onlyUnAuth && isAuthenticated) {
    // Redirect back to the page they came from, or home page
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
