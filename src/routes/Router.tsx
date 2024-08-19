import { Routes, Route } from 'react-router-dom';
import Login from '../pages/authentication/Login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RequestResetPassword from '@/pages/authentication/RequestResetPassword';
import VerifyPasswordReset from '@/pages/authentication/VerifyResetPassword';
import NewResetPassword from '@/pages/authentication/NewResetPassword';
import StaffDashboard from '@/pages/dashboard/StaffDashboard';
import BusinessApplicationsList from '@/pages/business/applications/BusinessApplicationsList';
import BusinessApplicationRoutes from './BusinessApplicationRoutes';
import BusinessApplicationReview from '@/pages/business-review/BusinessApplicationReview';
import AuthenticationRoutes from './AuthenticationRoutes';
import StaffAuthenticatedRoutes from '@/outlets/StaffAuthenticatedRoutes';
import LandingRoute from './LandingRoute';
import BusinessAmendmentsList from '@/pages/business/amendments/BusinessAmendmentsList';
import BusinessAmendmentsReview from '@/pages/business/amendments/BusinessAmendmentsReview';
import ApplicationsRoutes from './ApplicationsRoutes';
import BusinessAmendmentRoutes from './BusinessAmendmentRoutes';

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
        {/* BUSINESS APPLICATION ROUTES */}
        <Route element={<StaffAuthenticatedRoutes />}>
          <Route path="/applications" element={<ApplicationsRoutes />}>
            <Route path="business" element={<BusinessApplicationRoutes />}>
              <Route path="" element={<BusinessApplicationsList />} />
              <Route
                path=":id/review"
                element={<BusinessApplicationReview />}
              />
            </Route>
            <Route path="amendments" element={<BusinessAmendmentRoutes />}>
              <Route path="" element={<BusinessAmendmentsList />} />
              <Route path=":id/review" element={<BusinessAmendmentsReview />} />
            </Route>
          </Route>
        </Route>

        {/* BUSINESS AMENDMENT ROUTE */}

        {/* DEFAULT ROUTE */}
        <Route path="*" element={<LandingRoute />} />
      </Routes>
    </>
  );
};

export default Router;
