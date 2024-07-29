import { RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const StaffAuthenticatedRoutes = () => {
  const { user, token } = useSelector((state: RootState) => state.user);

  if (!user || !token) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
};

export default StaffAuthenticatedRoutes;
