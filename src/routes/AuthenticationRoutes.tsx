import { RootState } from '@/states/store';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

const AuthenticationRoutes = () => {
  // STATE VARIABLES
  const { user, token } = useSelector((state: RootState) => state.user);

  // NAVIGATION
  const navigate = useNavigate();

  // HANDLE REDIRECT
  if (user && token) {
    navigate('/dashboard');
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthenticationRoutes;
