import BusinessPreviewCard from '@/components/applications-review/BusinessPreviewCard';
import StaffLayout from '@/containers/navigation/StaffLayout';
import { findNavigationFlowByStepName } from '@/helpers/business.helper';
import { AppDispatch, RootState } from '@/states/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '@/components/inputs/Loader';
import {
  fetchBusinessAddressThunk,
  fetchBusinessAttachmentsThunk,
  fetchBusinessDetailsThunk,
  fetchBusinessEmploymentInfoThunk,
  fetchBusinessGeneralCommentsThunk,
  getBusinessThunk,
  setApproveBusinessIsSuccess,
  setBusinessConfirmApproveModal,
  setBusinessConfirmRejectModal,
  setBusinessRecommendForApprovalModal,
  setBusinessRecommendForRejectionModal,
  setRejectBusinessIsSuccess,
  setSelectedBusiness,
  setUpdateBusinessIsSuccess,
  updateBusinessThunk,
} from '@/states/features/businessSlice';
import { UUID } from 'crypto';
import { capitalizeString } from '@/helpers/strings.helper';
import BusinessPeopleTable from './BusinessPeopleTable';
import { fetchBoardOfDirectorsThunk } from '@/states/features/boardOfDirectorsSlice';
import {
  fetchBusinessNavigationFlowsThunk,
  fetchNavigationFlowMassThunk,
} from '@/states/features/navigationFlowSlice';
import { fetchExecutiveManagementListThunk } from '@/states/features/executiveManagementSlice';
import moment from 'moment';
import { fetchFounderDetailsListThunk } from '@/states/features/founderDetailSlice';
import FounderDetailsTable from './FounderDetailsTable';
import BusinessAttachmentsTable from './BusinessAttachmentsTable';
import Button from '@/components/inputs/Button';
import CustomBreadcrumb from '@/components/navigation/CustomBreadcrumb';
import { navigationPaths } from '@/constants/dashboard.constants';
import { fetchBusinessActivitiesThunk } from '@/states/features/businessActivitiesSlice';
import CreateBusinessReviewComment from './CreateBusinessReviewComment';
import ListBusinessReviewComments from './ListBusinessReviewComments';
import DeleteBusinessReviewComment from './DeleteBusinessReviewComment';
import UpdateBusinessReviewComment from './UpdateBusinessReviewComment';
import { businessId } from '@/types/models/business';
import Table from '@/components/table/Table';
import { businessLineColumns } from '@/constants/business.constants';
import BusinessRecommendForRejection from './BusinessRecommendForRejection';
import BusinessRecommendForApproval from './BusinessRecommendForApproval';
import BusinessConfirmReject from './BusinessConfirmReject';
import BusinessConfirmApprove from './BusinessConfirmApprove';
import BusinessGeneralComments from './BusinessGeneralComments';

