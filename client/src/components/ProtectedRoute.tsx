import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuthContext } from '../contexts';

export default function ProtectedRoute() {
  const { isAuth } = useAuthContext();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await isAuth();
      setIsAuthorized(res);
    };
    checkAuth();
  }, [isAuth]);

  if (isAuthorized == null) {
    return <div>Loading</div>;
  } else {
    return isAuthorized ? <Outlet /> : <Navigate to="/login" />;
  }
}
