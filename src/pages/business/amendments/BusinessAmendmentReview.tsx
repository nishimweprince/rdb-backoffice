import StaffLayout from '@/containers/navigation/StaffLayout';
import { useEffect } from 'react';
import { AppDispatch, RootState } from '@/states/store';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorResponse, useNavigate, useParams } from 'react-router-dom';
import {
  addToBusinessAmendmentReviewComments,
  approveAmendmentThunk,
  recommendAmendmentForApprovalThunk,
  recommendAmendmentRejectionThunk,
  rejectAmendmentThunk,
  setBusinessAmendmentDetails,
  updateBusinessAmendmentStatusThunk,
} from '@/states/features/businessAmendmentSlice';
import Loader from '@/components/inputs/Loader';
import CompanyDetailsAmendmentReview from './CompanyDetailsAmendmentReview';
import CompanyAddressAmendmentReview from './CompanyAddressAmendmentReview';
import { BusinessAmendment } from '@/types/models/business';
import { capitalizeString, formatDateTime } from '@/helpers/strings.helper';
import BusinessActivitiesAmendmentReview from './BusinessActivitiesAmendmentReview';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import TextArea from '@/components/inputs/TextArea';
import Button from '@/components/inputs/Button';
import { InputErrorMessage } from '@/components/feedback/ErrorLabels';
import { useCreateAmendmentReviewCommentMutation } from '@/states/api/businessRegApiSlice';
import { toast } from 'react-toastify';
import CustomTooltip from '@/components/inputs/CustomTooltip';
import DeleteAmendmentReviewComment from './DeleteAmendmentReviewComment';
import BusinessFounderAmendmentReview from './BusinessFounderAmendmentReview';
import BusinessBoardMemberAmendmentReview from './BusinessBoardMemberAmendmentReview';
import ExecutiveMemberAmendmentReview from './ExecutiveMemberAmendmentReview';
import EmploymentInfoAmendmentReview from './EmploymentInfoAmendmentReview';
import { navigationPaths } from '@/constants/dashboard.constants';
import CustomBreadcrumb from '@/components/navigation/CustomBreadcrumb';
import BusinessAttachmentsTable from '@/pages/business-review/BusinessAttachmentsTable';
import BusinessDormancyDeclarationReview from './BusinessDormancyDeclarationReview';
import BusinessCessationToDormancyReview from './BusinessCessationToDormancyReview';
import BusinessNewBranchReview from './BusinessNewBranchReview';
import TransferOfRegistrationReview from './TransferOfRegistrationReview';
import CloseBusinessAmendmentReview from './CloseBusinessAmendmentReview';
import RestoreBusinessAmendmentReview from './RestoreBusinessAmendmentReview';
import { useLazyGetAmendmentDetailsQuery } from '@/states/api/businessRegQueryApiSlice';
import BusinessAmendmentReviewComments from './BusinessAmendmentReviewComments';
import UpdateAmendmentReviewComment from './UpdateAmendmentReviewComment';