const BusinessApplicationReview = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const { businessNavigationFlowsList, businessNavigationFlowsIsFetching } =
    useSelector((state: RootState) => state.navigationFlow);
  const {
    business,
    getBusinessIsSuccess,
    getBusinessIsFetching,
    businessDetails,
    businessAddress,
    businessEmploymentInfo,
    businessAttachmentsList,
    businessEmploymentInfoIsSuccess,
    updateBusinessIsLoading,
    updateBusinessIsSuccess,
    businessEmploymentInfoIsFetching,
    rejectBusinessIsLoading,
    rejectBusinessIsSuccess,
    approveBusinessIsLoading,
    approveBusinessIsSuccess,
  } = useSelector((state: RootState) => state.business);
  const {
    boardOfDirectorsList,
    boardOfDirectorsIsFetching,
    boardOfDirectorsIsSuccess,
  } = useSelector((state: RootState) => state.boardOfDirectors);
  const {
    executiveManagementList,
    executiveManagementIsFetching,
    executiveManagementIsSuccess,
  } = useSelector((state: RootState) => state.executiveManagement);
  const {
    founderDetailsList,
    founderDetailsIsSuccess,
    founderDetailsIsFetching,
  } = useSelector((state: RootState) => state.founderDetail);
  const {
    businessActivitiesList,
    businessActivitiesIsFetching,
    businessActivitiesIsSuccess,
  } = useSelector((state: RootState) => state.businessActivities);
  const { businessReviewCommentsList } = useSelector(
    (state: RootState) => state.businessReviewComment
  );

  // NAVIGATION
  const { id: businessId } = useParams<{ id: UUID }>();
  const navigate = useNavigate();

  // FETCH BUSINESS GENERAL COMMENTS
  useEffect(() => {
    dispatch(
      fetchBusinessGeneralCommentsThunk({
        businessId: businessId as businessId,
      })
    );
  }, [dispatch, businessId]);

  // FETCH BUSINESS
  useEffect(() => {
    if (businessId) {
      dispatch(getBusinessThunk(businessId as UUID));
    }
  }, [dispatch, businessId]);

  // FETCH NAVIGATION FLOW MASS
  useEffect(() => {
    dispatch(
      fetchNavigationFlowMassThunk({
        businessType: 'domestic',
      })
    );
  }, [dispatch]);

  // FETCH BUSINESS DETAILS
  useEffect(() => {
    if (businessId) {
      dispatch(
        fetchBusinessDetailsThunk({
          businessId: businessId,
        })
      );
    }
  }, [dispatch, businessId]);

  // FETCH BUSINESS ADDRESS
  useEffect(() => {
    if (businessId) {
      dispatch(
        fetchBusinessAddressThunk({
          businessId: businessId,
        })
      );
    }
  }, [dispatch, businessId]);

  // FETCH BUSINESS ACTIVITIES LIST
  useEffect(() => {
    if (businessId) {
      dispatch(
        fetchBusinessActivitiesThunk({
          businessId: businessId,
        })
      );
    }
  }, [dispatch, businessId]);

  // FETCH BOARD OF DIRECTORS
  useEffect(() => {
    if (businessId) {
      dispatch(
        fetchBoardOfDirectorsThunk({
          businessId: businessId,
          route: 'board-member',
        })
      );
    }
  }, [dispatch, businessId]);

  // FETCH EXECUTIVE MANAGEMENT
  useEffect(() => {
    if (businessId) {
      dispatch(
        fetchExecutiveManagementListThunk({
          businessId: businessId,
          route: 'management',
        })
      );
    }
  }, [dispatch, businessId]);

  // FETCH BUSINESS EMPLOYMENT INFO
  useEffect(() => {
    if (businessId) {
      dispatch(
        fetchBusinessEmploymentInfoThunk({
          businessId: businessId,
        })
      );
    }
  }, [dispatch, businessId]);

  // FETCH FOUNDER DETAILS
  useEffect(() => {
    if (businessId) {
      dispatch(
        fetchFounderDetailsListThunk({
          businessId: businessId,
        })
      );
    }
  }, [dispatch, businessId]);

  // FETCH BUSINESS ATTACHMENTS
  useEffect(() => {
    if (businessId) {
      dispatch(fetchBusinessAttachmentsThunk({ businessId: businessId }));
    }
  }, [dispatch, businessId]);

  // FETCH BUSINESS NAVIGATION FLOWS
  useEffect(() => {
    if (businessId) {
      dispatch(
        fetchBusinessNavigationFlowsThunk({
          businessId,
        })
      );
    }
  }, [dispatch, businessId]);

  // NAVIGATION LINKS
  const navigationLinks = [
    ...navigationPaths,
    {
      label: 'Applications',
      route: '/applications/business',
    },
    {
      label:
        (
          business?.companyName ||
          business?.branchName ||
          business?.enterpriseBusinessName ||
          business?.enterpriseName
        )?.toUpperCase() || 'Business',
      route: `/applications/${businessId}/review`,
    },
  ];

  // HANDLE UPDATE BUSINESS RESPONSE
  useEffect(() => {
    if (
      updateBusinessIsSuccess ||
      rejectBusinessIsSuccess ||
      approveBusinessIsSuccess
    ) {
      dispatch(setUpdateBusinessIsSuccess(false));
      dispatch(setRejectBusinessIsSuccess(false));
      dispatch(setApproveBusinessIsSuccess(false));
      navigate(`/applications/business`);
    }
  }, [
    approveBusinessIsSuccess,
    dispatch,
    navigate,
    rejectBusinessIsSuccess,
    updateBusinessIsSuccess,
  ]);

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
        <CustomBreadcrumb navigationLinks={navigationLinks} />

        {getBusinessIsFetching || businessNavigationFlowsIsFetching ? (
          <figure className="flex items-center w-full min-h-[60vh] justify-center">
            <Loader className="text-primary" />
          </figure>
        ) : getBusinessIsSuccess && businessNavigationFlowsList?.length > 0 ? (
          <main className="flex flex-col gap-4 w-full">
            {/* COMPANY DETAILS */}
            <BusinessPreviewCard
              applicationStatus={business?.applicationStatus}
              businessId={businessId}
              header={`${
                business?.enterpriseName || business?.enterpriseBusinessName
                  ? 'Enterprise'
                  : 'Company'
              }  Details`}
              businessNavigationFlow={findNavigationFlowByStepName(
                businessNavigationFlowsList,
                `${
                  business?.enterpriseName || business?.enterpriseBusinessName
                    ? 'Enterprise'
                    : 'Company'
                } Details`
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
              businessId={businessId}
              header={`${
                business?.enterpriseName || business?.enterpriseBusinessName
                  ? 'Enterprise'
                  : 'Company'
              } Address`}
              businessNavigationFlow={findNavigationFlowByStepName(
                businessNavigationFlowsList,
                `${
                  business?.enterpriseName || business?.enterpriseBusinessName
                    ? 'Enterprise'
                    : 'Company'
                } Address`
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
            {businessActivitiesIsFetching ? (
              <figure className="min-h-[10vh] flex items-center justify-center w-full">
                <Loader className="text-primary" />
              </figure>
            ) : (
              businessActivitiesIsSuccess &&
              Object.keys(businessActivitiesList ?? {})?.length > 0 && (
                <BusinessPreviewCard
                  applicationStatus={business?.applicationStatus}
                  businessId={businessId}
                  header="Business Activities & VAT"
                  businessNavigationFlow={findNavigationFlowByStepName(
                    businessNavigationFlowsList,
                    'Business Activity & VAT'
                  )}
                >
                  <menu className="flex flex-col gap-2">
                    <h3 className="flex items-center gap-2 font-medium underline uppercase text-primary">
                      Main business activity:{' '}
                    </h3>
                    <p>
                      <Table
                        showPagination={false}
                        data={[
                          {
                            description:
                              businessActivitiesList?.mainBusinessActivity,
                            code: businessActivitiesList?.mainBusinessActivityCode,
                          },
                        ]}
                        columns={businessLineColumns}
                      />
                    </p>
                    <article>
                      <h3 className="flex items-center gap-2 font-medium underline uppercase text-primary">
                        Other activities
                      </h3>
                      <Table
                        data={businessActivitiesList?.businessLine || []}
                        columns={businessLineColumns}
                      />
                    </article>
                  </menu>
                </BusinessPreviewCard>
              )
            )}

            {/* BOARD OF DIRECTORS */}
            {boardOfDirectorsIsFetching ? (
              <figure className="w-full min-h-[10vh] flex items-center justify-center">
                <Loader className="text-primary" />
              </figure>
            ) : (
              boardOfDirectorsIsSuccess &&
              boardOfDirectorsList?.length > 0 && (
                <BusinessPreviewCard
                  applicationStatus={business?.applicationStatus}
                  businessId={businessId}
                  header="Board of Directors"
                  businessNavigationFlow={findNavigationFlowByStepName(
                    businessNavigationFlowsList,
                    'Board of Directors'
                  )}
                >
                  <BusinessPeopleTable
                    businessPeopleList={boardOfDirectorsList ?? []}
                  />
                </BusinessPreviewCard>
              )
            )}

            {/* EXECUTIVE MANAGEMENT */}
            {executiveManagementIsFetching ? (
              <figure className="min-h-[10vh] flex items-center justify-center w-full">
                <Loader className="text-primary" />
              </figure>
            ) : (
              executiveManagementIsSuccess &&
              executiveManagementList?.length > 0 && (
                <BusinessPreviewCard
                  applicationStatus={business?.applicationStatus}
                  businessId={businessId}
                  header="Executive Management"
                  businessNavigationFlow={findNavigationFlowByStepName(
                    businessNavigationFlowsList,
                    'Executive Management'
                  )}
                >
                  <BusinessPeopleTable
                    businessPeopleList={executiveManagementList ?? []}
                  />
                </BusinessPreviewCard>
              )
            )}

            {/* SHAREHOLDERS */}
            {founderDetailsIsFetching ? (
              <figure className="min-h-[10vh] flex items-center justify-center w-full">
                <Loader className="text-primary" />
              </figure>
            ) : (
              founderDetailsIsSuccess &&
              founderDetailsList?.length > 0 && (
                <BusinessPreviewCard
                  applicationStatus={business?.applicationStatus}
                  header="Shareholders"
                  businessId={businessId}
                  businessNavigationFlow={findNavigationFlowByStepName(
                    businessNavigationFlowsList,
                    'Shareholders'
                  )}
                >
                  <FounderDetailsTable
                    founderDetailsList={founderDetailsList}
                  />
                </BusinessPreviewCard>
              )
            )}

            {/* EMPLOYMENT INFO */}
            {businessEmploymentInfoIsFetching ? (
              <figure className="w-full flex items-center justify-center min-h-[10vh]">
                <Loader className="text-primary" />
              </figure>
            ) : (
              businessEmploymentInfoIsSuccess && (
                <BusinessPreviewCard
                  applicationStatus={business?.applicationStatus}
                  businessId={businessId}
                  header="Employment Information"
                  businessNavigationFlow={findNavigationFlowByStepName(
                    businessNavigationFlowsList,
                    'Employment Info'
                  )}
                >
                  <menu className="flex flex-col gap-2">
                    <p>
                      Working Start Time:{' '}
                      {businessEmploymentInfo?.workingStartTime}
                    </p>
                    <p>
                      Working End Time: {businessEmploymentInfo?.workingEndTime}
                    </p>
                    <p>
                      Number Of Employees:{' '}
                      {businessEmploymentInfo?.numberOfEmployees}
                    </p>
                    <p>
                      Hiring Date:{' '}
                      {new Date(
                        String(businessEmploymentInfo?.hiringDate)
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      Employment Declaration Date:{' '}
                      {new Date(
                        String(
                          businessEmploymentInfo?.employmentDeclarationDate
                        )
                      ).toLocaleDateString()}
                    </p>
                    <p>
                      Financial Year Start Date:{' '}
                      {moment(
                        businessEmploymentInfo?.financialYearStartDate
                      ).format('MMMM DD')}
                    </p>
                    <p>
                      Financial Year End Date:{' '}
                      {moment(businessEmploymentInfo?.financialYearEndDate)
                        .subtract(1, 'day')
                        .format('MMMM DD')}
                    </p>
                  </menu>
                </BusinessPreviewCard>
              )
            )}

            {/* BUSINESS ATTACHMENTS */}
            <BusinessPreviewCard
              applicationStatus={business?.applicationStatus}
              header="Business Attachments"
              businessId={businessId}
              businessNavigationFlow={findNavigationFlowByStepName(
                businessNavigationFlowsList,
                'Attachments'
              )}
            >
              <BusinessAttachmentsTable
                businessAttachmentsList={businessAttachmentsList}
              />
            </BusinessPreviewCard>

            {/* BUSINESS REVIEW COMMENTS */}
            <section className='w-full'>
            <BusinessGeneralComments business={business} />
            </section>

            {['SUBMITTED', 'RESUBMITTED', 'IN_REVIEW'].includes(
              business?.applicationStatus
            ) &&
              !business?.enterpriseName && (
                <menu className="w-full flex items-center gap-3 justify-between my-4">
                  <Button route="/applications/business">Cancel</Button>

                  <Button
                    danger
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(setSelectedBusiness(business));
                      dispatch(setBusinessRecommendForRejectionModal(true));
                    }}
                  >
                    Recommend for rejection
                  </Button>

                  <Button
                    primary
                    disabled={
                      businessReviewCommentsList?.filter(
                        (reviewComment) =>
                          !['REJECTED', 'APPROVED'].includes(
                            reviewComment?.status
                          )
                      )?.length > 0
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(setSelectedBusiness(business));
                      dispatch(setBusinessRecommendForApprovalModal(true));
                    }}
                  >
                    {updateBusinessIsLoading ? (
                      <Loader />
                    ) : (
                      'Recommend for approval'
                    )}
                  </Button>
                  <Button
                    primary
                    disabled={
                      businessReviewCommentsList?.filter(
                        (reviewComment) =>
                          !['REJECTED', 'APPROVED'].includes(
                            reviewComment?.status
                          )
                      )?.length <= 0
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(
                        updateBusinessThunk({
                          businessId: businessId as businessId,
                          applicationStatus: 'ACTION_REQUIRED',
                        })
                      );
                    }}
                  >
                    {updateBusinessIsLoading ? (
                      <Loader />
                    ) : (
                      'Return for correction'
                    )}
                  </Button>
                </menu>
              )}
            {(['PENDING_DECISION', 'PENDING_REJECTION'].includes(
              business?.applicationStatus
            ) ||
              business?.enterpriseName) && (
              <menu className="w-full flex items-center gap-3 justify-between mt-5 mb-3">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/applications/business');
                  }}
                >
                  Back
                </Button>
                <Button
                  primary
                  danger
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setSelectedBusiness(business));
                    dispatch(setBusinessConfirmRejectModal(true));
                  }}
                >
                  {rejectBusinessIsLoading ? <Loader /> : 'Reject'}
                </Button>
                <Button
                  primary
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(setSelectedBusiness(business));
                    dispatch(setBusinessConfirmApproveModal(true));
                  }}
                >
                  {approveBusinessIsLoading ? <Loader /> : 'Approve'}
                </Button>
                <Button
                  primary
                  disabled={
                    businessReviewCommentsList?.filter(
                      (reviewComment) =>
                        !['REJECTED', 'APPROVED'].includes(
                          reviewComment?.status
                        )
                    )?.length <= 0
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(
                      updateBusinessThunk({
                        businessId: businessId as businessId,
                        applicationStatus: 'ACTION_REQUIRED',
                      })
                    );
                  }}
                >
                  {updateBusinessIsLoading ? (
                    <Loader />
                  ) : (
                    'Return for correction'
                  )}
                </Button>
              </menu>
            )}
          </main>
        ) : (
          <figure className="flex items-center w-full min-h-[60vh] justify-center">
            <p className="text-primary text-lg font-medium">
              Business not found
            </p>
          </figure>
        )}
      </main>
      <CreateBusinessReviewComment />
      <ListBusinessReviewComments />
      <DeleteBusinessReviewComment />
      <UpdateBusinessReviewComment />
      <BusinessRecommendForRejection />
      <BusinessRecommendForApproval />
      <BusinessConfirmReject />
      <BusinessConfirmApprove />
    </StaffLayout>
  );
};

export default BusinessApplicationReview;
