import StaffLayout from '@/containers/navigation/StaffLayout';
import { useEffect, useState } from 'react';
import queryString, { ParsedQuery } from 'query-string';
import { AppDispatch, RootState } from '@/states/store';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  fetchBusinessAmendmentsThunk,
  setSelectedBusinessAmendment,
} from '@/states/features/businessAmendmentSlice';
import Loader from '@/components/inputs/Loader';
import CompanyDetailsAmendmentReview from './CompanyDetailsAmendmentReview';
import CompanyAddressAmendmentReview from './CompanyAddressAmendmentReview';
import { BusinessAmendment } from '@/types/models/business';
import { capitalizeString, formatDateTime } from '@/helpers/strings.helper';
import BusinessActivitiesAmendmentReview from './BusinessActivitiesAmendmentReview';

const BusinessAmendmentsReview = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const [queryParams, setQueryParams] = useState<ParsedQuery<string | number>>(
    {}
  );
  const {
    fetchBusinessAmendmentsIsFetching,
    fetchBusinessAmendmentsIsSuccess,
    businessAmendmentsList,
  } = useSelector((state: RootState) => state.businessAmendment);

  // NAVIGATION
  const { search } = useLocation();

  // GET PARAM FROM PATH
  useEffect(() => {
    setQueryParams(queryString.parse(search));
  }, [search]);

  // FETCH BUSINESS AMENDMENT
  useEffect(() => {
      dispatch(
        fetchBusinessAmendmentsThunk({
          businessId: queryParams?.businessId,
          searchKey: queryParams?.amendmentType,
        })
      );
  }, [dispatch, queryParams]);

  // HANDLE FETCH BUSINESS AMENDMENT RESPONSE
  useEffect(() => {
    if (fetchBusinessAmendmentsIsSuccess) {
      dispatch(setSelectedBusinessAmendment(businessAmendmentsList?.[0]));
    }
  }, [businessAmendmentsList, dispatch, fetchBusinessAmendmentsIsSuccess]);

  return (
    <StaffLayout>
      <main className="w-full flex flex-col gap-4">
        {fetchBusinessAmendmentsIsFetching ? (
          <figure className="w-full flex items-center justify-center h-[40vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          <menu className="w-full flex flex-col gap-4 p-5">
            {queryParams?.amendmentType === 'AMEND_COMPANY_DETAILS' && (
              <CompanyDetailsAmendmentReview />
            )}
            {queryParams?.amendmentType === 'AMEND_COMPANY_ADDRESS' && (
              <CompanyAddressAmendmentReview />
            )}
            {queryParams?.amendmentType === 'AMEND_BUSINESS_ACTIVITIES' && (
              <BusinessActivitiesAmendmentReview />
            )}
          </menu>
        )}
      </main>
    </StaffLayout>
  );
};

export const BusinessAmendmentRequestSummary = ({ businessAmendment }: {
  businessAmendment?: BusinessAmendment;
}) => {
  return (
    <section className="w-full flex flex-col gap-4">
      <h2 className="uppercase text-primary font-semibold text-lg">
        Company details
      </h2>
      <menu className="grid grid-cols-2 gap-5 w-full">
        <ul className="flex items-center gap-5">
          <p>Application Reference ID: </p>
          <p className="font-medium">
            {businessAmendment?.business?.applicationReferenceId}
          </p>
        </ul>
        <ul className="flex items-center gap-5">
          <p> Company name:</p>
          <p className="font-medium">
            {businessAmendment?.business?.companyName ||
              businessAmendment?.business?.branchName ||
              businessAmendment?.business?.enterpriseName ||
              businessAmendment?.business?.enterpriseBusinessName}
          </p>
        </ul>
        <ul className="flex items-center gap-5">
          <p> Application status</p>
          <p className="font-medium">
            {capitalizeString(
              businessAmendment?.business?.applicationStatus
            )}
          </p>
        </ul>
        <ul className="flex items-center gap-5">
          <p>Amendment type</p>
          <p className="font-medium">
            {capitalizeString(businessAmendment?.amendmentType)}
          </p>
        </ul>
        <ul className="flex items-center gap-5">
          <p>Company code: </p>
          <p className="font-medium">
            {businessAmendment?.business?.tin || 'N/A'}
          </p>
        </ul>
        <ul className="flex items-center gap-5">
          <p>Request date:</p>
          <p className="font-medium">
            {formatDateTime(businessAmendment?.createdAt)}
          </p>
        </ul>
      </menu>
    </section>
  );
};

export default BusinessAmendmentsReview;
