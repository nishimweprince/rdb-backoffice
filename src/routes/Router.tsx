import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import { ToastContainer } from 'react-toastify'

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
      </Routes>
    </>
  );
};

export default Router;