const BusinessAmendmentReview = () => {
  // STATE VARIABLES
  const dispatch: AppDispatch = useDispatch();
  const {
    businessAmendmentsList,
    businessAmendmentDetails,
    businessAmendmentReviewComments,
    updateBusinessAmendmentStatusIsLoading,
    updateBusinessAmendmentStatusIsSuccess,
    recommendAmendmentForApprovalIsLoading,
    recommendAmendmentForApprovalIsSuccess,
    rejectAmendmentIsLoading,
    rejectAmendmentIsSuccess,
    approveAmendmentIsLoading,
    approveAmendmentIsSuccess,
    recommendAmendmentRejectionIsLoading,
    recommendAmendmentRejectionIsSuccess,
  } = useSelector((state: RootState) => state.businessAmendment);

  // NAVIGATION
  const { id } = useParams();
  const navigate = useNavigate();

  // REACT HOOK FORM
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  // INITIALIZE CREATE AMENDMENT REVEW COMMENT MUTATION
  const [
    createAmendmentReviewComment,
    {
      isSuccess: createAmendmentReviewCommentIsSuccess,
      isLoading: createAmendmentReviewCommentIsLoading,
      isError: createAmendmentReviewCommentIsError,
      error: createAmendmentReviewError,
      reset: resetCreateAmendmentReviewComment,
      data: createAmendmentReviewCommentData,
    },
  ] = useCreateAmendmentReviewCommentMutation();

  // HANDLE FORM SUBMISSION
  const onSubmit = (data: FieldValues) => {
    createAmendmentReviewComment({
      comment: data?.amendmentReviewComment,
      amendmentDetailId: businessAmendmentDetails?.id,
      status: 'SUBMITTED',
    });
  };

  // INITIALIZE GET AMENDMENT DETAILS QUERY
  const [
    getAmendmentDetails,
    {
      data: getAmendmentDetailsData,
      error: getAmendmentDetailsError,
      isFetching: getAmendmentDetailsIsFetching,
      isSuccess: getAmendmentDetailsIsSuccess,
      isError: getAmendmentDetailsIsError,
    },
  ] = useLazyGetAmendmentDetailsQuery();

  // GET AMENDMENT DETAILS
  useEffect(() => {
    if (id) {
      getAmendmentDetails({
        id,
      });
    }
  }, [id, getAmendmentDetails]);

  // HANDLE FETCH BUSINESS AMENDMENT RESPONSE
  useEffect(() => {
    if (getAmendmentDetailsIsSuccess) {
      dispatch(setBusinessAmendmentDetails(getAmendmentDetailsData?.data));
    } else if (getAmendmentDetailsIsError) {
      const errorResponse =
        (getAmendmentDetailsError as ErrorResponse)?.data?.message ||
        'Failed to fetch amendment details';
      toast.error(errorResponse);
    }
  }, [
    businessAmendmentsList,
    dispatch,
    getAmendmentDetailsData?.data,
    getAmendmentDetailsError,
    getAmendmentDetailsIsError,
    getAmendmentDetailsIsSuccess,
  ]);

  // HANDLE CREATE AMENDMENT REVIEW COMMENT RESPONSE
  useEffect(() => {
    if (createAmendmentReviewCommentIsSuccess) {
      resetCreateAmendmentReviewComment();
      setValue('amendmentReviewComment', '');
      dispatch(
        addToBusinessAmendmentReviewComments(
          createAmendmentReviewCommentData?.data
        )
      );
    } else if (createAmendmentReviewCommentIsError) {
      const errorResponse =
        (createAmendmentReviewError as ErrorResponse)?.data?.message ||
        'Failed to create amendment review comment';
      toast.error(errorResponse);
    }
  }, [
    createAmendmentReviewCommentData?.data,
    createAmendmentReviewCommentIsError,
    createAmendmentReviewCommentIsSuccess,
    createAmendmentReviewError,
    dispatch,
    resetCreateAmendmentReviewComment,
    setValue,
  ]);

  // HANDLE UPDATE BUSINESS AMENDMENT STATUS RESPONSE
  useEffect(() => {
    if (updateBusinessAmendmentStatusIsSuccess) {
      navigate(
        `/applications/amendments?businessId=${businessAmendmentDetails?.businessId}`
      );
      window.location.reload();
    }
  }, [
    navigate,
    businessAmendmentDetails?.businessId,
    updateBusinessAmendmentStatusIsSuccess,
  ]);

  // HANDLE RECOMMEND AMENDMENT FOR APPROVAL RESPONSE
  useEffect(() => {
    if (recommendAmendmentForApprovalIsSuccess) {
      navigate(
        `/applications/amendments?businessId=${businessAmendmentDetails?.businessId}`
      );
      window.location.reload();
    }
  }, [
    navigate,
    recommendAmendmentForApprovalIsSuccess,
    businessAmendmentDetails?.businessId,
  ]);

  // HANDLE APPROVE AMENDMENT RESPONSE
  useEffect(() => {
    if (approveAmendmentIsSuccess) {
      navigate(
        `/applications/amendments?businessId=${businessAmendmentDetails?.businessId}`
      );
      window.location.reload();
    }
  }, [
    approveAmendmentIsSuccess,
    navigate,
    businessAmendmentDetails?.businessId,
  ]);

  // HANDLE REJECT AMENDMENT RESPONSE
  useEffect(() => {
    if (rejectAmendmentIsSuccess) {
      navigate(
        `/applications/amendments?businessId=${businessAmendmentDetails?.businessId}`
      );
      window.location.reload();
    }
  }, [
    navigate,
    rejectAmendmentIsSuccess,
    businessAmendmentDetails?.businessId,
  ]);

  // HANDLE RECOMMEND AMENDMENT REJECTION RESPONSE
  useEffect(() => {
    if (recommendAmendmentRejectionIsSuccess) {
      navigate(
        `/applications/amendments?businessId=${businessAmendmentDetails?.businessId}`
      );
      window.location.reload();
    }
  }, [
    navigate,
    recommendAmendmentRejectionIsSuccess,
    businessAmendmentDetails?.businessId,
  ]);

  // NAVIGATION LINKS
  const navigationExtendedPaths = [
    ...navigationPaths,
    {
      label: 'Business Amendments',
      route: '/applications/business/amendments',
    },
    {
      label: `${
        getAmendmentDetailsIsFetching
          ? '...'
          : businessAmendmentDetails?.business?.applicationReferenceId
      }`,
      route: `/applications/amendments?businessId=${businessAmendmentDetails?.business?.id}`,
    },
    {
      label: getAmendmentDetailsIsFetching
        ? `...`
        : `${capitalizeString(
            String(businessAmendmentDetails?.amendmentType)
          )}`,
      route: `/applications/amendments/${id}/review`,
    },
  ];

  return (
    <StaffLayout>
      <main className="w-full flex flex-col gap-4">
        {getAmendmentDetailsIsFetching ? (
          <figure className="w-full flex items-center justify-center h-[40vh]">
            <Loader className="text-primary" />
          </figure>
        ) : (
          <menu className="w-full flex flex-col gap-4 p-5">
            <CustomBreadcrumb navigationLinks={navigationExtendedPaths} />
            {businessAmendmentDetails?.amendmentType ===
              'AMEND_BUSINESS_DETAILS' && <CompanyDetailsAmendmentReview />}
            {businessAmendmentDetails?.amendmentType ===
              'AMEND_BUSINESS_ADDRESS' && <CompanyAddressAmendmentReview />}
            {businessAmendmentDetails?.amendmentType ===
              'AMEND_BUSINESS_ACTIVITIES' && (
              <BusinessActivitiesAmendmentReview />
            )}
            {[
              'AMEND_ADD_BUSINESS_FOUNDER',
              'AMEND_DELETE_BUSINESS_FOUNDER',
            ].includes(String(businessAmendmentDetails?.amendmentType)) && (
              <BusinessFounderAmendmentReview />
            )}
            {[
              'AMEND_ADD_BUSINESS_BOARD_MEMBER',
              'AMEND_DELETE_BUSINESS_BOARD_MEMBER',
            ].includes(String(businessAmendmentDetails?.amendmentType)) && (
              <BusinessBoardMemberAmendmentReview />
            )}
            {[
              'AMEND_ADD_BUSINESS_EXECUTIVE_MEMBER',
              'AMEND_DELETE_BUSINESS_EXECUTIVE_MEMBER',
            ].includes(String(businessAmendmentDetails?.amendmentType)) && (
              <ExecutiveMemberAmendmentReview />
            )}
            {['AMEND_BUSINESS_EMPLOYMENT_INFO'].includes(
              String(businessAmendmentDetails?.amendmentType)
            ) && <EmploymentInfoAmendmentReview />}
            {['AMEND_BUSINESS_DORMANCY_DECLARATION'].includes(
              String(businessAmendmentDetails?.amendmentType)
            ) && <BusinessDormancyDeclarationReview />}
            {['AMEND_CESSATION_TO_BE_DORMANT'].includes(
              String(businessAmendmentDetails?.amendmentType)
            ) && <BusinessCessationToDormancyReview />}
            {['AMEND_BUSINESS_NEW_BRANCH'].includes(
              String(businessAmendmentDetails?.amendmentType)
            ) && <BusinessNewBranchReview />}
            {['AMEND_BUSINESS_TRANSFER_OF_REGISTRATION'].includes(
              String(businessAmendmentDetails?.amendmentType)
            ) && <TransferOfRegistrationReview />}
            {['AMEND_BUSINESS_DISSOLUTION'].includes(
              String(businessAmendmentDetails?.amendmentType)
            ) && <CloseBusinessAmendmentReview />}
            {['AMEND_BUSINESS_RESTORATION'].includes(
              String(businessAmendmentDetails?.amendmentType)
            ) && <RestoreBusinessAmendmentReview />}
          </menu>
        )}
        {(businessAmendmentDetails?.amendmentAttachmentDetails || [])?.length >
          0 && (
          <section className="w-full flex flex-col gap-3 px-5">
            <h3>Attachments</h3>
            <BusinessAttachmentsTable
              businessAttachmentsList={
                businessAmendmentDetails?.amendmentAttachmentDetails
              }
            />
          </section>
        )}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-[50%] flex flex-col gap-2 p-5"
        >
          <fieldset className="w-full flex flex-col gap-3">
            <Controller
              name="amendmentReviewComment"
              control={control}
              rules={{ required: 'Review comment is required to proceed' }}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-2">
                    <p className="px-1">
                      Amendment review comment{' '}
                      <span className="text-red-600">*</span>{' '}
                    </p>
                    <TextArea
                      resize
                      placeholder="Start typing here..."
                      required
                      {...field}
                    />
                    {errors?.amendmentReviewComment && (
                      <InputErrorMessage
                        message={errors?.amendmentReviewComment?.message}
                      />
                    )}
                  </label>
                );
              }}
            />
          </fieldset>
          <menu className="w-full flex items-center gap-3 justify-end">
            {watch('amendmentReviewComment') && (
              <Button submit primary className="flex self-end">
                {createAmendmentReviewCommentIsLoading ? <Loader /> : 'Save'}
              </Button>
            )}
          </menu>
        </form>
        <BusinessAmendmentReviewComments
          businessAmendment={businessAmendmentDetails}
        />
        {['AMENDMENT_SUBMITTED', 'RESUBMITTED'].includes(
          String(businessAmendmentDetails?.status)
        ) && (
          <menu className="w-full flex items-center justify-between p-5">
            <Button
              route={`/applications/amendments?businessId=${businessAmendmentDetails?.businessId}`}
            >
              Back
            </Button>
            <Button
              disabled={businessAmendmentReviewComments?.length <= 0}
              danger
              onClick={(e) => {
                e.preventDefault();
                if (businessAmendmentDetails) {
                  dispatch(
                    recommendAmendmentRejectionThunk({
                      amendmentId: businessAmendmentDetails?.id,
                    })
                  );
                }
              }}
            >
              {recommendAmendmentRejectionIsLoading ? (
                <Loader />
              ) : (
                <CustomTooltip
                  labelClassName={
                    businessAmendmentReviewComments?.length <= 0
                      ? 'bg-red-600'
                      : 'bg-transparent'
                  }
                  label={
                    businessAmendmentReviewComments?.length <= 0
                      ? 'Enter comment to submit'
                      : ''
                  }
                >
                  <p className="text-[14px]">Recommend for rejection</p>
                </CustomTooltip>
              )}
            </Button>
            <Button
              primary
              className="!bg-green-700 hover:!bg-green-700 border-none"
              onClick={(e) => {
                e.preventDefault();
                if (businessAmendmentDetails) {
                  dispatch(
                    recommendAmendmentForApprovalThunk({
                      amendmentId: businessAmendmentDetails?.id,
                    })
                  );
                }
              }}
            >
              {recommendAmendmentForApprovalIsLoading ? (
                <Loader />
              ) : (
                'Recommend for approval'
              )}
            </Button>
            <Button
              primary={businessAmendmentReviewComments?.length > 0}
              disabled={
                businessAmendmentReviewComments?.filter(
                  (amendmentReviewComment) =>
                    amendmentReviewComment?.status === 'SUBMITTED'
                )?.length <= 0
              }
              onClick={(e) => {
                e.preventDefault();
                if (businessAmendmentDetails) {
                  dispatch(
                    updateBusinessAmendmentStatusThunk({
                      id: businessAmendmentDetails?.id,
                      amendmentStatus: 'ACTION_REQUIRED',
                    })
                  );
                }
              }}
            >
              {updateBusinessAmendmentStatusIsLoading ? (
                <Loader />
              ) : (
                'Return for correction'
              )}
            </Button>
          </menu>
        )}
        {['PENDING_APPROVAL', 'PENDING_REJECTION'].includes(
          String(businessAmendmentDetails?.status)
        ) && (
          <menu className="w-full flex items-center justify-between p-5">
            <Button
              route={`/applications/amendments?businessId=${businessAmendmentDetails?.businessId}`}
            >
              Back
            </Button>
            <Button
              danger
              onClick={(e) => {
                e.preventDefault();
                if (businessAmendmentDetails) {
                  dispatch(
                    rejectAmendmentThunk({
                      amendmentId: businessAmendmentDetails?.id,
                      entityId: businessAmendmentDetails?.entityId,
                    })
                  );
                }
              }}
            >
              {rejectAmendmentIsLoading ? <Loader /> : 'Reject'}
            </Button>
            <Button
              className="!bg-green-700 hover:!bg-green-700 border-none text-white"
              onClick={(e) => {
                e.preventDefault();
                if (businessAmendmentDetails) {
                  dispatch(
                    approveAmendmentThunk({
                      amendmentId: businessAmendmentDetails?.id,
                    })
                  );
                }
              }}
            >
              {approveAmendmentIsLoading ? <Loader /> : 'Approve'}
            </Button>
            <Button
              primary={
                businessAmendmentReviewComments?.filter(
                  (amendmentReviewComment) =>
                    amendmentReviewComment?.status === 'SUBMITTED'
                )?.length > 0
              }
              disabled={
                businessAmendmentReviewComments?.filter(
                  (amendmentReviewComment) =>
                    amendmentReviewComment?.status === 'SUBMITTED'
                )?.length <= 0
              }
              onClick={(e) => {
                e.preventDefault();
                if (businessAmendmentDetails) {
                  dispatch(
                    updateBusinessAmendmentStatusThunk({
                      id: businessAmendmentDetails?.id,
                      amendmentStatus: 'ACTION_REQUIRED',
                    })
                  );
                }
              }}
            >
              {updateBusinessAmendmentStatusIsLoading ? (
                <Loader />
              ) : (
                'Return for correction'
              )}
            </Button>
          </menu>
        )}
      </main>
      <DeleteAmendmentReviewComment />
      <UpdateAmendmentReviewComment />
    </StaffLayout>
  );
};

