import { Routes, Route } from 'react-router-dom';
import Login from '../pages/authentication/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RequestResetPassword from '@/pages/authentication/RequestResetPassword';
import VerifyPasswordReset from '@/pages/authentication/VerifyResetPassword';
import NewResetPassword from '@/pages/authentication/NewResetPassword';
import StaffDashboard from '@/pages/dashboard/StaffDashboard';
import ReviewBusinessApplications from '@/pages/applications/review/ReviewBusinessApplications';
import BusinessApplicationRoutes from './BusinessApplicationRoutes';
import DomesticBusinessPreview from '@/pages/business-registration/domestic-business-registration/DomesticBusinessPreview';
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
          element={<ReviewBusinessApplications />}
        />
        {/* BUSINESS APPLICATION ROUTES */}
        <Route element={<StaffAuthenticatedRoutes />}>
          <Route path="/applications" element={<BusinessApplicationRoutes />}>
            <Route
              path="business-registration"
              element={<DomesticBusinessPreview />}
            />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default Router;
