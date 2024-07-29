import { Routes, Route } from 'react-router-dom';
import Login from '../pages/authentication/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RequestResetPassword from '@/pages/authentication/RequestResetPassword';
import VerifyPasswordReset from '@/pages/authentication/VerifyResetPassword';
import NewResetPassword from '@/pages/authentication/NewResetPassword';

const Router = () => {
  return (
    <>
      <ToastContainer
        autoClose={2000}
        position="top-center"
        hideProgressBar
        closeButton={true}
        closeOnClick
      />
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route
          path="/auth/reset-password/request"
          element={<RequestResetPassword />}
        />
        <Route path='/auth/reset-password/verify' element={<VerifyPasswordReset />} />
        <Route path="/auth/reset-password/new" element={<NewResetPassword />} />
      </Routes>
    </>
  );
};

export default Router;