export const BusinessAmendmentRequestSummary = ({
  businessAmendment,
}: {
  businessAmendment?: BusinessAmendment;
}) => {
  return (
    <section className="w-full flex flex-col gap-4">
      <h2 className="uppercase text-primary font-semibold text-lg">
        Company details
      </h2>
      <menu className="grid grid-cols-2 gap-5 w-full">
        <ul className="flex items-center gap-2">
          <p>Application Reference ID:</p>
          <p className="font-medium">
            {businessAmendment?.business?.applicationReferenceId}
          </p>
        </ul>
        <ul className="flex items-center gap-2">
          <p> Company name:</p>
          <p className="font-medium">
            {businessAmendment?.business?.companyName ||
              businessAmendment?.business?.branchName ||
              businessAmendment?.business?.enterpriseName ||
              businessAmendment?.business?.enterpriseBusinessName}
          </p>
        </ul>
        <ul className="flex items-center gap-2">
          <p> Application status:</p>
          <p className="font-medium">
            {capitalizeString(businessAmendment?.business?.applicationStatus)}
          </p>
        </ul>
        <ul className="flex items-center gap-2">
          <p>Is Foreign:</p>
          <p className="font-medium">
            {businessAmendment?.business?.isForeign ? 'Yes' : 'No'}
          </p>
        </ul>
        <ul className="flex items-center gap-2">
          <p>Company code: </p>
          <p className="font-medium">
            {businessAmendment?.business?.tin || 'N/A'}
          </p>
        </ul>
        <ul className="flex items-center gap-2">
          <p>Request date:</p>
          <p className="font-medium">
            {formatDateTime(businessAmendment?.createdAt)}
          </p>
        </ul>
      </menu>
    </section>
  );
};

export default BusinessAmendmentReview;
