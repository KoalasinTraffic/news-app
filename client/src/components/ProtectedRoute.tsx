import { Navigate, Outlet } from 'react-router';
import { useAuthContext } from '../contexts';

export default function ProtectedRoute() {
  const { isAuth } = useAuthContext();

  async () => {
    const isAuthorized = await isAuth();
    if (isAuthorized) {
      return <Outlet />;
    }
  };
  return <Navigate to="/login" />;
}
