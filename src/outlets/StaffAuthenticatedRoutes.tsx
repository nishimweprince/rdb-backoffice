import { setToken, setUser } from '@/states/features/userSlice';
import { AppDispatch, RootState } from '@/states/store';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const StaffAuthenticatedRoutes = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { user, token } = useSelector((state: RootState) => state.user);

  if (!user || !token) {
    dispatch(setUser(undefined));
    dispatch(setToken(undefined));
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
};

export default StaffAuthenticatedRoutes;
