import { Routes, Route } from 'react-router-dom';
import Login from '../pages/authentication/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RequestResetPassword from '@/pages/authentication/RequestResetPassword';
import VerifyPasswordReset from '@/pages/authentication/VerifyResetPassword';
import NewResetPassword from '@/pages/authentication/NewResetPassword';
import StaffDashboard from '@/pages/dashboard/StaffDashboard';
import BusinessApplicationsList from '@/pages/applications/review/BusinessApplicationsList';
import BusinessApplicationRoutes from './BusinessApplicationRoutes';
import BusinessApplicationReview from '@/pages/business-registration/BusinessApplicationReview';
import AuthenticationRoutes from './AuthenticationRoutes';
import StaffAuthenticatedRoutes from '@/outlets/StaffAuthenticatedRoutes';

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
        {/* AUTHENTICATION ROUTES */}
        <Route path="/auth" element={<AuthenticationRoutes />}>
          <Route path="login" element={<Login />} />
          <Route
            path="reset-password/request"
            element={<RequestResetPassword />}
          />
          <Route
            path="reset-password/verify"
            element={<VerifyPasswordReset />}
          />
          <Route path="reset-password/new" element={<NewResetPassword />} />
        </Route>
        <Route path="/dashboard" element={<StaffDashboard />} />
        <Route
          path="/applications/business"
          element={<BusinessApplicationsList />}
        />
        {/* BUSINESS APPLICATION ROUTES */}
        <Route element={<StaffAuthenticatedRoutes />}>
          <Route path="/applications" element={<BusinessApplicationRoutes />}>
            <Route path=":id/review" element={<BusinessApplicationReview />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default Router;
