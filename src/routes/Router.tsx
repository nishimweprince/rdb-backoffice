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
import BusinessAmendmentReview from '@/pages/business/amendments/BusinessAmendmentReview';
import ApplicationsRoutes from './ApplicationsRoutes';
import BusinessAmendmentRoutes from './BusinessAmendmentRoutes';
import RegistrarGeneral from '@/pages/settings/registrar-general';
import AmendedBusinessesList from '@/pages/business/amendments/AmendedBusinessesList';
import BusinessAmendmentsList from '@/pages/business/amendments/BusinessAmendmentsList';
import ControlPanel from '@/pages/settings/control-panel';
import ListBusinessActivities from '@/pages/settings/business-activities/ListBusinessActivities';
import NameReservationsList from '@/pages/name-reservation/NameReservationsList';
import NameReservationDetails from '@/pages/name-reservation/NameReservationDetails';
import NameAvailabilitySearch from '@/pages/name-availability/NameAvailability';
import CurrencySettings from "@/pages/settings/currency-settings/CurrencySettings"

const Router = () => {
  return (
    <>
      <ToastContainer
        autoClose={3000}
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
              <Route path="amendments" element={<AmendedBusinessesList />} />
            </Route>
            <Route path="amendments" element={<BusinessAmendmentRoutes />}>
              <Route path="" element={<BusinessAmendmentsList />} />
              <Route path=":id/review" element={<BusinessAmendmentReview />} />
            </Route>
            <Route
              path="name-reservations"
              element={<NameReservationsList />}
            />
            <Route
              path="name-reservations/:id/details"
              element={<NameReservationDetails />}
            />
            <Route path="name-availability"
              element={<NameAvailabilitySearch />}
            />
          </Route>
        </Route>

        {/* SETTINGS ROUTES */}
        <Route path="/settings" element={<StaffAuthenticatedRoutes />}>
          <Route path="registrar-general" element={<RegistrarGeneral />} />
          <Route
            path="business-activities"
            element={<ListBusinessActivities />}
          />
          <Route path="currency" element={<CurrencySettings />} />
        </Route>
        <Route path="/settings" element={<StaffAuthenticatedRoutes />}>
          <Route path="control-panel" element={<ControlPanel />} />
        </Route>

        {/* BUSINESS AMENDMENT ROUTE */}
      </Routes>
    </>
  );
};

export default Router;
