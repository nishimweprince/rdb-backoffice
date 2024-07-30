import BusinessPreviewCard from '@/components/applications-review/BusinessPreviewCard';
import StaffLayout from '@/containers/navigation/StaffLayout';
import { findNavigationFlowMassIdByStepName } from '@/helpers/business.helper';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import queryString, { ParsedQuery } from 'query-string';
import { useLocation } from 'react-router-dom';
import Loader from '@/components/inputs/Loader';
import {
  fetchBusinessActivitiesThunk,
  fetchBusinessAddressThunk,
  fetchBusinessDetailsThunk,
  getchBusinessThunk,
} from '@/states/features/businessSlice';
import { UUID } from 'crypto';
import { capitalizeString } from '@/helpers/strings.helper';
import BusinessPeopleTable from '../BusinessPeopleTable';
import { fetchBoardOfDirectorsThunk } from '@/states/features/boardOfDirectorsSlice';

const DomesticBusinessPreview = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { navigationFlowMassList } = useSelector(
    (state: RootState) => state.navigationFlow
  );
  const {
    business,
    getBusinessIsSuccess,
    getBusinessIsFetching,
    businessDetails,
    businessAddress,
    businessActivitiesList,
  } = useSelector((state: RootState) => state.business);
  const { boardOfDirectorsList } = useSelector(
    (state: RootState) => state.boardOfDirectors
  );
  const [queryParams, setQueryParams] = useState<ParsedQuery<string | number>>(
    {}
  );
  // NAVIGATION
  const { search } = useLocation();

  useEffect(() => {
    setQueryParams(queryString.parse(search));
  }, [search]);

  // FETCH BUSINESS
  useEffect(() => {
    if (queryParams?.businessId) {
      dispatch(getchBusinessThunk(queryParams?.businessId as UUID));
    }
  }, [dispatch, queryParams?.businessId]);

  // FETCH BUSINESS DETAILS
  useEffect(() => {
    if (queryParams?.businessId) {
      dispatch(
        fetchBusinessDetailsThunk({
          businessId: queryParams?.businessId,
        })
      );
    }
  }, [dispatch, queryParams?.businessId]);

  // FETCH BUSINESS ADDRESS
  useEffect(() => {
    if (queryParams?.businessId) {
      dispatch(
        fetchBusinessAddressThunk({
          businessId: queryParams?.businessId,
        })
      );
    }
  }, [dispatch, queryParams?.businessId]);

  // FETCH BUSINESS ACTIVITIES LIST
  useEffect(() => {
    if (queryParams?.businessId) {
      dispatch(
        fetchBusinessActivitiesThunk({
          businessId: queryParams?.businessId,
        })
      );
    }
  }, [dispatch, queryParams?.businessId]);

  // FETCH BOARD OF DIRECTORS
  useEffect(() => {
    if (queryParams?.businessId) {
      dispatch(
        fetchBoardOfDirectorsThunk({
          businessId: queryParams?.businessId,
          route: 'board-member',
        })
      );
    }
  }, [dispatch, queryParams?.businessId]);

  return (
    <StaffLayout>
      <main className="w-[95%] mx-auto flex flex-col gap-5">
        <h1 className="text-center uppercase font-bold text-primary text-xl">
          {business?.companyName ||
            business?.branchName ||
            business?.enterpriseBusinessName ||
            business?.enterpriseName}{' '}
          Review
        </h1>
        {getBusinessIsFetching ? (
          <figure className="flex items-center w-full min-h-[60vh] justify-center">
            <Loader className="text-primary" />
          </figure>
        ) : getBusinessIsSuccess ? (
          <main className="flex flex-col gap-4 w-full">
            {/* COMPANY DETAILS */}
            <BusinessPreviewCard
              applicationStatus={business?.applicationStatus}
              businessId={queryParams?.businessId}
              header="Company Details"
              navigationFlowMassId={findNavigationFlowMassIdByStepName(
                navigationFlowMassList,
                'Company Details'
              )}
            >
              <menu className="flex flex-col gap-2">
                {businessDetails ? (
                  Object?.entries(businessDetails ?? {})?.map(
                    ([key, value], index: number) => {
                      if (
                        value === null ||
                        ['createdAt', 'updatedAt', 'isForeign', 'id'].includes(
                          key
                        )
                      )
                        return null;
                      if (key === 'service')
                        return (
                          <p key={index}>
                            {capitalizeString(key)}:{' '}
                            {capitalizeString(
                              String(
                                (
                                  value as unknown as {
                                    name: string;
                                  }
                                )?.name
                              )
                            )}
                          </p>
                        );
                      return (
                        <li key={index}>
                          <p className="flex text-[14px] items-center gap-2">
                            {capitalizeString(key)}:{' '}
                            {capitalizeString(String(value))}
                          </p>
                        </li>
                      );
                    }
                  )
                ) : (
                  <p>No data</p>
                )}
              </menu>
            </BusinessPreviewCard>

            {/* COMPANY ADDRESS */}
            <BusinessPreviewCard
              applicationStatus={business?.applicationStatus}
              businessId={queryParams?.businessId}
              header="Company Address"
              navigationFlowMassId={findNavigationFlowMassIdByStepName(
                navigationFlowMassList,
                'Company Address'
              )}
            >
              <menu className="flex flex-col gap-2">
                {businessAddress ? (
                  Object?.entries(businessAddress ?? {})?.map(
                    ([key, value], index: number) => {
                      if (
                        value === null ||
                        ['createdAt', 'updatedAt', 'id'].includes(key)
                      )
                        return null;
                      if (key === 'location') {
                        return (
                          <menu
                            key={index}
                            className="flex w-full flex-col gap-2"
                          >
                            {Object.entries(value).map(
                              ([key, value], index) => {
                                if (
                                  value === null ||
                                  ['createdAt', 'updatedAt', 'id'].includes(key)
                                )
                                  return null;
                                return (
                                  <p key={index}>
                                    {capitalizeString(key)}:{' '}
                                    {capitalizeString(String(value))}
                                  </p>
                                );
                              }
                            )}
                          </menu>
                        );
                      }
                      return (
                        <li key={index}>
                          <p className="flex text-[14px] items-center gap-2">
                            {capitalizeString(key)}:{' '}
                            {capitalizeString(String(value))}
                          </p>
                        </li>
                      );
                    }
                  )
                ) : (
                  <p>No data</p>
                )}
              </menu>
            </BusinessPreviewCard>

            {/* BUSINESS ACTIVITIES */}
            <BusinessPreviewCard
              applicationStatus={business?.applicationStatus}
              businessId={queryParams?.businessId}
              header="Business Activities & VAT"
              navigationFlowMassId={findNavigationFlowMassIdByStepName(
                navigationFlowMassList,
                'Business Activity & VAT'
              )}
            >
              <menu className="flex flex-col gap-3">
                <p className="flex items-center gap-1">
                  <span className="font-medium"> Main business activity:</span>{' '}
                  {String(businessActivitiesList?.mainBusinessActivity)}
                </p>
                <ul className="flex flex-col gap-2 w-full">
                  <h3 className="font-medium underline uppercase">
                    Business lines
                  </h3>
                  {businessActivitiesList?.businessLine?.map(
                    (businessActivity) => {
                      return (
                        <li
                          key={businessActivity.code}
                          className="flex items-center gap-1"
                        >
                          <p className="text-[14px] font-semibold">
                            {businessActivity.code}
                          </p>{' '}
                          -
                          <p className="text-[14px]">
                            {businessActivity.description}
                          </p>
                        </li>
                      );
                    }
                  )}
                </ul>
              </menu>
            </BusinessPreviewCard>

            {/* BOARD OF DIRECTORS */}
            <BusinessPreviewCard
              applicationStatus={business?.applicationStatus}
              businessId={queryParams?.businessId}
              header="Board of Directors"
              navigationFlowMassId={findNavigationFlowMassIdByStepName(
                navigationFlowMassList,
                'Board of Directors'
              )}
            >
              <BusinessPeopleTable
                businessPeopleList={boardOfDirectorsList ?? []}
              />
            </BusinessPreviewCard>
          </main>
        ) : (
          <figure className="flex items-center w-full min-h-[60vh] justify-center">
            <p className="text-primary text-lg font-medium">
              Business not found
            </p>
          </figure>
        )}
      </main>
    </StaffLayout>
  );
};

export default DomesticBusinessPreview;
